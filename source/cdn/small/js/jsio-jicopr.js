(function (document) {
    // Enums
    const EImageState = Object.freeze({ loading: 0, ready: 1, error: -1 });
    const EEngineState = Object.freeze({ loading: 0, ready: 1, mrStarkIDontFeelSoGood: -1 });
    const EObjectState = Object.freeze({ active: 0, inactive: 1, pendingDeletion: -1 });
    const EGameObjectType = Object.freeze({ player: PlayerCharacter, enemy: Enemy, environment: Environment });

    // Consts
    const VERSION = "0.1.0";
    const SHOW_TEST_IMAGE = false;
    const PIXEL_SIZE = 4;

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
        V2_CANVAS_SIZE: new V2("1920px", "5000px"),
        V2_CANVAS_RESOLUTION: new V2(1920 / PIXEL_SIZE, 5000 / PIXEL_SIZE),
        S_INIT_OK_MESSAGE: "jicopr [V" + VERSION + "] started",
        S_INIT_FAIL_MESSAGE: "jicopr failed to start\nState: ",
        S_NOCANVAS_MESSAGE: "Canvas [" + EID.CANVAS + "] not found",
    });

    const SPRITE_DATA = Object.freeze({
        PLAYER: { type: EGameObjectType.player, sprite: new Sprite("./cdn/small/jicopr/test.png", new V2(32, 32), 0, 0), pos: new V2() },
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
            let self = this;
            this.img.addEventListener(EVENT.ONLOAD, function () { self.onImageLoad(imgLoadCallback, true); });
            this.img.addEventListener(EVENT.ONERROR, function () { self.onImageLoad(imgLoadCallback, false); });
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
     * GameObject - A wrapper for an Object, representing an object that exists within the game world.
     * This is a base class and should be wrapped in a class that implements any required game logic
     * @param {Sprite} sprite - sprite to render for this object
     * @param {V2} [position={0, 0}] - initial position for this GameObject
     */
    function GameObject(sprite, position) {
        this.sprite = sprite;
        this.position = position ? position : new V2();
        this.state = EObjectState.active;

        this.init = function (onLoadCallback) {
            this.setPosition(engine.canvas.x / 2, engine.canvas.y / 2);
            this.sprite.init(onLoadCallback);
        }

        this.draw = function (ctx) {
            this.floorPos();
            this.sprite.draw(ctx, this.position);
        }

        // Utility
        this.setPosition = function(x, y) {
            this.position.x = x;
            this.position.y = y;
        }

        this.floorPos = function () {
            this.position.x = (this.position.x << 0);
            this.position.y = (this.position.y << 0);
        }
    }

    function PlayerCharacter(gameObject) {
        this.gameObject = gameObject;

        this.init = function (onLoadCallback) {
            this.gameObject.init(onLoadCallback);
        }

        this.update = function () {
            // console.log("Updating player");
        }

        this.draw = function (ctx) {
            this.gameObject.draw(ctx);
        }
    }

    function Enemy(gameObject) {
        this.gameObject = gameObject;

        this.init = function (onLoadCallback) {
            this.gameObject.init(onLoadCallback);
        }

        this.update = function () {
            
        }

        this.draw = function (ctx) {
            this.gameObject.draw(ctx);
        }
    }


    function Environment(gameObject) {
        this.gameObject = gameObject;

        this.init = function (onLoadCallback) {
            this.gameObject.init(onLoadCallback);
        }

        this.update = function () {
            
        }

        this.draw = function (ctx) {
            this.gameObject.draw(ctx);
        }
    }


    function Canvas(canvasId) {
        this.canvas = document.getElementById(canvasId);

        this.ready = true;
        if (!this.canvas) {
            console.log(V.S_NOCANVAS_MESSAGE);
            this.ready = false;
            return;
        }

        this.ctx = this.canvas.getContext(V.S_2D);
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;

        this.canvas.width = V.V2_CANVAS_RESOLUTION.x;
        this.canvas.height = V.V2_CANVAS_RESOLUTION.y;

        this.canvas.style.width = V.V2_CANVAS_SIZE.x;
        this.canvas.style.width = V.V2_CANVAS_SIZE.y;
        // this.ctx.scale(PIXEL_SIZE, PIXEL_SIZE);

        this.redrawRegions = [];

        this.x = this.canvas.width;
        this.y = this.canvas.height;

        this.offset = 0;

        this.testShapeCircle = function () {
            this.ctx.beginPath();
            this.ctx.strokeStyle = "#FFaacc";
            this.ctx.lineWidth = 10;
            let x = this.x / 2 + (Math.sin(this.offset / 40) * 100);
            let y = document.documentElement.clientHeight / 2 / PIXEL_SIZE;
            let r = 40;
            let sa = 0;
            let ea = 2 * Math.PI;
            this.ctx.arc(x, y, r, sa, ea);

            r += 1;
            let clearStartX = x - (r + this.ctx.lineWidth / 2);
            let clearStartY = y - (r + this.ctx.lineWidth / 2);
            this.addClearRectRegion(new V2(clearStartX, clearStartY), new V2(((r + this.ctx.lineWidth / 2) * 2), ((r + this.ctx.lineWidth / 2) * 2)));

            this.offset++;
        }

        this.addClearRectRegion = function(xy, widthHeight) {
            this.redrawRegions.push({xy: xy, wh: widthHeight});
        }

        this.clear = function () {
            while (this.redrawRegions.length > 0) {
                let region = this.redrawRegions.pop();
                this.ctx.clearRect(region.xy.x, region.xy.y, region.wh.x, region.wh.y);  
            }
        }

        this.draw = function () {         
            this.clear();

            for (let index = 0; index < engine.gameObjects.length; index++) {
                engine.gameObjects[index].draw(this.ctx);
            }

            if (SHOW_TEST_IMAGE) this.testShapeCircle();

            this.ctx.stroke();
        }
    }

    function Engine(canvas) {
        this.gameObjects = [];
        this.canvas = canvas;
        this.state = EEngineState.loading;
        this.startTime = Date.now();
        this.frame = 0;

        // Core
        this.start = function () {
            this.state = this.canvas.ready ? EEngineState.ready : EEngineState.mrStarkIDontFeelSoGood;

            if (this.state == EEngineState.ready) {
                console.log(V.S_INIT_OK_MESSAGE);
            } else {
                console.log(V.S_INIT_FAIL_MESSAGE + this.state);
            }         

            this.update();
        }

        this.update = function () {
            if (engine.state != EEngineState.ready) {
                return;
            }

            for (let index = 0; index < engine.gameObjects.length; index++) {
                engine.gameObjects[index].update();
            }

            engine.canvas.draw();
            engine.frame++;

            requestAnimationFrame(engine.update);
        }

        // Utility
        this.init = function (loadingCallback) {
            let dataKeys = Object.keys(SPRITE_DATA);
            for (let index = 0; index < dataKeys.length; index++) {
                let sdata = SPRITE_DATA[dataKeys[index]];
                let g = new sdata.type(new GameObject(sdata.sprite, sdata.pos));
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

            let itemsToLoad = (engine.state == EEngineState.good) ? Object.keys(SPRITE_DATA).length : 0;

            return itemsToLoad;
        },
        initEngine: function (loadingCallback) {
            engine.init(loadingCallback);
        },
        startEngine: function () {
            engine.start();
        }
    }

})(document)