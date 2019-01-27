(function (document) {
    const EID = {
        LOADINGBAR: "loading-overlay-progressbar",
        LOADINGOVERLAY: "loading-overlay",
        LOADINGTEXT: "loading-overlay-text",
        FIRST_WORKPAGE: "wp-sk",
        WORK_FADER: "work-fader"
    }

    const ELEM = {
        LOADINGBAR: null,
        LOADINGOVERLAY: null,
        LOADINGTEXT: null,
        VIDEOS_TO_AUTOPLAY: [],
        WORK: [[], []],
        WORK_FADER: null,
    }

    const VAL = {
        COL_GREY: Color(78, 78, 78),
        COL_WHITE: Color(255, 255, 255),
        NUM_LOADINGBAR_WIDTH_MAX: 100,
        DELAY_FADEOUTS: [500, 1000, 1000],
        SCROLL_BLOCK_KEYCODES: [32, 33, 34, 34, 35, 36, 38, 40],
        ESC_KEYCODE: 27,
        SCROLLBAR_WIDTH: "-" + (window.innerWidth - document.documentElement.clientWidth) + "px"
    }

    const STR = {
        LOADINGBAR_WIDTH_UNITS: "vw",
        CCLASS_FADE_OUT_LOADINGOVERLAY: "h-fade-out-easein-1s",
        CCLASS_SMOOTHSCROLL_OFF: "h-scrollauto",
        CCLASS_PFIXED: "h-fixed",
        CCLASS_HIDDEN: "h-hidden",
        CCLASS_WORKVIDEO: "work-vid",
        CCLASS_WORKPAGE: "work-page",
        CCLASS_WORKPAGE_HIDDEN: "work-page-hidden",
        CCLASS_WORKPAGE_TILE: "work-item",
        CCLASS_THUMBNAILACTIVE: "work-item-active",
        CCLASS_WORK_FADERFLASH: "work-fader-anim",
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
        let videos = [].slice.call(document.getElementsByClassName(STR.CCLASS_WORKVIDEO));
        for (let index = 0; index < videos.length; index++) {
            videos[index].addEventListener("click", function (e) {
                if (videos[index].paused) {
                    videos[index].play();
                } else {
                    videos[index].pause();
                }
            });
        }

        // Add callbacks for work pages
        function setCurrentWorkpage(id, force) {
            if (!id || id.length == 0) {
                localStorage.setItem("currentWorkPageId", "-sk");
                return;
            }

            if (document.getElementById("wt" + id).classList.contains(STR.CCLASS_THUMBNAILACTIVE)) {
                if (!force) {
                    let workAnchor = document.getElementById("work-section-anchor");
                    if (workAnchor.getBoundingClientRect().top >= 0) {
                        workAnchor.scrollIntoView();
                    }
                }
                return;
            }

            if (!force) {
                ELEM.WORK_FADER.classList.remove(STR.CCLASS_WORK_FADERFLASH);
                void ELEM.WORK_FADER.offsetWidth;
                ELEM.WORK_FADER.classList.add(STR.CCLASS_WORK_FADERFLASH);

                let workAnchor = document.getElementById("work-section-anchor");
                if (workAnchor.getBoundingClientRect().top >= 0) {
                    workAnchor.scrollIntoView();
                }
            }

            for (let index = 0; index < ELEM.WORK[0].length; index++) {
                if (ELEM.WORK[0][index]) ELEM.WORK[0][index].classList.remove(STR.CCLASS_THUMBNAILACTIVE);  
            }

            document.getElementById("wt" + id).classList.add(STR.CCLASS_THUMBNAILACTIVE);

            let delay = force ? 0 : 500;

            setTimeout(() => {
                for (let index = 0; index < ELEM.WORK[0].length; index++) {
                    if (ELEM.WORK[1][index]) ELEM.WORK[1][index].classList.add(STR.CCLASS_WORKPAGE_HIDDEN);
                }
                document.getElementById("wp" + id).classList.remove(STR.CCLASS_WORKPAGE_HIDDEN);
                let currentVideo = document.getElementById("vp" + localStorage.getItem("currentWorkPageId"));
                if (currentVideo) currentVideo.pause();
                localStorage.setItem("currentWorkPageId", id);
            }, delay);
        }

        ELEM.WORK[0] = [].slice.call(document.getElementsByClassName(STR.CCLASS_WORKPAGE_TILE));
        ELEM.WORK[1] = [].slice.call(document.getElementsByClassName(STR.CCLASS_WORKPAGE));
        ELEM.WORK_FADER = document.getElementById(EID.WORK_FADER);
        
        setCurrentWorkpage(localStorage.getItem("currentWorkPageId"), true);
        
        for (let index = 0; index < ELEM.WORK[0].length; index++) {
            ELEM.WORK[0][index].addEventListener("click", function (e) {
                setCurrentWorkpage(ELEM.WORK[0][index].id.replace("wt", ""));
            });
        }
    });
})(document);