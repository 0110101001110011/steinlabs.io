var SCROLL_TARGET = document.getElementById("scroll-target");
var PAGES = Array.prototype.slice.call(document.getElementsByClassName("section-base")).sort(function(a, b) {return a.id > b.id});
var MAX_INDEX = Math.max(PAGES.length - 1, 0);
var CURRENT_INDEX = 0;
var CONTENT_INDICATOR = document.getElementById("content-indicator");
var VN_TEXT_BLOCKS = Array.prototype.slice.call(document.getElementsByClassName("vn-text")).sort(function(a, b) {return a.id > b.id});
var CURRENT_VN_TEXT_INDEX = 0;
var MAX_VN_TEXT_INDEX = Math.max(VN_TEXT_BLOCKS.length - 1, 0);
var VN_ARROW_LEFT = document.getElementById("vn-arrow-left");
var VN_ARROW_RIGHT = document.getElementById("vn-arrow-right");

const TIME_PER_PAGE = 500;
const ZS = zenscroll.createScroller(SCROLL_TARGET, 500, 0);

// Helpers
function clamp(a, min, max) {
    return Math.min(Math.max(a, min), max);
}

function getScrollbarWidth() {
    return window.innerWidth - SCROLL_TARGET.clientWidth;
}

function vnStep(evant, delta) {
    if (event) event.preventDefault();
    previousIndex = CURRENT_VN_TEXT_INDEX;
    CURRENT_VN_TEXT_INDEX = clamp(CURRENT_VN_TEXT_INDEX + delta, 0, MAX_VN_TEXT_INDEX);
    VN_TEXT_BLOCKS[previousIndex].classList.toggle("hidden");
    VN_TEXT_BLOCKS[CURRENT_VN_TEXT_INDEX].classList.toggle("hidden");
    
    if (CURRENT_VN_TEXT_INDEX == 0) {
        VN_ARROW_LEFT.classList.add("non-active");
        VN_ARROW_RIGHT.classList.remove("non-active");
    }
    else if (CURRENT_VN_TEXT_INDEX == MAX_VN_TEXT_INDEX) {
        VN_ARROW_LEFT.classList.remove("non-active");
        VN_ARROW_RIGHT.classList.add("non-active");
    }
    else {
        VN_ARROW_LEFT.classList.remove("non-active");
        VN_ARROW_RIGHT.classList.remove("non-active");
    }
}

function scrollToSection(sectionIndex) {
    difference = sectionIndex - CURRENT_INDEX;
    LAST_SCROLL_DELTA = clamp(difference, -1, 1);

    CURRENT_INDEX = clamp(CURRENT_INDEX + difference, 0, MAX_INDEX);

    time = TIME_PER_PAGE * Math.ceil((Math.abs(difference) / 2));
    ZS.to(PAGES[sectionid], time);
}

function scroll(deltaY, hops) {
    if (ZS.moving()) {
        return;
    }

    LAST_SCROLL_DELTA = clamp(deltaY, -1, 1);
    CURRENT_INDEX = clamp(CURRENT_INDEX + LAST_SCROLL_DELTA * hops, 0, MAX_INDEX);
    time = TIME_PER_PAGE * Math.ceil((Math.abs(hops) / 2));
    ZS.to(PAGES[CURRENT_INDEX], time);
}

function scrollWrap(deltaY, hops) {
    scroll(deltaY, hops);
}

function init() {
    SCROLL_TARGET.style.paddingRight = getScrollbarWidth().toString() + "px";

    SCROLL_TARGET.addEventListener('wheel', function (e) {
        scroll(e.deltaY, 1);
        e.preventDefault();
    });
    
    SCROLL_TARGET.addEventListener('touchstart', function (e) {
        LAST_Y_POS = e.targetTouches[0].clientY;
    });
    
    SCROLL_TARGET.addEventListener('touchmove', function (e) {
        scroll(LAST_Y_POS - e.targetTouches[0].clientY, 1);
        e.preventDefault();
        LAST_Y_POS = e.targetTouches[0].clientY;
    });
    
    window.addEventListener('keydown', function (e) {
        kc = e.keyCode;
    
        if ([34, 35, 40].includes(kc) || (kc == 32 && !e.shiftKey)) {
            if (kc == 35){
                scroll(1, MAX_INDEX);
            } else {
                scroll(1, 1);
            }
            e.preventDefault();
        } else if ([33, 36, 38].includes(kc) || (kc == 32 && e.shiftKey)) {
            if (kc == 36){
                scroll(-1, MAX_INDEX);
            } else {
                scroll(-1, 1);
            }
            
            e.preventDefault();
        }

        if (CURRENT_INDEX == 1) {
            if ([8, 37].includes(kc)) {
                vnStep(null, -1);
            } else if ([13, 39].includes(kc)) {
                vnStep(null, 1);
            }
        }
    });
    
    SCROLL_TARGET.addEventListener('mousedown', function (e) {
        if (e.button == 1) {
            LAST_Y_POS = e.clientY;
            e.preventDefault();
        }
    });
    
    SCROLL_TARGET.addEventListener('mousemove', function (e) {
        if (e.button == 1) {
            scroll(e.clientY - LAST_Y_POS, 1);
            e.preventDefault();
            LAST_Y_POS = e.clientY;
        }
    });

    VN_ARROW_LEFT.addEventListener('click', function (e) {
        vnStep(e, -1);
    });

    VN_ARROW_RIGHT.addEventListener('click', function (e) {
        vnStep(e, 1);
    })

    VN_ARROW_LEFT.addEventListener('touchmove', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });

    VN_ARROW_RIGHT.addEventListener('touchmove', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });
    
    window.addEventListener("resize", function (e) {
        ZS.stop();
        ZS.to(PAGES[CURRENT_INDEX], 0);
    });
}

init();