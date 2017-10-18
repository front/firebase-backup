const https = require('https');
const fs = require('fs');
const moment = require('moment');
const config = require('./config.js');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

getData = () => {
	const url = config.firebaseUrl+'/.json?format=export&auth=' + config.firebaseSecret;
	const scoreReq = https.get(url, response => {
		let completeResponse = '';
		response.on('data', chunk => {
			completeResponse += chunk;
		});
		response.on('end', () => {
			backup(completeResponse);
		})
	}).on('error', e => {
		console.log('Error: ', moment().format('YYYY-M-D H.m.s').toString(), ' Request rejected: ', e.message);
	});
}

backup = data => {
	let filename = __dirname + '/../backups/' + moment().format('YYYY-M-D H.m.s').toString() + '.json';
	fs.writeFile(filename, data, err => {
		if(err) {
			console.log(err);
		} else {
			config.sendToDrive ? sendFileToDrive(data) : '';
			console.log('SUCCESS ', moment().format('YYYY-M-D H.m.s').toString(), ' JSON saved to ', filename);
		}
	});
}

init = () => {
	getData();
	setInterval(getData, config.scriptInterval);
}

init();

var folderId = config.folderId;
function sendFileToDrive(filename, backupFile) {
	fs.readFile('client_secret.json', function processClientSecrets(err, content) {
		if (err) {
			console.log('Error loading client secret file: ' + err);
			return;
		}
		authorize(JSON.parse(content), uploadFile, backupFile);
	});

}

function uploadFile(auth, backupFile) {
	var fileMetadata = {
		'name': new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
		'mimeType': 'application/json',
		'parents': [folderId]
	};
	var media = {
		mimeType: 'application/json',
		body: backupFile
	};
	google.drive('v3').files.create({
		resource: fileMetadata,
		media: media,
		auth: auth,
		fields: 'id'
	}, function (err, file) {
		if (err) {
			// Handle error
			console.error('Error: ', err);
		} else {
			console.log('File Id:', file.id);
		}
	});
}

var SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs.json';


function authorize(credentials, callback, backupFile) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client, backupFile);
    }
  });
}

function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}
