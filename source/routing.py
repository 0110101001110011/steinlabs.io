'''
Defines routes for this site
'''

from flask import render_template, Flask, request
from localization import get_string, sanitize_lang_string

def init_routes(app: Flask):
    app.add_url_rule('/', 'splash', splash)
    app.add_url_rule('/index', 'index', index)

def splash():
    lang = sanitize_lang_string(request.args.get('lang'))
    generated_query_string = '' if lang == 'EN' else '?lang=JP'
    s_enter_link = request.url_root + 'index' + generated_query_string   

    s_name = get_string('name', lang).upper()
    s_game_dev = get_string('game_developer', lang)
    s_button_enter = get_string('enter', lang).upper()

    return render_template('splash.html', name=s_name, game_dev=s_game_dev, button_enter=s_button_enter, enter_link=s_enter_link)

def index():
    lang = sanitize_lang_string(request.args.get('lang'))  
    generated_query_string = '' if lang == 'EN' else '?lang=JP'
    s_enter_link = request.url_root + 'index' + generated_query_string

    return render_template('index.html')