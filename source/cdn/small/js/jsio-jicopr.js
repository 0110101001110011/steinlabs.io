(function (document) {
    // Enums
    const EImageState = Object.freeze({ loading: 0, ready: 1, error: -1 });
    const EEngineState = Object.freeze({ loading: 0, ready: 1, mrStarkIDontFeelSoGood: -1 });
    const EObjectState = Object.freeze({ active: 0, inactive: 1, pendingDeletion: -1 });
    const EGameObjectType = Object.freeze({ player: PlayerCharacter, enemy: Enemy, environment: Environment });

    // Consts
    const VERSION = "0.1.0";
    const SHOW_TEST_IMAGE = false;
    const PIXEL_SIZE = 2;
    const AFPS = 10;
    const TPAF = 60 / AFPS;

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
        V2_CANVAS_RESOLUTION: new V2(1920, 5000),
        S_INIT_OK_MESSAGE: "jicopr [V" + VERSION + "] started",
        S_INIT_FAIL_MESSAGE: "jicopr failed to start\nState: ",
        S_NOCANVAS_MESSAGE: "Canvas [" + EID.CANVAS + "] not found",
    });

    const SPRITE_DATA = Object.freeze({
        PLAYER: { 
            type: EGameObjectType.player,
            sprite: new Sprite("./cdn/small/jicopr/adol.png", new V2(32, 52), {
                idle: new SpritesheetParams(0, 1, false),
                run: new SpritesheetParams(1, 4, true),
                attack: new SpritesheetParams(2, 9, true),
            }), 
            pos: new V2() 
        },
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
     * 
     * @param {V2} size 
     * @param {Number} [yOffset=0] - the starting row's index for this sprite (0 indexed, 0 is the top row)
     * @param {Number} frameCount - The number of frames for this animation
     * @param {Boolean} animated - Whether or not this sprite sheet is animated
     */ 
    function SpritesheetParams(yOffset, frameCount, animated) {
        this.yOffset = yOffset;
        this.frameCount = frameCount;
        this.animated = animated;
    }

    /**
     * Sprite - A wrapper for an Image object
     * @param {String} imgPath - path for the spritesheet that this sprite will use
     * @param {SpritesheetParams} spriteData - This should be an object with properties representing each SpriteSheetParams object
     */
    function Sprite(imgPath, imgSize, spriteData) {
        this.state = EImageState.loading;
        this.img = new Image(imgSize.x, imgSize.y);
        this.size = imgSize;
        this.src = imgPath;
        this.currentFrame = 0;
        this.animations = spriteData;
        this.currentAnimation = Object.keys(spriteData)[0];

        this.init = function (imgLoadCallback) {
            let self = this;
            this.img.addEventListener(EVENT.ONLOAD, function () { self.onImageLoad(imgLoadCallback, true); });
            this.img.addEventListener(EVENT.ONERROR, function () { self.onImageLoad(imgLoadCallback, false); });
            this.img.src = this.src;
        }

        this.draw = function (ctx, pos) {
            let ca = this.animations[this.currentAnimation];

            let sx = this.size.x * this.currentFrame;
            let sy = ca.yOffset * this.size.y;

            ctx.drawImage(
                this.img,
                sx, sy,
                this.size.x, this.size.y,
                this.floor(pos.x - (this.size.x / 2)), this.floor(pos.y - (this.size.y / 2)),
                this.size.x, this.size.y);
        }

        this.animate = function () {
            let ca = this.animations[this.currentAnimation];
            if (ca.animated) {
                if (engine.frame % TPAF == 0) {
                    this.currentFrame++;
                    if (this.currentFrame == ca.frameCount) {
                        this.currentFrame = 0;
                    }
                }
            }
        }

        this.setAnimation = function (name, startFrame) {
            if (name != this.currentAnimation) {
                this.currentAnimation = name;
                this.currentFrame = startFrame ? startFrame : 0;
            }
        }

        // Internal
        this.onImageLoad = function (imgLoadCallback, success) {
            if (!success) {
                this.state = EImageState.error;
                imgLoadCallback(null);
                return;
            }

            this.state = EImageState.ready;
            imgLoadCallback(null);
        }
     
        this.floor = function (val) {
            return (val << 0);
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
            this.sprite.init(onLoadCallback);
        }

        this.draw = function (ctx) {
            this.sprite.draw(ctx, this.position);
        }

        this.setAnimation = function (name, startFrame) {
            this.sprite.setAnimation(name, startFrame);
        }

        // Utility
        this.setPosition = function(x, y) {
            this.position.x = x;
            this.position.y = y;
        }

        this.getPosition = function () {
            return this.position;
        }

        this.getSize = function () {
            return this.sprite.size;
        }

        this.getClearRect = function () {
            return { xy: new V2(this.position.x - (this.sprite.size.x / 2), this.position.y - (this.sprite.size.y / 2)), wh: this.sprite.size }
        }
    }

    function PlayerCharacter(gameObject) {
        this.gameObject = gameObject;
        this.sprite = this.gameObject.sprite;

        this.init = function (onLoadCallback) {
            this.gameObject.setPosition(engine.canvas.x / 2, document.documentElement.clientHeight / PIXEL_SIZE / 2);
            this.gameObject.init(onLoadCallback);
            this.gameObject.setAnimation("attack");
        }

        this.update = function () {
            this.sprite.animate();
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

        this.canvas.width = V.V2_CANVAS_RESOLUTION.x;
        this.canvas.height = V.V2_CANVAS_RESOLUTION.y;

        this.x = this.canvas.width / PIXEL_SIZE;
        this.y = this.canvas.height / PIXEL_SIZE;

        this.ctx.scale(PIXEL_SIZE, PIXEL_SIZE);
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;

        this.redrawRegions = [];

        this.addClearRectRegion = function(xy, wh) {
            this.redrawRegions.push({xy: xy, wh: wh});
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
                let cr = engine.gameObjects[index].gameObject.getClearRect();
                this.addClearRectRegion(cr.xy, cr.wh);
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
        this.frame = 1;

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
            document.jicopr.p = engine.gameObjects[0];
        }
    }

})(document)