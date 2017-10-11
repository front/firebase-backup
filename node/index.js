const https = require('https');
const fs = require('fs');
const moment = require('moment');
const config = require('./config.js');

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
			console.log('SUCCESS ', moment().format('YYYY-M-D H.m.s').toString(), ' JSON saved to ', filename);
		}
	});
}

init = () => {
	getData();
	setInterval(getData, config.scriptInterval);
}

init();
