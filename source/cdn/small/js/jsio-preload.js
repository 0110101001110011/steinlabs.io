(function (document) {
    const EID = {
        LOADINGBAR: "loading-overlay-progressbar",
        LOADINGOVERLAY: "loading-overlay",
        LOADINGTEXT: "loading-overlay-text"
    }

    const ELEM = {
        LOADINGBAR: null,
        LOADINGOVERLAY: null,
        LOADINGTEXT: null,
        VIDEOS_TO_AUTOPLAY: [],
    }

    const VAL = {
        COL_GREY: Color(78, 78, 78),
        COL_WHITE: Color(255, 255, 255),
        NUM_LOADINGBAR_WIDTH_MAX: 100,
        DELAY_FADEOUTS: [500, 1000, 1000]
    }

    const STR = {
        LOADINGBAR_WIDTH_UNITS: "vw",
        CCLASS_FADE_OUT_LOADINGOVERLAY: "h-fade-out-easein-1s",
        CCLASS_HIDDEN: "h-hidden",
        CCLASS_WORKVIDEO_WRAPPER: "work-vid-wrapper",
        FLEXEND: "flex-end",
        LOADINGBAR_TRANSITION_POSTLOAD: "width 1s ease-in, visibility 1s, opacity 1s ease-in",
        ALLTRANS_INSTANT: "all 0s",
    }

    // Helper functions
    function Color(r, g, b, a) {
        output = { r: r, g: g, b: b };
        if (a) output.a = a;
        return output
    }

    function lerpColor(original, target, delta) {
        let red = original.r + ((target.r - original.r) * delta);
        let green = original.g + ((target.g - original.g) * delta);
        let blue = original.b + ((target.b - original.b) * delta);

        let alpha = null;


        if (original.a && !target.a) { // If original has alpha, but not target, assume target alpha is 1
            alpha = original.a + ((1 - original.a) * delta);
        } else if (target.a && !original.a) { // Else if target has alpha, but not original assume original alpha is 1
            alpha = 1 + ((target.a - 1) * delta);
        } else if (!original.a && !target.a) { // Else if neither have alpha
            alpha = null;
        } else { // Else if both have alpha
            alpha = original.a + ((target.a - original.a) * delta);
        }

        return Color(red, green, blue, alpha);
    }

    function colorToString(color) {
        let output = `rgb(${color.r}, ${color.g}, ${color.b})`;

        if (color.a) {
            output = (output.slice(0, output.length - 1) + `, ${color.a})`).replace("rgb", "rgba");
        }

        return output;
    }

    function lerpNum(original, target, delta) {
        return (!isNaN(original) && !isNaN(target) && !isNaN(delta)) ? (original + ((target - original) * delta)) : 0;
    }

    document.addEventListener("DOMContentLoaded", function () {
        // Get element references
        ELEM.LOADINGBAR = document.getElementById(EID.LOADINGBAR);
        ELEM.LOADINGOVERLAY = document.getElementById(EID.LOADINGOVERLAY);
        ELEM.LOADINGTEXT = document.getElementById(EID.LOADINGTEXT);

        if (QUICKLOAD) {
            ELEM.LOADINGOVERLAY.classList.add(STR.CCLASS_FADE_OUT_LOADINGOVERLAY);
            ELEM.LOADINGOVERLAY.style.transition = STR.ALLTRANS_INSTANT;
        }

        // Page load progress event listener
        document.loadTracker.registerProgressCallback(function (progress, autoplayVideoElement) {
            ELEM.LOADINGBAR.style.backgroundColor = colorToString(lerpColor(VAL.COL_GREY, VAL.COL_WHITE, progress));
            ELEM.LOADINGBAR.style.width = lerpNum(0, VAL.NUM_LOADINGBAR_WIDTH_MAX, progress) + STR.LOADINGBAR_WIDTH_UNITS;
            if (autoplayVideoElement) ELEM.VIDEOS_TO_AUTOPLAY.push(autoplayVideoElement);

            if (progress >= 1) {
                ELEM.LOADINGTEXT.classList.add(STR.CCLASS_FADE_OUT_LOADINGOVERLAY);
                setTimeout(() => {
                    ELEM.LOADINGBAR.style.alignSelf = STR.FLEXEND;
                    ELEM.LOADINGBAR.style.width = 0;
                    ELEM.LOADINGBAR.style.transition = STR.LOADINGBAR_TRANSITION_POSTLOAD;
                    ELEM.LOADINGBAR.classList.add(STR.CCLASS_FADE_OUT_LOADINGOVERLAY);

                    setTimeout(() => {
                        ELEM.LOADINGOVERLAY.classList.add(STR.CCLASS_FADE_OUT_LOADINGOVERLAY);
                        ELEM.VIDEOS_TO_AUTOPLAY.forEach(element => { element.play(); });

                    }, VAL.DELAY_FADEOUTS[1]);
                }, VAL.DELAY_FADEOUTS[0]);
            }
        });

        // Add callbacks for all videos
        let videos = [].slice.call(document.getElementsByClassName(STR.CCLASS_WORKVIDEO_WRAPPER));
        for (let index = 0; index < videos.length; index++) {
            let vid = videos[index].children[0];
            let playbutton = videos[index].children[1];

            videos[index].addEventListener("click", function (e) {
                if (vid.paused) {
                    vid.play();
                    playbutton.classList.add(STR.CCLASS_HIDDEN);
                } else {
                    vid.pause();
                    playbutton.classList.remove(STR.CCLASS_HIDDEN);
                }
            });

        }
    });
})(document);