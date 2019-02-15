#!/bin/bash

# any future command that fails will exit the script
sudo set -e

# Delete the old repo
sudo rm -rf /home/ubuntu/$3/

# clone the repo again
sudo git clone https://"$1":"$2"@gitlab.com/$1/$3.git

#source the nvm file. In an non
#If you are not using nvm, add the actual path like
PATH=/home/ubuntu/node/bin:$PATH
#source /home/ubuntu/.nvm/nvm.sh
pwd
cd /home/ubuntu/$3
# stop the previous pm2
#pm2 needs to be installed globally as we would be deleting the repo folder.
# this needs to be done only once as a setup script.
# starting pm2 daemon
sudo pm2 status
cd /home/ubuntu/$3
git checkout dev
#install npm packages
echo "Deploying"
#sudo npm install
#Restart the node server
#sudo pm2 restart server.js
dassda
#replacescript2
#replacescript3
#replacescript4
#replacescript5
#replacescript6
#replacescript7
#replacescript8
#replacescript9
