class ImgGallery {
    constructor(container, bufferSize) {
        this.container = container;
        this.bufferSize = bufferSize;

        for (var i = 0; i < container.childNodes.length; i++) {
            if (container.childNodes[i].className && container.childNodes[i].className.includes("left-button")) {
                this.leftButton = container.childNodes[i];
                this.leftButton.addEventListener("click", e => this.traverse(e, true));
                this.leftButton.addEventListener("dblclick", e => e.stopPropagation());
                continue;
            }

            if (container.childNodes[i].className && container.childNodes[i].className.includes("right-button")) {
                this.rightButton = container.childNodes[i];
                this.rightButton.addEventListener("click", e => this.traverse(e, false));
                this.rightButton.addEventListener("dblclick", e => e.stopPropagation());
                continue;
            }

            if (container.childNodes[i].className && container.childNodes[i].className.includes("img-gallery-inner")) {
                this.images = container.childNodes[i].getElementsByTagName("img");

                for (let index = 0; index < this.images.length; index++) {
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

        if (!Date.now) {Date.now = function() {return new Date().getTime();}}

        this.container.addEventListener("dblclick", e => this.fullScreenToggle(e));
        this.container.addEventListener("mousemove", e => this.triggerControls(e)); 
        this.container.addEventListener("mouseenter", e => this.toggleMouseOver(true)); 
        this.container.addEventListener("mouseleave", e => this.toggleMouseOver(false)); 
        this.container.addEventListener("contextmenu", e => e.preventDefault()); 
        this.loadNeighbours(this.index);
    }

    traverse(e, left) {
        e.stopPropagation();
        e.preventDefault();

        if (this.busy) { return; }
        this.busy = true;

        var mod = left ? -1 : 1;
        this.images[this.index].classList.remove("show-element");
        this.index = this.incRotary(this.index, mod, 0, this.images.length - 1)
        this.images[this.index].classList.add("show-element");
        this.loadNeighbours(this.index);
        this.busy = false;
    }

    fullScreenToggle(e) {
        var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);
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

    triggerControls(e) {
        this.controlTimeout = Date.now() + this.controlTimeoutMax;
        var delayHide = async function (elements, obj) {
            setTimeout(() => {
                if (!obj.isMouseOver && Date.now() - obj.controlTimeout >= 0) {
                    for (let index = 0; index < elements.length; index++) {
                        elements[index].classList.remove("show-element");
                    }
                }
            }, obj.controlTimeoutMax);
        }    
        
        var controls = [this.rightButton, this.leftButton];
        for (let index = 0; index < controls.length; index++) {
            controls[index].classList.add("show-element");
        }

        delayHide(controls, this);
    }

    loadNeighbours(index) { 
        var asyncLoadNeighbours = async function (rotaryIncFunc, images, numImages, bufferSize) {
            for (let x = 0 - (bufferSize / 2); x <= (bufferSize / 2); x++) {
                if (x != 0) {
                    var neighbourIndex = rotaryIncFunc(index, x, 0, numImages - 1);
                    if (!images[neighbourIndex].loaded) {
                        images[neighbourIndex].src = images[neighbourIndex].dataset.source;
                        images[neighbourIndex].loaded = true;
                    }
                }              
            }
        }
        
        asyncLoadNeighbours(this.incRotary, this.images, this.images.length, this.bufferSize);
    }

    toggleDisplay (show) {
        if (show) {
            this.container.style.display = "block";
        } else {
            this.container.style.display = "none";
        }
    }

    toggleMouseOver (isOver) {
        this.isMouseOver = isOver;
    }

    // (floor 0 and max 5 means 0, 2, 3, 4, 5)
    incRotary(number, increment, floor, max) {
        var sum = number + increment;

        if (sum < floor) {
            return max - (Math.abs(sum + 1) % (max + 1));
        }

        if (sum > floor) {
            return 0 + (sum % (max + 1));
        }

        return sum;
    }
}

var PORTFOLIO_IMG_GALLERIES = [].slice.call(document.getElementsByClassName("img-gallery")).reduce(function (map, obj) { map[obj.id] = new ImgGallery(obj, 4); return new Map(Object.entries(map)); }, {});
var CURRENT_ACTIVE_GALLERY = null;

async function toggleGalleries(show, delay, id = null) {
    if (delay) {
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    if (PORTFOLIO_IMG_GALLERIES.has("ig-" + id)) {
        if (id) {
            PORTFOLIO_IMG_GALLERIES.get("ig-" + id).toggleDisplay(show);
        } else {
            PORTFOLIO_IMG_GALLERIES.forEach(element => {
                element.toggleDisplay(show);
            });
        }
    }

    CURRENT_ACTIVE_GALLERY = (show ? id : null);
}

function traverseActiveGallery (e, left) {
    if (CURRENT_ACTIVE_GALLERY && PORTFOLIO_IMG_GALLERIES.has("ig-" + CURRENT_ACTIVE_GALLERY)) {
        PORTFOLIO_IMG_GALLERIES.get("ig-" + CURRENT_ACTIVE_GALLERY).traverse(e, left); 
    } 
}