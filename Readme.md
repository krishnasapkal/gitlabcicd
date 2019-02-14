
# Automatically Set up Gitlab CICD

Generate gitlab.yml file automatically along with the bash script file which will automatically setup Gitlab CICD Using Docker and Gitlab Runner For You.


### Command Line

Easily Setup Your Gitlab CICD in Minutes.

prerequisites : Install gitlab runner and docker on server              (https://docs.gitlab.com/runner/install/)


Add Private key of your server to Environment Variable of gitlab 

                PRIVATE_KEY : "private key"




```bash
# install the bin script
npm install -g gitlabcicd


# Quick Start(Build Cicd interactively on command line)

## Run gitlabcicd from your Command Line
gitlabcicd


### Give path of json file 

gitlabcicd ./path.json

#json format
  {
  image: 'nodeimage version',
  gitlabUsername: 'Gitlab Username',
  gitlabPassword: 'Gitlab Password',
  gitlabRepository: 'Repository_Name',
    servers: 
   [ 
     { 
       buildScript: ["build command 1" ...... ," build command N","Test Command one"...."Test Command N"],
       deployScript: ["Deploy command 1" ,"Deploy command 2" ...... ," Deploy command N"],
       address: 'ip or address of your server',
       username: 'Server User name',
       brachName: 'Name of branch you wannt to deploy on server' 
       
       },

        {
       buildScript: ["build command 1" ...... ," build command N","Test Command one"...."Test Command N"],
       deployScript: ["Deploy command 1" ,"Deploy command 2" ...... ," Deploy command N"],
       address: 'ip or address of your server',
       username: 'Server User name',
       brachName: 'Name of branch you wannt to deploy on server'
        } 
       ]
   }


  ##example

  #json Example for 2 servers

    { 
       image: '',
  gitlabUsername: 'git_username',
  gitlabPassword: 'password',
  gitlabRepository: 'example_backend',

      servers: 
   [ 
     {
      buildScript: [
                    "npm install",
                    "npm install lint",
                    "node node-lint",
                    "npm install pm2 -g",
                    "pm2 start app"
                    ],
       deployScript: [
                      "npm install",
                      "sudo pm2 start app.js"
                      ],
       address: 'exampleServer1.com',
       username: 'ubuntuExampleserver',
       brachName: 'dev'
        },
        {
      buildScript: [
                    "npm install",
                    "npm install lint",
                    "node node-lint",
                    "npm install pm2 -g",
                    "pm2 start app"
                    ],
       deployScript: [
                      "npm install",
                      "sudo pm2 start app.js"
                      ],
       address: 'exampleServer2.com',
       username: 'ubuntuExampleserver2',
       brachName: 'prod'
        },

        ]
       }

  gitlabcicd path.json  




