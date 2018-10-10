'''
Defines routes for this site
'''

from datetime import datetime
from flask import render_template, Flask, request, url_for
from .constants import URL_GITHUB, URL_LINKEDIN, MAIL_ADDDRESS, SPLASH_VIDEO_CDN_PATH
from .localization import get_string, get_lang_strings, get_default_kwargs, get_splash_kwargs

def init_routes(app: Flask):
    app.add_url_rule('/en/', 'entry_en', entry_en)
    app.add_url_rule('/jp/', 'entry_jp', entry_jp)
    app.add_url_rule('/en/site', 'site_en', site_en)
    app.add_url_rule('/jp/site', 'site_jp', site_jp)

def entry_en():

    return render_template('entry/entry_en.html')

def entry_jp():

    return render_template('entry/entry_jp.html')

def site_en():

    return render_template('site/site_en.html')

def site_jp():

    return render_template('site/site_jp.html')