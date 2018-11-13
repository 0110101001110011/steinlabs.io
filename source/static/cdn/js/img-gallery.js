class ImgGallery {
    constructor(container) {
        this.container = container;
        this.container.addEventListener("dblclick", e => this.fullScreenToggle(e));
        this.index = 0;

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
                this.images[0].style.backgroundImage = "url('" + this.images[0].dataset.source + "')";
                this.images[0].loaded = true;
                continue;
            }

        }

        this.loadImages();
        this.busy = false;
    }

    traverse(e, left) {
        e.stopPropagation();
        e.preventDefault();

        if (this.busy) { return; }
        this.busy = true;

        var mod = left ? -1 : 1;
        this.index = this.incRotary(this.index, mod, 0, this.images.length - 1)

        for (let index = 0; index < this.images.length; index++) {
            if (index == this.index) {
                this.images[index].classList.add("show-img");
            } else {
                this.images[index].classList.remove("show-img");
            }
        }

        this.busy = false;
    }

    fullScreenToggle(e) {
        if (this.container.requestFullscreen) {
            this.container.requestFullscreen();
        } else if (this.container.mozRequestFullScreen) {
            this.container.mozRequestFullScreen();
        } else if (this.container.webkitRequestFullscreen) {
            this.container.webkitRequestFullscreen();
        } else if (this.container.msRequestFullscreen) { 
            this.container.msRequestFullscreen();
        }
    }

    loadImages() {
        var asyncLoad = async function (element) {
            element.style.backgroundImage = "url('" + element.dataset.source + "')";
        }

        for (let index = 0; index < this.images.length; index++) {
            asyncLoad(this.images[index]);
        }
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

var PORTFOLIO_IMG_GALLERIES = [].slice.call(document.getElementsByClassName("img-gallery")).reduce(function (map, obj) { map[obj.id] = new ImgGallery(obj); return map; }, {});
