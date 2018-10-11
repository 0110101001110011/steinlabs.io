var SCROLL_TARGET = document.getElementById("scroll-target");
var LAST_Y_POS = 0;
var LAST_SCROLL_DELTA = 0;
var CURRENT_INDEX = 0;
var MAX_INDEX = Math.max(document.getElementsByClassName("section-base").length - 1, 0);
const TIME_PER_PAGE = 500;
const ZS = zenscroll.createScroller(SCROLL_TARGET, 500, 0);

function clamp(a, min, max) {
    return Math.min(Math.max(a, min), max);
}

function getScrollbarWidth() {
    return window.innerWidth - SCROLL_TARGET.clientWidth;
}

function scrollToSection(sectionid) {
    targetIndex = sectionid.substring(1, sectionid.length);
    difference = targetIndex - CURRENT_INDEX;
    LAST_SCROLL_DELTA = clamp(difference, -1, 1);

    CURRENT_INDEX = clamp(CURRENT_INDEX + difference, 0, MAX_INDEX);

    time = TIME_PER_PAGE * Math.ceil((Math.abs(difference) / 2));
    ZS.to(document.getElementById(sectionid), time);
}

SCROLL_TARGET.style.paddingRight = getScrollbarWidth().toString() + "px";

function scroll(deltaY, hops = 1) {
    if (ZS.moving()) {
        return;
    }

    LAST_SCROLL_DELTA = clamp(deltaY, -1, 1);
    CURRENT_INDEX = clamp(CURRENT_INDEX + LAST_SCROLL_DELTA * hops, 0, MAX_INDEX);
    id = "s" + CURRENT_INDEX;
    time = TIME_PER_PAGE * Math.ceil((Math.abs(hops) / 2));
    ZS.to(document.getElementById(id), time);
}

SCROLL_TARGET.addEventListener('wheel', function (e) {
    scroll(e.deltaY);
    e.preventDefault();
});

SCROLL_TARGET.addEventListener('touchstart', function (e) {
    LAST_Y_POS = e.targetTouches[0].clientY;
});

SCROLL_TARGET.addEventListener('touchmove', function (e) {
    scroll(LAST_Y_POS - e.targetTouches[0].clientY);
    e.preventDefault();
    LAST_Y_POS = e.targetTouches[0].clientY;
});

window.addEventListener('keydown', function (e) {
    kc = e.keyCode;

    if ([34, 35, 40].includes(kc) || (kc == 32 && !e.shiftKey)) {
        if (kc == 35){
            scroll(1, MAX_INDEX);
        } else {
            scroll(1);
        }
        e.preventDefault();
    } else if ([33, 36, 38].includes(kc) || (kc == 32 && e.shiftKey)) {
        if (kc == 36){
            scroll(-1, MAX_INDEX);
        } else {
            scroll(-1);
        }
        
        e.preventDefault();
    }
});

SCROLL_TARGET.addEventListener('mousedown', function (e) {
    if (e.which == 2) {
        LAST_Y_POS = e.clientY;
        e.preventDefault();
    }
});

SCROLL_TARGET.addEventListener('mousemove', function (e) {
    if (e.which == 2) {
        scroll(e.clientY - LAST_Y_POS);
        e.preventDefault();
        LAST_Y_POS = e.clientY;
    }
});


window.addEventListener("resize", function (e) {
    ZS.stop();
    id = "s" + CURRENT_INDEX;
    ZS.to(document.getElementById(id), 100);
});
