// Copyright 2013 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var applicationID = 'YOUR_APP_ID';
var castApi;
var currentActivityId = null;
var currentReceiver;
var receivers = [];
var media = [
           'http://commondatastorage.googleapis.com/gtv-videos-bucket/big_buck_bunny_1080p.mp4',
           'http://commondatastorage.googleapis.com/gtv-videos-bucket/ED_1280.mp4',
           'http://commondatastorage.googleapis.com/gtv-videos-bucket/tears_of_steel_1080p.mov',
           'http://commondatastorage.googleapis.com/gtv-videos-bucket/reel_2012_1280x720.mp4',
           'http://commondatastorage.googleapis.com/gtv-videos-bucket/Google%20IO%202011%2045%20Min%20Walk%20Out.mp3'];
var currentMedia = media[0];

if (window.cast && window.cast.isAvailable) {
  // Already initialized
  initializeCastApi();
} else {
  // Wait for API to post a message to us
  window.addEventListener("message", function(event) {
    if (event.source == window && event.data && event.data.source == "CastApi" && event.data.event == "Hello"){
      initializeCastApi();
    }
  });
};

initializeCastApi = function() {
  castApi = new cast.Api();
  castApi.addReceiverListener(applicationID, onReceiverList);
};

function onReceiverList(list) {
  if( list.length > 0 ) {
    console.log("receiver list" + list);
    var receiverDiv = document.getElementById('receivers');
    var temp = ''; 

    for( var i=0; i < list.length; i++ ) {
      receivers.push(list[i]);
      temp += '<div style="float:left; padding:10px; margin:10px;">' + list[i].name;
      temp += '<img src="icons/drawable-mdpi/ic_media_route_off_holo_light.png" id="cast';
      temp += list[i].id + '" onclick="castMedia(' + i + ')"></div>';
    }
    console.log(temp);
    receiverDiv.innerHTML = temp;
    document.getElementById("receiver_msg").innerHTML = "Click a Chromecast icon to cast video";
  }
  else {
    console.log("receiver list empty");
    document.getElementById("receiver_msg").innerHTML = "No Chromecast devices found";
  }
}

function selectMedia(m) {
  console.log("media selected" + m);
  currentMedia = media[m]; 
}

function castMedia(i) {
  console.log("casting media to" + receivers[i]);
  currentReceiver = receivers[i];

  var launchRequest = new cast.LaunchRequest(applicationID, receivers[i]);
  launchRequest.parameters = '';

  var loadRequest = new cast.MediaLoadRequest(currentMedia);
  loadRequest.autoplay = true;

  castApi.launch(launchRequest, function(status) {
    if (status.status == 'running') {
      currentActivityId = status.activityId;
      castApi.loadMedia(currentActivityId,
                              loadRequest,
                              launchCallback);
    } else {
      console.log('Launch failed: ' + status.errorString);
    }
  });

}

function launchCallback(status) {
  if( status.success == true ) {
    var icon_id = currentReceiver.id;
    var cast_icon = document.getElementById('cast' + icon_id);
    cast_icon.src = 'icons/drawable-mdpi/ic_media_route_on_holo_light.png';
  }
}
