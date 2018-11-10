const VIDEO_PLAYERS = document.getElementsByClassName("vid");
for (let index = 0; index < VIDEO_PLAYERS.length; index++) {
    this.vps = [];
    const player = new Plyr("#" + VIDEO_PLAYERS[index].id, {});
    this.vps[index] = player;
}
