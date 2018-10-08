'''
Defines routes for this site
'''

from datetime import datetime
from flask import render_template, Flask, request, url_for
from .constants import URL_GITHUB, URL_LINKEDIN, MAIL_ADDDRESS, SPLASH_VIDEO_CDN_PATH
from .localization import get_string, get_lang_strings, get_default_kwargs, get_splash_kwargs

def init_routes(app: Flask):
    app.add_url_rule('/', 'splash', splash)
    app.add_url_rule('/projects', 'projects', projects)
    app.add_url_rule('/about', 'about', about)
    app.add_url_rule('/contact', 'contact', contact)
    app.add_url_rule('/cv', 'cv', cv)
    app.add_url_rule('/site-info', 'site_info', site_info)

def splash():
    lang_strings = get_lang_strings(request.args)
    splash_kwargs = get_splash_kwargs(lang_strings)

    return render_template('splash.html', **splash_kwargs)

def projects():
    lang_strings = get_lang_strings(request.args)
    default_kwargs = get_default_kwargs(lang_strings)

    return render_template('projects/projects' + lang_strings.get('lang') + '.html' , **default_kwargs,
        content_title=get_string('title_projects', lang_strings.get('lang')),
        page_title=get_string('site_name', lang_strings.get('lang')) + ' - ' + get_string('title_projects', lang_strings.get('lang')), 
        text_content="HELLO WORLD - projects",
        navbar_locator_text=get_string('title_projects', lang_strings.get('lang')).lower()
    )
    
def about():
    lang_strings = get_lang_strings(request.args)
    default_kwargs = get_default_kwargs(lang_strings)

    return render_template('about/about' + lang_strings.get('lang') + '.html' , **default_kwargs,
        content_title=get_string('name', lang_strings.get('lang')),
        page_title=get_string('site_name', lang_strings.get('lang')) + ' - ' + get_string('title_about_me', lang_strings.get('lang')), 
        text_content=get_string('about_me_content', lang_strings.get('lang')),
        navbar_locator_text=get_string('title_about_me', lang_strings.get('lang')).lower()
    )

def site_info():
    lang_strings = get_lang_strings(request.args)
    default_kwargs = get_default_kwargs(lang_strings)

    return render_template('siteinfo/siteinfo' + lang_strings.get('lang') + '.html' , **default_kwargs,
        content_title=get_string('title_site_info', lang_strings.get('lang')),
        page_title=get_string('site_name', lang_strings.get('lang')) + ' - ' + get_string('title_about_me', lang_strings.get('lang')), 
        text_content=get_string('about_me_content', lang_strings.get('lang')),
        navbar_locator_text=get_string('title_about_me', lang_strings.get('lang')).lower()
    )

def contact():
    lang_strings = get_lang_strings(request.args)
    default_kwargs = get_default_kwargs(lang_strings)

    return render_template('contact/contact' + lang_strings.get('lang') + '.html' , **default_kwargs,
        content_title=get_string('title_contact', lang_strings.get('lang')),
        page_title=get_string('site_name', lang_strings.get('lang')) + ' - ' + get_string('title_contact', lang_strings.get('lang')), 
        text_content="HELLO WORLD - CONTACT",
        navbar_locator_text=get_string('title_contact', lang_strings.get('lang')).lower()
    )

def cv():
    lang_strings = get_lang_strings(request.args)
    default_kwargs = get_default_kwargs(lang_strings)

    return render_template('cv/cv' + lang_strings.get('lang') + '.html' , **default_kwargs,
        content_title=get_string('title_cv', lang_strings.get('lang')),
        page_title=get_string('site_name', lang_strings.get('lang')) + ' - ' + get_string('title_projects', lang_strings.get('lang')), 
        text_content="HELLO WORLD - projects",
        navbar_locator_text=get_string('title_projects', lang_strings.get('lang')).lower()
    )