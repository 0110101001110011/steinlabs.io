window.onload = function () {
    var vid = document.getElementById("splash-video");
    var fader = document.getElementById("video-fader");

    vid.onplay = fader.classList.remove('black-overlay'); 

    if ((typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)) {   
        vid.oncanplay = vid.play();
    }
};