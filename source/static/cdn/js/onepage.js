var SCROLL_TARGET = document.getElementById("scroll-target");
var LAST_Y_POS = 0;
var LAST_SCROLL_DIR = 'UP';
var CURRENT_INDEX = 0;
var MAX_INDEX = 2;

// Credit https://coderwall.com/p/hujlhg/smooth-scrolling-without-jquery
var smooth_scroll_to = function (element, target, duration) {
    target = Math.round(target);
    duration = Math.round(duration);
    if (duration < 0) {
        return Promise.reject("bad duration");
    }
    if (duration === 0) {
        element.scrollTop = target;
        return Promise.resolve();
    }

    var start_time = Date.now();
    var end_time = start_time + duration;

    var start_top = element.scrollTop;
    var distance = target - start_top;

    var delta = Math.min(Math.max(distance, -1), 1);

    // based on http://en.wikipedia.org/wiki/Smoothstep
    var smooth_step = function (start, end, point) {
        if (point <= start) { return 0; }
        if (point >= end) { return 1; }
        var x = (point - start) / (end - start);
        return x * x * (3 - 2 * x);
    }

    return new Promise(function (resolve, reject) {
        var previous_top = element.scrollTop;

        var scroll_frame = function () {
            if (element.scrollTop != previous_top) {
                return;
            }

            if (delta < 0) {
                LAST_SCROLL_DIR = 'UP';
            } else {
                LAST_SCROLL_DIR = 'DOWN';
            }
            
            var now = Date.now();
            var point = smooth_step(start_time, end_time, now);
            var frameTop = Math.round(start_top + (distance * point));
            element.scrollTop = frameTop;

            if (now >= end_time) {
                CURRENT_INDEX = Math.min(Math.max(CURRENT_INDEX + delta, 0), MAX_INDEX);
                resolve();
                return;
            }

            if (element.scrollTop === previous_top
                && element.scrollTop !== frameTop) {
                CURRENT_INDEX = Math.min(Math.max(CURRENT_INDEX + delta, 0), MAX_INDEX);
                resolve();
                return;
            }

            previous_top = element.scrollTop;

            setTimeout(scroll_frame, 0);
        }

        setTimeout(scroll_frame, 0);
    });
}

function getCurrentWindowHeight() {
    return window.innerHeight;
}

function scroll(deltaY) {
    var delta = Math.min(Math.max(deltaY, -1), 1) * getCurrentWindowHeight();
    smooth_scroll_to(SCROLL_TARGET, SCROLL_TARGET.scrollTop + delta, 1000);
}


SCROLL_TARGET.addEventListener('touchstart', function (e) {
    LAST_Y_POS = e.changedTouches[0].clientY;
});

SCROLL_TARGET.addEventListener('wheel', function (e) {
    e.preventDefault();
    scroll(e.deltaY);
    console.log(CURRENT_INDEX);
});

SCROLL_TARGET.addEventListener('touchmove', function (e) {
    e.preventDefault();
    scroll(LAST_Y_POS - e.changedTouches[0].clientY);
});

window.onresize = function(event) {
    target = SCROLL_TARGET.scrollTop;
    console.log(LAST_SCROLL_DIR);
    if (LAST_SCROLL_DIR == 'UP'){
        CURRENT_INDEX = Math.max(CURRENT_INDEX - 1, 0);
        target = getCurrentWindowHeight() * CURRENT_INDEX;
    } else {
        CURRENT_INDEX = Math.min(CURRENT_INDEX + 1, MAX_INDEX);
        target = getCurrentWindowHeight() * CURRENT_INDEX;
    }

    console.log(SCROLL_TARGET.scrollTop);
    console.log(target);
    smooth_scroll_to(SCROLL_TARGET, target, 0);
};
