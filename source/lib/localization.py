'''
A module that serves string values according to the provided language setting.
'''

from datetime import datetime
from flask import request, url_for
from .constants import URL_GITHUB, URL_LINKEDIN, MAIL_ADDDRESS, SPLASH_VIDEO_CDN_PATH, SPLASH_ALT_IMAGE_CDN_PATH, wrap_color, COLOR

STR_EN = 'EN'
STR_JP = 'JP'
ALLOWED_LANGUAGES = [STR_EN, STR_JP]
ERROR_STRING = 'INVALID STRING REFERENCE'
ERROR_LANG = 'INVALID LANGUAGE STRING'
JP_QUERY_PARAMS = '?lang=JP'

STRING_VALUES = {
    'site_name': ('jstanton.io', 'jstanton.io'),
    'splash_name': ('<div class="word-break-control-inner"><div class="word-break-word">James</div><div class="word-break-word">Einosuke</div></div><div class="word-break-word">Stanton</div>', '<div class="word-break-word">スタントン</div><div class="word-break-control-inner"><div class="word-break-word">ジェームズ</div><div class="word-break-word">瑛之助</div></div>'),
    'name': ('James Einosuke Stanton', 'スタントン ジェームズ&nbsp;瑛之助'),
    'game_developer': ('Game Developer', 'ゲーム開発者'),
    'enter': ('Enter', '入る'),
    'other_lang': ('日本語', 'ENG'),
    'about_this_site': (wrap_color('About this site', COLOR['NEONTEAL']), wrap_color('このサイトについて', COLOR['NEONTEAL'])),
    'title_about_me': ('About Me', '自己紹介'),
    'title_projects': ('Projects', '作品'),
    'title_contact': ('Contact', '連絡方法'),
    'title_cv': ('CV', '履歴書'),
    'title_site_info': ('About this site', 'このサイトについて'),
    'info_text': ('Info', '情報'),
    'lang_text': ('言語', 'Language')
}

def get_default_kwargs(lang_strings: dict):
    '''
    Returns a dictionary representing the kwargs that are always passed to html rendering tasks
    '''
    kwargs_out = dict(
        button_lang=get_string('other_lang', lang_strings.get('lang')).upper(),
        query_toggle_lang=lang_strings.get('query_param_toggle'),
        query_current_lang=lang_strings.get('query_param'),
        self_url=request.base_url,
        name=get_string('name', lang_strings.get('lang')),
        current_year=datetime.now().year,
        about_this_site=get_string('about_this_site', lang_strings.get('lang')),
        link_text_about_me=get_string('title_about_me', lang_strings.get('lang')),
        link_text_projects=get_string('title_projects', lang_strings.get('lang')),
        link_text_contact=get_string('title_contact', lang_strings.get('lang')),
        link_text_cv=get_string('title_cv', lang_strings.get('lang')),
        nav_dropdown_text=get_string('nav_dropdown_text', lang_strings.get('lang')),
        site_name=get_string('site_name', lang_strings.get('lang')),
        info_text=get_string('info_text', lang_strings.get('lang')),
        lang_text=get_string('lang_text', lang_strings.get('lang'))
    )

    return kwargs_out

def get_splash_kwargs(lang_strings: dict):
    '''
    Returns a dictionary representing the kwargs that are always passed to the splash screen rendering task
    '''
    kwargs_out = dict(    
        page_title= get_string('site_name', lang_strings.get('lang')), 
        splash_name_block=get_string('splash_name', lang_strings.get('lang')),
        game_dev=get_string('game_developer', lang_strings.get('lang')).upper(),
        button_enter=get_string('enter', lang_strings.get('lang')).upper(),
        link_enter=request.url_root + 'projects' + lang_strings.get('query_param'), 
        button_lang=get_string('other_lang', lang_strings.get('lang')).upper(),
        query_toggle_lang=lang_strings.get('query_param_toggle'),
        query_current_lang=lang_strings.get('query_param'),
        self_url=request.base_url,
        splash_video_url=url_for('static', filename=SPLASH_VIDEO_CDN_PATH),
        splash_image_url=url_for('static', filename=SPLASH_ALT_IMAGE_CDN_PATH)
    )

    return kwargs_out

def get_string(string_reference: str, language: str):
    '''
    Get the string for the specified language, for the provided string_reference

    See STRING_VALUES for details
    '''

    if (not validate(language)):
        return ERROR_LANG

    result = STRING_VALUES.get(string_reference, ERROR_STRING)
    if isinstance(result, tuple):
        result = result[ALLOWED_LANGUAGES.index(language)]
    
    return result

def validate(language: str) -> bool:
    '''
    Returns true if the language string is valid, else false
    '''

    if language not in ALLOWED_LANGUAGES:
        return False
    return True

def sanitize_lang_string(arg: str) -> str:
    '''
    Checks a string that is thought to represent a language and sanitizes it:
    None/invalid: EN
    EN or JP: returns the value unmodified
    '''

    if not arg or arg not in ALLOWED_LANGUAGES:
        return STR_EN

    return arg

def get_lang_strings(in_request_args: request) -> dict:
    '''
    Takes a request arg dict (request.url) and identifies the appropriate query params and language identifier.

    Returns a dictionary that looks something like this:

    {
        lang: 'EN'
        query_param: ''
        query_param_toggle: 'lang=JP'
    }
    '''

    output_dictionary = {}

    output_dictionary['lang'] = sanitize_lang_string(in_request_args.get('lang'))
    output_dictionary['query_param'] = '' if output_dictionary['lang'] == STR_EN else JP_QUERY_PARAMS
    output_dictionary['query_param_toggle'] = '' if output_dictionary['query_param'] == JP_QUERY_PARAMS else JP_QUERY_PARAMS

    return output_dictionary