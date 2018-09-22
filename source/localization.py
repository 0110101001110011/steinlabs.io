'''
A module that serves string values according to the provided language setting.
'''

ALLOWED_LANGUAGES = ['EN', 'JP']
ERROR_STRING = 'INVALID STRING REFERENCE'
ERROR_LANG = 'INVALID LANGUAGE STRING'

STRING_VALUES = {
    'name': ('James Einosuke Stanton', 'スタントン ジェームズ 瑛之助'),
    'game_developer': ('Game Developer', 'ゲーム開発者'),
    'enter': ('Enter', '入る')
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
        return 'EN'

    return arg