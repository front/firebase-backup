const https = require('https');
const fs = require('fs');
const moment = require('moment');

const firebaseUrl = 'https://push-notification-20514.firebaseio.com';
const firebaseSecret = 'wYejrY8PMOZuX0Looq3AS66oOCCtYEdvscoiNQC5';

getData = function() {
	const url = firebaseUrl+'/.json?format=export&auth='+firebaseSecret;
	const scoreReq = https.get(url, response => {
		let completeResponse = '';
		response.on('data', chunk => {
			completeResponse += chunk;
		});
		response.on('end', () => {
			backup(completeResponse);
		})
	}).on('error', e => {
		console.log('ERROR ', new Date(), ' problem with request: ', e.message);
	});
}

backup = function(data) {
	let filename = __dirname + '/backups/' + moment().format('YYYY-M-D H.m.s').toString() + '.json';
	fs.writeFile(filename, data, err => {
		if(err) {
			console.log(err);
		} else {
			console.log('SUCCESS ', moment().format('YYYY-M-D H.m.s').toString(), ' JSON saved to ', filename);
		}
	});
}

init = function() {
	getData();
	setInterval(getData, 21600000);
}

init();
