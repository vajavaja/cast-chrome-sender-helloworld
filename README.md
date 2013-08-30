cast-ios-demo-player
====================

This Google Cast demo app shows basic casting of video and audio to Chromecast device from Chrome browser.

Setup Instructions

Pre-requisites
 1. Get a Chromecast device
 2. Get your device whitelisted: https://developers.google.com/cast/whitelisting
   2a. Install Chrome extension for Google Cast
   2b. Whitelist your domain (see detailed instructions in the above link)
 
Steps:
 1. Put all files on your own server
 2. Change YOUR_APP_ID in both sender e.g. helloWorld.js and receiver (e.g. receiver.html)
 3. Open a browser and point to your page at http://[YOUR_SERVER_LOCATION]/helloWorld.html
