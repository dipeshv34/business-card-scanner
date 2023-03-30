# Node Express Mongo Full Stack Structure
​
### 1. Install / Upgrade Node  (v14.16.1)
```
sudo apt update
sudo apt install nodejs
sudo apt install npm
```
**Using NVM:**
```
curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.35.3/install.sh -o install_nvm.sh
nvm install 16.4.2
```
For more details: https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04
​
### 2. Install mongo db (v4.4)
```
curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
sudo systemctl start mongod
sudo systemctl status mongod
```
For more details: https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-18-04-source
​
### 3. Clone repository to your local 
​
### 4. Set environments
Add following varaibles in env files
​```
DB_NAME=<<Your Database Name>>
IS_SEED=true
MONGO_CNNSTR=mongodb://<<your usename>>:<<your password>>@localhost:27017/<<Your Database Name>>
PORT=4000
SECRET_KEY=uV0lLbUzAoAvXpZjiiyxaxmtKY9sYDAN // Generate new
​```
### 5. Install Dependencies
To install dependencies, run following command in your terminal.
**Note: Terminal path must be project directory's root path**
```
npm install
```
​
### 6. SEED Database
If you need to seed database initially,
Simply enable `IS_SEED=true` in your .env file
Don't forgot to do `IS_SEED=false` after 1st use
​
### RUN
In your project root open terminal and run following command to run the project
```
npm start
```