'''
A module that serves string values according to the provided language setting.
'''

from datetime import datetime
from flask import request
from .constants import URL_GITHUB, URL_LINKEDIN, MAIL_ADDDRESS

STR_EN = 'EN'
STR_JP = 'JP'
ALLOWED_LANGUAGES = [STR_EN, STR_JP]
ERROR_STRING = 'INVALID STRING REFERENCE'
ERROR_LANG = 'INVALID LANGUAGE STRING'
JP_QUERY_PARAMS = '?lang=JP'

STRING_VALUES = {
    'site_name': ('jstanton.io', 'jstanton.io'),
    'name': ('James Einosuke Stanton', 'スタントン ジェームズ 瑛之助'),
    'game_developer': ('Game Developer', 'ゲーム開発者'),
    'enter': ('Enter', '入る'),
    'other_lang': ('日本語', 'ENG'),
    'powered_by_flask': ('Powered by Flask', 'FLASKと開発されたサイトです'),
    'title_about_me': ('About Me', '自己紹介'),
    'title_index': ('Index Page', '索引'),
    'title_contact': ('Contact', '連絡方法')
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
        powered_by_flask=get_string('powered_by_flask', lang_strings.get('lang')),
        url_github=URL_GITHUB,
        url_linkedin=URL_LINKEDIN,
        email_address=MAIL_ADDDRESS,
        link_text_about_me=get_string('title_about_me', lang_strings.get('lang')),
        link_text_index=get_string('title_index', lang_strings.get('lang')),
        link_text_contact=get_string('title_contact', lang_strings.get('lang'))
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