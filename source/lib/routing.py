'''
Defines routes for this site
'''

from datetime import datetime
from flask import render_template, Flask, request
from .constants import URL_GITHUB, URL_LINKEDIN, MAIL_ADDDRESS, URL_SPLASH_VIDEO, wrap_color, COLOR_PINK
from .localization import get_string, get_lang_strings, get_default_kwargs

def init_routes(app: Flask):
    app.add_url_rule('/', 'splash', splash)
    app.add_url_rule('/index', 'index', index)
    app.add_url_rule('/about', 'about', about)
    app.add_url_rule('/contact', 'contact', contact)

def splash():
    lang_strings = get_lang_strings(request.args)

    return render_template('splash.html',
        page_title= get_string('site_name', lang_strings.get('lang')), 
        name=get_string('name', lang_strings.get('lang')),
        game_dev=get_string('game_developer', lang_strings.get('lang')).upper(),
        button_enter=get_string('enter', lang_strings.get('lang')).upper(),
        link_enter=request.url_root + 'index' + lang_strings.get('query_param'), 
        button_lang=get_string('other_lang', lang_strings.get('lang')).upper(),
        query_toggle_lang=lang_strings.get('query_param_toggle'),
        query_current_lang=lang_strings.get('query_param'),
        self_url=request.base_url,
        gfy_splash_video_url=URL_SPLASH_VIDEO
    )

def index():
    lang_strings = get_lang_strings(request.args)
    default_kwargs = get_default_kwargs(lang_strings)

    return render_template('info_page.html', **default_kwargs,
        content_title=get_string('title_index', lang_strings.get('lang')),
        page_title=get_string('site_name', lang_strings.get('lang')) + ' - ' + get_string('title_index', lang_strings.get('lang')), 
        text_content="HELLO WORLD - INDEX"
    )
    
def about():
    lang_strings = get_lang_strings(request.args)
    default_kwargs = get_default_kwargs(lang_strings)

    return render_template('info_page.html', **default_kwargs,
        content_title=get_string('title_about_me', lang_strings.get('lang')),
        page_title=get_string('site_name', lang_strings.get('lang')) + ' - ' + get_string('title_about_me', lang_strings.get('lang')), 
        text_content=get_string('about_me_content', lang_strings.get('lang'))
    )

def contact():
    lang_strings = get_lang_strings(request.args)
    default_kwargs = get_default_kwargs(lang_strings)

    return render_template('info_page.html', **default_kwargs,
        content_title=get_string('title_contact', lang_strings.get('lang')),
        page_title=get_string('site_name', lang_strings.get('lang')) + ' - ' + get_string('title_contact', lang_strings.get('lang')), 
        text_content="HELLO WORLD - CONTACT"
    )