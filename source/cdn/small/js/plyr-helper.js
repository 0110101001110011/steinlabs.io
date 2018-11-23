"use strict";

var VIDEO_PLAYERS = document.getElementsByClassName("vid");
var vps = [];
for (var index = 0; index < VIDEO_PLAYERS.length; index++) {
    var player = new Plyr("#" + VIDEO_PLAYERS[index].id, {});
    vps[index] = player;
}