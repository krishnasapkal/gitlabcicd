#!/usr/bin/env node
const fs = require('fs');
var ncp = require('ncp').ncp;
ncp.limit = 16;
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
var path = require('path');
global.appRoot = path.resolve(__dirname);

console.log(process.argv);
fs.writeFile(process.cwd() + "/.gitlab-ci.yml", "", function (err) {
    console.log(err);
 });

fs.copyFile(appRoot +'/deploy/uandr.sh', appRoot + '/deploy/updateAndRestart.sh', (err) => {
    if (err) throw err;
 
  });

start().then(async (deployConfig) => {
    text = `image: ${deployConfig.image || "node:8.6.0"}` + ` \nbefore_script: \n - 'which ssh-agent || ( apt-get update -y && apt-get install openssh-client -y )' \n - npm install `
    await write(text);
    text = "\nstages: \n- build \n- test \n- deploy"
    await write(text);
    //for the dev server
    deployConfig.servers.forEach(async server => {
        await write("\n \n");
        await write("\ndev building and testing stage:");
        await write(`\n stage : build \n only: \n - ${server.brachName} \n script :`);
        server.buildScript.forEach(async element => {
            await write(`\n - ${element}`);
        });

        await write("\n ");
        await write("\ndev deployment stage:");
        await write(`\n stage : deploy \n only: \n  - ${server.brachName} \n script :`);
        //  await write(`\n - ${server.deployScript[0]} '${server.address}' '${deployConfig.username}' '${deployConfig.password}' '${deployConfig.repository}'`);
        let dScript = `\n - bash ./deploy/deploy.sh  '${server.address}' '${deployConfig.gitlabUsername}' '${deployConfig.gitlabPassword}' '${deployConfig.gitlabRepository}'`;
        await write(dScript);
        let result;
           
            fs.readFile(appRoot +"/deploy/updateAndRestart.sh", 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                }
                 result = data;
                 server.deployScript.forEach(( element , i) => {
                    console.log(element);
                    let s = '#replacescript' + i;
                    let reg = new RegExp(s,"g");
                    result = result.replace(reg, element);
                   
                    fs.writeFile(appRoot +"/deploy/updateAndRestart.sh", result, 'utf8', function (err) {
                        if (err) return console.log(err);
                    });
              
            });
            });
   
    })


}).then(()=>{
    ncp(appRoot+"/deploy", process.cwd() +"/deploy", function (err) {
        if (err) {
          return console.error(err);
        }
        console.log('Hurrey its done ! (Dont Delete Deployment Folder Which is created at your root)');
       });
})



function start() {
    var details = {
        servers: []
    };
    return new Promise(async (resolve, reject) => {

        if (!process.argv[2]) {
            console.log("Make sure you are running this from root directory of your app");
            details.image = await read('Enter Image To enter. Default : node:8.6.0  \n');
            details.gitlabUsername = await read('Whats ur gitlab username ? \n');
            details.gitlabPassword = await read('Whats ur gitlab password ?  Warning : Please Make Sure Your Repo is Private \n');
            details.gitlabRepository = await read('Please enter repository name. \n');
            let n = await read('Enter no of servers. \n');
            details.servers = [];
            for (i = 1; i <= n; i++) {
                let server = {
                    buildScript: [],
                    deployScript: []
                };

                server.address = await read("Please enter address or ip for server " + i + "\n");
                server.username = await read("Please enter username for server " + i + "\n");
                server.brachName = await read("Please enter branch of the git repo. (Only this branch will be deployed on this server) \n");
                let z = 0;
                console.log("Enter commands for building application.(One command on one line)");
                for (let co = 0; co < 9; co--) {
                    z++
                    let text = await read("command no " + z + "\n");
                    if (text == 0) {
                        break;
                    }
                    else {
                        server.buildScript.push(text);
                    }
                    console.log("Enter 0 when all commands are entered");
                }
                z = 0;
                console.log("Enter commands for Deploying application.(One command on one line)");
                for (let co = 0; co < 9; co--) {
                    z++
                    let text = await read("command no " + z + "\n");
                    if (text == 0) {
                        break;
                    }
                    else {
                        server.deployScript.push(text);
                    }
                    console.log("Enter 0 when all commands are entered");
                }


                details.servers.push(server);
            }
            readline.close();
          
            resolve(details);
        }
        else {
            console.log(__dirname);
            var arg = require(process.cwd() +"/"+ process.argv[2]);
            resolve(arg)
        }
    })

}


function read(text) {
    return new Promise((resolve, reject) => {
        readline.question(text, function (data) {
            //console.log('data:' + data);
            resolve(data)

        });
    });
};

function write(text) {
    return new Promise((resolve,reject)=>{
        console.log(text);
        fs.appendFile(process.cwd()+"/./.gitlab-ci.yml", text, function (err) {

            if (err) {
                reject(err);
            }
                resolve(true)
        });
    })
   
};

