<?php
// Require config file
require_once('config.php');
// Filename, here we use date and time, feel free to change according to your needs.
$filename = date('Y-m-d H-i-s').'.json';
// File location. It is inside backups folder, change if you use different approach
$file_location = getcwd() . '/../backups/'.$filename;
// Here using cUrl, making api request
$curl = curl_init();
curl_setopt_array($curl, array(
  CURLOPT_URL => $firebase_url . "/.json?format=export&auth=" . $database_secret,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "GET"
));
$response = curl_exec($curl);
$err = curl_error($curl);
curl_close($curl);

if ($err) {
  // In case there is some errors, print them out
  echo "cURL Error #:" . $err;
} else {
  // Else, write the response to file
  $backup_file = fopen($file_location, 'wb');
  fwrite($backup_file, $response);
  fclose($backup_file);
  echo 'File \'' . $filename . '\' successfully has been created.';
}