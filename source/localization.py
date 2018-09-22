'''
A module that serves string values according to the provided language setting.
'''

from flask import request

STR_EN = 'EN'
STR_JP = 'JP'
ALLOWED_LANGUAGES = [STR_EN, STR_JP]
ERROR_STRING = 'INVALID STRING REFERENCE'
ERROR_LANG = 'INVALID LANGUAGE STRING'
JP_QUERY_PARAMS = '?lang=JP'

STRING_VALUES = {
    'name': ('James Einosuke Stanton', 'スタントン ジェームズ 瑛之助'),
    'game_developer': ('Game Developer', 'ゲーム開発者'),
    'enter': ('Enter', '入る'),
    'other_lang': ('日本語', 'ENG'),
    'about_me': ('About me', '自己紹介')
}

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