# Using php

Here I used cUrl, there is some other ways to get firebase content, for example `file_get_contents($database_url)`. But some servers (including our VPS hosting) don't have file_get_content by default.

## Running Script

```sh
git clone https://github.com/front/firebase-backup
cd firebase-backup/php
```

Rename `config-example.php` to `config.php` then set `firebase_url` and `firebase_secret`.
You can find firebaseUrl in [console.firebase.google.com](https://console.firebase.google.com/) under projects/your-project/database and firebaseSecret under Project-settings/service-account/Database-secret.
Also You can edit `scriptInterval`, by default it runs every 6 hours.

Then run: 
```sh
php index.php
```

I will try to add more guide to create cron job for this script.
