# Using node.js

## Running Script

Make sure you have [Node.js](http://nodejs.org/) installed.

```sh
git clone https://github.com/front/firebase-backup
cd firebase-backup/node
```

Rename `config-example.js` to `config.js` then set `firebaseUrl` and `firebaseSecret` in `config.js`.
You can find firebaseUrl in [console.firebase.google.com](https://console.firebase.google.com/) under projects/your-project/database and firebaseSecret under Project-settings/service-account/Database-secret.
Also You can edit `scriptInterval`, by default it runs every 6 hours.

Then run: 
```sh
npm install
npm start
```

## Using pm2
Make sure you have `pm2` up and running on your server.
To create a pm2 task, run
```sh
pm2 start --name YOUR_APP_NAME npm -- start
```

## Credits
* [hardiksondagar/firebase-backup](https://github.com/hardiksondagar/firebase-backup)
* [sergiopantoja/firebase-backup-node](https://github.com/sergiopantoja/firebase-backup-node)
