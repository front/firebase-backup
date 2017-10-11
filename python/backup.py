import urllib2
import time
import threading

config = {
  'databaseURL': 'https://{YOUR_FIREBAE_APP_URL}.firebaseio.com',
  'databaseSecret': 'YOUR_FIREBASE_SECRET',
  'interval': 21600
}

def backupFirebase():
  threading.Timer(config['interval'], backupFirebase).start()
  databaseContent = urllib2.urlopen(config['databaseURL'] + '/.json?format=export&auth=' + config['databaseSecret']).read()
  fileName = time.strftime('%Y-%m-%d %H-%M-%S') + '.json'
  file = open('../backups/' + fileName, 'w')
  file.write(databaseContent)
  file.close()

backupFirebase()