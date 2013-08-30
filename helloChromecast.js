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
var currentVolume = 0.5;
var receivers = [];

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
}

function selectMedia(m) {
  console.log("media selected" + m);
  document.getElementById('video').src = m;
}

function castMedia(i) {
  if( currentActivityId ) return;

  console.log("casting media to" + receivers[i]);
  currentReceiver = receivers[i];

  var launchRequest = new cast.LaunchRequest(applicationID, receivers[i]);
  launchRequest.parameters = '';

  var videoSrc = document.getElementById('video');

  var loadRequest = new cast.MediaLoadRequest(videoSrc.currentSrc);
  loadRequest.autoplay = true;

  castApi.launch(launchRequest, function(status) {
    if (status.status == 'running') {
      currentActivityId = status.activityId;
      castApi.loadMedia(currentActivityId,
                              loadRequest,
                              updateUI);
    } else {
      console.log('Launch failed: ' + status.errorString);
    }
  });

}

function updateUI(status) {
  if( status.success == true ) {
    var media_control = document.getElementById('media_control');
    media_control.style.display = 'block';

    var icon_id = currentReceiver.id;
    var cast_icon = document.getElementById('cast' + icon_id);
    cast_icon.src = 'icons/drawable-mdpi/ic_media_route_on_holo_light.png'; 
  }
}

function stopActivity() {
  castApi.stopActivity(currentActivityId, function() {
    var cast_icon = document.getElementById("cast" + currentReceiver.id);
    cast_icon.src = "icons/drawable-mdpi/ic_media_route_off_holo_light.png";
    currentActivityId = null;
  });
}

function getActivityStatus() {
  castApi.getActivityStatus(currentActivityId, function(status) {
    var activity_status = document.getElementById('activity_status');
    activity_status.innerHTML = status.status;
  });
}

function getMediaStatus() {
  castApi.getMediaStatus(currentActivityId, function(status) {
    var media_status = document.getElementById('media_status');
    media_status.innerHTML = JSON.stringify(status.status);
  });
}

function playMedia() {
  castApi.playMedia(
      currentActivityId,
      new cast.MediaPlayRequest(),
      function() {});
}

function pauseMedia() {
  castApi.pauseMedia(
      currentActivityId,
      function() {});
}

function muteMedia() {
  castApi.setMediaVolume(
      currentActivityId,
      new cast.MediaVolumeRequest(0, true),
      function() {});
}

function unmuteMedia() {
  castApi.setMediaVolume(
      currentActivityId,
      new cast.MediaVolumeRequest(currentVolume, false),
      function() {});
}

function setVolume(v) {
  castApi.setMediaVolume(
      currentActivityId,
      new cast.MediaVolumeRequest(v, false),
      function() {});
}

function changeVolume() {
  console.log("change volume");
  currentVolume = document.getElementById('volume').value/10;
  setVolume(currentVolume);
}
