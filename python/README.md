# Using python

## Running Script

```sh
git clone https://github.com/front/firebase-backup
cd firebase-backup/python
```

Set `databaseURL` and `databaseSecret` inside `config` array.
You can find firebaseUrl in [console.firebase.google.com](https://console.firebase.google.com/) under projects/your-project/database and firebaseSecret under Project-settings/service-account/Database-secret.
You can also edit `scriptInterval`, by default it runs every 6 hours.

Then run: 
```sh
python backup.py
```

## Running intervals

By default, running intervals set to 6 hours, you can change it according to your needs.