"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Classes TODO babel for IE
var Typewriter = function () {
    function Typewriter() {
        _classCallCheck(this, Typewriter);

        this.currentElement = null;
        this.typing = false;
        this.index = 0;
        this.loopSleep = 0;
        this.innerHTML = null;
        this.currentID = 0;
        this.forceFinish = false;
    }

    _createClass(Typewriter, [{
        key: "recursiveType",
        value: function recursiveType(id, tag) {
            var _this = this;

            if (this.currentID != id || !this.typing || this.index > this.endIndex) {
                this.typing = false;
                return;
            }

            if (this.forceFinish) {
                this.currentElement.innerHTML = this.innerHTML;
                this.forceFinish = false;
                this.typing = false;
                return;
            }

            setTimeout(function () {
                if (_this.innerHTML.charAt(_this.index) == "<") {
                    var htmltag = "";
                    while (_this.innerHTML.charAt(_this.index) != ">") {
                        htmltag += _this.innerHTML.charAt(_this.index);
                        _this.index++;
                    }
                    _this.currentElement.innerHTML += htmltag + ">";
                    _this.index++;
                    tag = "</" + htmltag.charAt(1) + ">";
                } else {
                    if (tag) {
                        _this.currentElement.innerHTML = _this.currentElement.innerHTML.replace(tag, "") + _this.innerHTML.charAt(_this.index);
                    } else {
                        _this.currentElement.innerHTML += _this.innerHTML.charAt(_this.index);
                    }
                    _this.index++;
                }

                _this.recursiveType(id, tag);
            }, this.loopSleep);
        }
    }, {
        key: "resetPreviousElement",
        value: function resetPreviousElement() {
            if (!this.currentElement) return;
            this.currentElement.innerHTML = this.innerHTML;
        }
    }, {
        key: "type",
        value: function type(element, charsPerSecond) {
            this.stop();
            this.currentID++;
            var id = this.currentID;
            this.typing = true;
            this.currentElement = element;
            this.index = 0;
            this.loopSleep = Math.floor(1000 / charsPerSecond);
            this.innerHTML = element.innerHTML.trim();
            this.endIndex = this.innerHTML.length;
            this.currentElement.textContent = "";

            this.recursiveType(id, null);
        }
    }, {
        key: "stop",
        value: function stop() {
            this.typing = false;
            this.resetPreviousElement();
        }
    }, {
        key: "isTyping",
        value: function isTyping() {
            return this.typing;
        }
    }, {
        key: "finish",
        value: function finish() {
            this.forceFinish = true;
        }
    }]);

    return Typewriter;
}();

// Globals (sorry!)

var SCROLL_TARGET = document.getElementById("scroll-target");
var PAGES = [].slice.call(document.getElementsByClassName("section-base")).sort(function (a, b) {return a.id > b.id;});
var MAX_INDEX = Math.max(PAGES.length - 1, 0);
var CURRENT_INDEX = 0;
var CONTENT_INDICATOR = document.getElementById("content-indicator");
var VN_TEXT_BLOCKS = [].slice.call(document.getElementsByClassName("vn-text")).sort(function (a, b) {return a.id > b.id;});
var CURRENT_VN_TEXT_INDEX = 0;
var MAX_VN_TEXT_INDEX = Math.max(VN_TEXT_BLOCKS.length - 1, 0);
var VN_ARROW_LEFT = document.getElementById("vn-arrow-left");
var VN_ARROW_RIGHT = document.getElementById("vn-arrow-right");
var PORTFOLIO_THUMBNAILS = document.getElementsByClassName("portfolio-thumbnail");
var PORTFOLIO_PAGES = [].slice.call(document.getElementsByClassName("portfolio-page-wrapper")).reduce(function (map, obj) {map[obj.id] = obj;return map;}, {});
var PORTFOLIO_X_BUTTONS = document.getElementsByClassName("portfolio-x-button");
var PORTFOLIO_OPEN = false;
var TIME_PER_PAGE = 400;
var ZS = zenscroll.createScroller(SCROLL_TARGET, TIME_PER_PAGE, 0);
var TYPEWRITER = new Typewriter();
var SPLASH_VIDEO = document.getElementById("splash-video");
var LAST_SCROLL_DELTA = 0;
var LAST_HASH = window.location.hash;

// Helpers
function clamp(a, min, max) {
    return Math.min(Math.max(a, min), max);
}

function getScrollbarWidth() {
    return window.innerWidth - SCROLL_TARGET.clientWidth;
}

function vnStep(event, delta) {
    if (event) event.preventDefault();
    var previousIndex = CURRENT_VN_TEXT_INDEX;
    var nextIndex = clamp(CURRENT_VN_TEXT_INDEX + delta, 0, MAX_VN_TEXT_INDEX);
    if (previousIndex != nextIndex) {
        if (TYPEWRITER.isTyping()) {
            TYPEWRITER.finish();
        } else {
            CURRENT_VN_TEXT_INDEX = nextIndex;
            VN_TEXT_BLOCKS[previousIndex].classList.toggle("hidden");
            TYPEWRITER.type(VN_TEXT_BLOCKS[CURRENT_VN_TEXT_INDEX], 16);
            VN_TEXT_BLOCKS[CURRENT_VN_TEXT_INDEX].classList.toggle("hidden");
        }
    }

    if (CURRENT_VN_TEXT_INDEX == 0) {
        VN_ARROW_LEFT.classList.add("non-active");
        VN_ARROW_RIGHT.classList.remove("non-active");
    } else if (CURRENT_VN_TEXT_INDEX == MAX_VN_TEXT_INDEX) {
        VN_ARROW_LEFT.classList.remove("non-active");
        VN_ARROW_RIGHT.classList.add("non-active");
    } else {
        VN_ARROW_LEFT.classList.remove("non-active");
        VN_ARROW_RIGHT.classList.remove("non-active");
    }
}

function scrollToSection(sectionIndex) {
    difference = sectionIndex - CURRENT_INDEX;
    LAST_SCROLL_DELTA = clamp(difference, -1, 1);

    scroll(difference, difference);
}

function scroll(deltaY, hops) {
    if (ZS.moving()) {
        return;
    }

    var isInFullScreen = document.fullscreenElement && document.fullscreenElement !== null || document.webkitFullscreenElement && document.webkitFullscreenElement !== null || document.mozFullScreenElement && document.mozFullScreenElement !== null || document.msFullscreenElement && document.msFullscreenElement !== null;

    if (isInFullScreen) {
        return;
    }

    LAST_SCROLL_DELTA = clamp(deltaY, -1, 1);
    CURRENT_INDEX = clamp(CURRENT_INDEX + LAST_SCROLL_DELTA * hops, 0, MAX_INDEX);
    var time = TIME_PER_PAGE * Math.ceil(Math.abs(hops) / 2);
    if (CURRENT_INDEX == 0) SPLASH_VIDEO.play();
    ZS.to(PAGES[CURRENT_INDEX], time, function () {
        if (CURRENT_INDEX != 0) {
            SPLASH_VIDEO.pause();
        }
        history.pushState(null, null, document.location.pathname + "#s" + CURRENT_INDEX);
        LAST_HASH = window.location.hash;
    });
}

function scrollWrap(deltaY, hops) {
    scroll(deltaY, hops);
}

function togglePortfolioPage(pageID, activate) {
    if (activate) {
        PORTFOLIO_PAGES[pageID].classList.add("portfolio-page-visible");
        PORTFOLIO_PAGES[pageID].style.pointerEvents = "";
        PORTFOLIO_OPEN = pageID;
        toggleGalleries(true, 0, pageID);
    } else {
        PORTFOLIO_PAGES[pageID].classList.remove("portfolio-page-visible");
        PORTFOLIO_PAGES[pageID].style.pointerEvents = "none";
        [].slice.call(VIDEO_PLAYERS).forEach(function (element) {
            element.pause();
        });
        PORTFOLIO_OPEN = null;
        toggleGalleries(false, 500);
    }
}

function updateIndexByHash() {
    if (window.location.hash && window.location.hash.match("^#s[0-9]$")) {
        CURRENT_INDEX = parseInt(window.location.hash.replace("#s", ""));
    } else {
        CURRENT_INDEX = 0;
    }

    if (CURRENT_INDEX == 0) SPLASH_VIDEO.play();
    ZS.to(PAGES[CURRENT_INDEX], 0);
    if (CURRENT_INDEX != 0) {
        SPLASH_VIDEO.pause();
    } else {
        SPLASH_VIDEO.play();
    }
}

function init() {
    updateIndexByHash();

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
        var kc = e.keyCode;

        if ([34, 35, 40].includes(kc) || kc == 32 && !e.shiftKey) {
            if (kc == 35) {
                scroll(1, MAX_INDEX);
            } else {
                scroll(1, 1);
            }
            e.preventDefault();
        } else if ([33, 36, 38].includes(kc) || kc == 32 && e.shiftKey) {
            if (kc == 36) {
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

        if (CURRENT_INDEX == 2) {
            if ([8, 37].includes(kc)) {
                traverseActiveGallery(e, true);
            } else if ([13, 39].includes(kc)) {
                traverseActiveGallery(e, false);
            }

            if (kc == 27 && PORTFOLIO_OPEN) {
                togglePortfolioPage(PORTFOLIO_OPEN, false);
            }
        }
    });

    SCROLL_TARGET.addEventListener('mousedown', function (e) {
        if (e.button == 2) {
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
    });

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

    var _loop = function _loop(index) {
        PORTFOLIO_THUMBNAILS[index].addEventListener("click", function (e) {
            togglePortfolioPage(PORTFOLIO_THUMBNAILS[index].id.replace("tn-", ""), true);
        });
    };

    for (var index = 0; index < PORTFOLIO_THUMBNAILS.length; index++) {
        _loop(index);
    }

    var _loop2 = function _loop2(index) {
        PORTFOLIO_X_BUTTONS[index].addEventListener("click", function (e) {
            togglePortfolioPage(PORTFOLIO_THUMBNAILS[index].id.replace("tn-", ""), false);
        });
    };

    for (var index = 0; index < PORTFOLIO_X_BUTTONS.length; index++) {
        _loop2(index);
    }

    window.addEventListener("hashchange", function (e) {
        if (PORTFOLIO_OPEN && CURRENT_INDEX == 2) {
            togglePortfolioPage(PORTFOLIO_OPEN, false);
            history.pushState(null, null, document.location.pathname + LAST_HASH);
            e.stopPropagation();
            e.preventDefault();
        } else {
            updateIndexByHash();
        }
    });
}

init();