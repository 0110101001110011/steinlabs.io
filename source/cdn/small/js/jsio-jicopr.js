(function (document) {
    // Enums
    const EImageState = Object.freeze({ loading: 0, ready: 1, error: -1 });
    const EObjectState = Object.freeze({ active: 0, inactive: 1, pendingDeletion: -1 });

    // Consts
    const VERSION = "0.1.0";

    const EVENT = Object.freeze({
        RESIZE: "resize",
        DOM_CONTENT_LOADED: "DOMContentLoaded",
        ONLOAD: "load",
        ONERROR: "error",
    });

    const EID = Object.freeze({
        CANVAS: "jico-canvas"
    });

    const V = Object.freeze({
        S_2D: "2d",
        V2_CANVAS_DIM: new V2(1920, 5000),
        S_INITMESSAGE: "jicopr [V" + VERSION + "] started",
    });

    const SPRITE_DATA = Object.freeze({
        PLAYER: { sprite: new Sprite("./cdn/small/jicopr/adol-raw.png", new V2(32, 64), 0, 0), position: new V2(500, 500), updateFunctionCallback: null },
    });

    // Engine
    let engine = null;

    // Old style class declarations

    /**
     * V2 - A wrapper for a 2 property object - Usually used for 2D coordinates
     * @param {Number} [x=0]
     * @param {Number} [y=0]
     */
    function V2(x, y) {
        this.x = x ? x : 0;
        this.y = y ? y : 0;
    }

    /**
     * Sprite - A wrapper for an Image object
     * @param {String} imgPath - path for the spritesheet that this sprite will use
     * @param {V2} size - this sprite's display width and height
     * @param {Number} [yOffset=0] - the starting row's index for this sprite (0 indexed, 0 is the top row)
     * @param {Number} [defaultFrame=0] - The starting frame
     */
    function Sprite(imgPath, size, yOffset, defaultFrame) {
        this.state = EImageState.loading;

        this.size = size;
        this.img = new Image(this.size.x, this.size.y);

        this.src = imgPath;

        this.currentFrame = defaultFrame ? defaultFrame : 0;
        this.yOffset = yOffset ? yOffset * this.size.y : 0;
        this.xOffsets = [];

        this.animate = false;

        this.init = function (imgLoadCallback) {
            this.img.addEventListener(EVENT.ONLOAD, this.onImageLoad(imgLoadCallback, true));
            this.img.addEventListener(EVENT.ONERROR, this.onImageLoad(imgLoadCallback, false));
            this.img.src = this.src;
        }

        this.draw = function (ctx, pos) {
            ctx.drawImage(
                this.img,
                this.xOffsets[this.currentFrame], this.yOffset,
                this.size.x, this.size.y,
                pos.x, pos.y,
                this.size.x, this.size.y);
        }

        // Internal
        this.onImageLoad = function (imgLoadCallback, success) {
            if (!success) {
                this.state = EImageState.error;
                imgLoadCallback(null);
                return;
            }

            let columns = Math.ceil((this.img.naturalWidth / this.size.x));
            for (let index = 0; index < columns; index++) {
                this.xOffsets.push(index * this.size.x);
            }

            this.state = EImageState.ready;
            imgLoadCallback(null);
        }
    }

    /**
     * GameObject - A wrapper for an Object, representing an object that exists within the game world
     * @param {Sprite} sprite - sprite to render for this object
     * @param {V2} position - initial position for this GameObject
     * @callback updateFunctionCallback - update logic for this GameObject
     */
    function GameObject(sprite, position, updateFunctionCallback) {
        this.sprite = sprite;
        this.position = position ? position : new V2();
        this.state = EObjectState.active;
        this.updateFunctionCallback = updateFunctionCallback;

        this.init = function (onLoadCallback) {
            this.sprite.init(onLoadCallback);
        }

        this.update = function() {
            if (!updateFunctionCallback) {
                return;
            }
        }

        this.draw = function (ctx) {
            this.floorPos();
            this.sprite.draw(ctx, this.position);
        }


        // Utility
        this.floorPos = function () {
            this.position.x = (this.position.x << 0);
            this.position.y = (this.position.y << 0);
        }
    }

    function Canvas(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext(V.S_2D);
        this.canvas.width = V.V2_CANVAS_DIM.x;
        this.canvas.height = V.V2_CANVAS_DIM.y;

        this.testShapeCircle = function () {
            this.ctx.beginPath();
            this.ctx.strokeStyle = "#FFaacc";
            this.ctx.lineWidth = 10;
            this.ctx.arc(this.canvas.width / 2, document.documentElement.clientHeight / 2, 40, 0, 2 * Math.PI);
            this.ctx.stroke();
        }

        this.draw = function () {
            for (let index = 0; index < engine.gameObjects.length; index++) {
                engine.gameObjects[index].draw(this.ctx);
            }

            this.testShapeCircle();
        }
    }

    function Engine(canvas) {
        this.gameObjects = [];
        this.canvas = canvas;

        // Core
        this.start = function () {
            console.log(V.S_INITMESSAGE);

            this.update();
        }

        this.update = function () {
            for (let index = 0; index < this.gameObjects.length; index++) {
                this.gameObjects[index].update();
            }

            this.canvas.draw();
            // requestAnimationFrame();
        }

        // Utility
        this.init = function (loadingCallback) {
            let dataKeys = Object.keys(SPRITE_DATA);
            for (let index = 0; index < dataKeys.length; index++) {
                let sdata = SPRITE_DATA[dataKeys[index]];
                let g = new GameObject(sdata.sprite, sdata.position, sdata.updateFunctionCallback);
                g.init(loadingCallback);
                this.gameObjects.push(g);
            }
        }

        this.addGameObject = function (gameObject) {
            this.GameObjects.push(gameObject);
        }
    }

    // Functions
    function init() {
        engine = new Engine(new Canvas(EID.CANVAS));
    }

    document.jicopr = {
        initLib: function () {
            init();
            return Object.keys(SPRITE_DATA).length;
        },
        initEngine: function (loadingCallback) {
            engine.init(loadingCallback);
        },
        startEngine: function () {
            engine.start();
        }
    }

})(document)