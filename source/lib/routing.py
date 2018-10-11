'''
Defines routes for this site
'''

from datetime import datetime
from flask import render_template, Flask, request, url_for
from .constants import URL_GITHUB, URL_LINKEDIN, MAIL_ADDDRESS, SPLASH_VIDEO_CDN_PATH
from .localization import get_string, get_lang_strings, get_default_kwargs, get_splash_kwargs

def init_routes(app: Flask):
    app.add_url_rule('/', 'main', main)

def main():

    return render_template('main_jp.html')