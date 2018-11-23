"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var toggleGalleries = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(show, delay) {
        var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        if (!delay) {
                            _context3.next = 3;
                            break;
                        }

                        _context3.next = 3;
                        return new Promise(function (resolve) {
                            return setTimeout(resolve, delay);
                        });

                    case 3:

                        if (PORTFOLIO_IMG_GALLERIES.has("ig-" + id)) {
                            if (id) {
                                PORTFOLIO_IMG_GALLERIES.get("ig-" + id).toggleDisplay(show);
                            } else {
                                PORTFOLIO_IMG_GALLERIES.forEach(function (element) {
                                    element.toggleDisplay(show);
                                });
                            }
                        }

                        CURRENT_ACTIVE_GALLERY = show ? id : null;

                    case 5:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function toggleGalleries(_x7, _x8) {
        return _ref3.apply(this, arguments);
    };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImgGallery = function () {
    function ImgGallery(container, bufferSize) {
        var _this = this;

        _classCallCheck(this, ImgGallery);

        this.container = container;
        this.bufferSize = bufferSize;

        for (var i = 0; i < container.childNodes.length; i++) {
            if (container.childNodes[i].className && container.childNodes[i].className.includes("left-button")) {
                this.leftButton = container.childNodes[i];
                this.leftButton.addEventListener("click", function (e) {
                    return _this.traverse(e, true);
                });
                this.leftButton.addEventListener("dblclick", function (e) {
                    return e.stopPropagation();
                });
                continue;
            }

            if (container.childNodes[i].className && container.childNodes[i].className.includes("right-button")) {
                this.rightButton = container.childNodes[i];
                this.rightButton.addEventListener("click", function (e) {
                    return _this.traverse(e, false);
                });
                this.rightButton.addEventListener("dblclick", function (e) {
                    return e.stopPropagation();
                });
                continue;
            }

            if (container.childNodes[i].className && container.childNodes[i].className.includes("img-gallery-inner")) {
                this.images = container.childNodes[i].getElementsByTagName("img");

                for (var index = 0; index < this.images.length; index++) {
                    this.images[index].loaded = false;
                }

                this.images[0].src = this.images[0].dataset.source;
                this.images[0].loaded = true;
                continue;
            }
        }

        this.busy = false;
        this.index = 0;
        this.controlTimeout = 0;
        this.controlTimeoutMax = 100;
        this.isMouseOver = false;

        if (!Date.now) {
            Date.now = function () {
                return new Date().getTime();
            };
        }

        this.container.addEventListener("dblclick", function (e) {
            return _this.fullScreenToggle(e);
        });
        this.container.addEventListener("mousemove", function (e) {
            return _this.triggerControls(e);
        });
        this.container.addEventListener("mouseenter", function (e) {
            return _this.toggleMouseOver(true);
        });
        this.container.addEventListener("mouseleave", function (e) {
            return _this.toggleMouseOver(false);
        });
        this.container.addEventListener("contextmenu", function (e) {
            return e.preventDefault();
        });
        this.loadNeighbours(this.index);
    }

    _createClass(ImgGallery, [{
        key: "traverse",
        value: function traverse(e, left) {
            e.stopPropagation();
            e.preventDefault();

            if (this.busy) {
                return;
            }
            this.busy = true;

            var mod = left ? -1 : 1;
            this.images[this.index].classList.remove("show-element");
            this.index = this.incRotary(this.index, mod, 0, this.images.length - 1);
            this.images[this.index].classList.add("show-element");
            this.loadNeighbours(this.index);
            this.busy = false;
        }
    }, {
        key: "fullScreenToggle",
        value: function fullScreenToggle(e) {
            var isInFullScreen = document.fullscreenElement && document.fullscreenElement !== null || document.webkitFullscreenElement && document.webkitFullscreenElement !== null || document.mozFullScreenElement && document.mozFullScreenElement !== null || document.msFullscreenElement && document.msFullscreenElement !== null;
            if (!isInFullScreen) {
                if (this.container.requestFullscreen) {
                    this.container.requestFullscreen();
                } else if (this.container.mozRequestFullScreen) {
                    this.container.mozRequestFullScreen();
                } else if (this.container.webkitRequestFullScreen) {
                    this.container.webkitRequestFullScreen();
                } else if (this.container.msRequestFullscreen) {
                    this.container.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        }
    }, {
        key: "triggerControls",
        value: function triggerControls(e) {
            this.controlTimeout = Date.now() + this.controlTimeoutMax;
            var delayHide = function () {
                var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(elements, obj) {
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    setTimeout(function () {
                                        if (!obj.isMouseOver && Date.now() - obj.controlTimeout >= 0) {
                                            for (var index = 0; index < elements.length; index++) {
                                                elements[index].classList.remove("show-element");
                                            }
                                        }
                                    }, obj.controlTimeoutMax);

                                case 1:
                                case "end":
                                    return _context.stop();
                            }
                        }
                    }, _callee, this);
                }));

                return function delayHide(_x, _x2) {
                    return _ref.apply(this, arguments);
                };
            }();

            var controls = [this.rightButton, this.leftButton];
            for (var index = 0; index < controls.length; index++) {
                controls[index].classList.add("show-element");
            }

            delayHide(controls, this);
        }
    }, {
        key: "loadNeighbours",
        value: function loadNeighbours(index) {
            var asyncLoadNeighbours = function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(rotaryIncFunc, images, numImages, bufferSize) {
                    var x, neighbourIndex;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    for (x = 0 - bufferSize / 2; x <= bufferSize / 2; x++) {
                                        if (x != 0) {
                                            neighbourIndex = rotaryIncFunc(index, x, 0, numImages - 1);

                                            if (!images[neighbourIndex].loaded) {
                                                images[neighbourIndex].src = images[neighbourIndex].dataset.source;
                                                images[neighbourIndex].loaded = true;
                                            }
                                        }
                                    }

                                case 1:
                                case "end":
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, this);
                }));

                return function asyncLoadNeighbours(_x3, _x4, _x5, _x6) {
                    return _ref2.apply(this, arguments);
                };
            }();

            asyncLoadNeighbours(this.incRotary, this.images, this.images.length, this.bufferSize);
        }
    }, {
        key: "toggleDisplay",
        value: function toggleDisplay(show) {
            if (show) {
                this.container.style.display = "block";
            } else {
                this.container.style.display = "none";
            }
        }
    }, {
        key: "toggleMouseOver",
        value: function toggleMouseOver(isOver) {
            this.isMouseOver = isOver;

            if (!isOver) {
                this.controlTimeout = 0;
            }
        }

        // (floor 0 and max 5 means 0, 2, 3, 4, 5)

    }, {
        key: "incRotary",
        value: function incRotary(number, increment, floor, max) {
            var sum = number + increment;

            if (sum < floor) {
                return max - Math.abs(sum + 1) % (max + 1);
            }

            if (sum > floor) {
                return 0 + sum % (max + 1);
            }

            return sum;
        }
    }]);

    return ImgGallery;
}();

var PORTFOLIO_IMG_GALLERIES = [].slice.call(document.getElementsByClassName("img-gallery")).reduce(function (map, obj) {
    map[obj.id] = new ImgGallery(obj, 4);return new Map(Object.entries(map));
}, {});
var CURRENT_ACTIVE_GALLERY = null;

function traverseActiveGallery(e, left) {
    if (CURRENT_ACTIVE_GALLERY && PORTFOLIO_IMG_GALLERIES.has("ig-" + CURRENT_ACTIVE_GALLERY)) {
        PORTFOLIO_IMG_GALLERIES.get("ig-" + CURRENT_ACTIVE_GALLERY).traverse(e, left);
    }
}