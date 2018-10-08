var MENU = Object.freeze({ NONE: 0, NAV: 1, LANG: 2 });
MENU_STATE = MENU.NONE;
NAV_DROPDOWN = LANG_DROPDOWN = NAVBAR = BODY_CONTENT = BODY = null;

init();

function toggleMenu(isbody, menu) {
    if (isbody) {
        if (MENU_STATE != MENU.NONE) {
            NAV_DROPDOWN.classList.remove('visible');
            LANG_DROPDOWN.classList.remove('visible');
            BODY_CONTENT.classList.remove('padding-top-info')
            MENU_STATE = MENU.NONE;
        }
    } else {
        switch (menu) {
            case MENU.NAV:
                if (MENU_STATE == MENU.NAV) {
                    NAV_DROPDOWN.classList.remove('visible');
                    LANG_DROPDOWN.classList.remove('visible');
                    BODY_CONTENT.classList.remove('padding-top-info')
                    MENU_STATE = MENU.NONE;
                } else {
                    NAV_DROPDOWN.classList.add('visible');
                    LANG_DROPDOWN.classList.remove('visible');
                    BODY_CONTENT.classList.remove('padding-top-lang')
                    BODY_CONTENT.classList.add('padding-top-info')
                    MENU_STATE = MENU.NAV;
                }
                break;
            case MENU.LANG:
                if (MENU_STATE == MENU.LANG) {
                    NAV_DROPDOWN.classList.remove('visible');
                    LANG_DROPDOWN.classList.remove('visible');
                    BODY_CONTENT.classList.remove('padding-top-lang')
                    MENU_STATE = MENU.NONE;
                } else {
                    NAV_DROPDOWN.classList.remove('visible');
                    LANG_DROPDOWN.classList.add('visible');
                    BODY_CONTENT.classList.remove('padding-top-info')
                    BODY_CONTENT.classList.add('padding-top-lang')
                    MENU_STATE = MENU.LANG;
                }
                break;
        }
    }
}

function init() {
    NAV_DROPDOWN = document.getElementById("nav-dropdown-nav");
    LANG_DROPDOWN = document.getElementById("nav-dropdown-lang");
    NAVBAR = document.getElementById("navbar");
    BODY_CONTENT = document.getElementById("body-content");
    BODY = document.getElementById("page-body");

    NAVBAR.addEventListener("click", function (ev) { ev.stopPropagation(); }, false);
    NAV_DROPDOWN.addEventListener("click", function (ev) { ev.stopPropagation(); }, false);
    LANG_DROPDOWN.addEventListener("click", function (ev) { ev.stopPropagation(); }, false);
}