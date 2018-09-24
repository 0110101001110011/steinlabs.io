'''
Constant values
'''

# For global usage
URL_GITHUB = 'https://github.com/SteinLabs'
URL_LINKEDIN = 'https://www.linkedin.com/in/james-stanton/' # TODO test this
MAIL_ADDDRESS = 'jestanton@outlook.com'
URL_SPLASH_VIDEO = 'https://giant.gfycat.com/AnguishedAcceptableCockatiel.mp4'
COLOR_PINK = '#ff82e0'

def wrap_url(in_url: str, in_link_text: str) -> str:
    '''
    Wraps a string in <a> HTML tags
    '''

    return HTML_TAGS.format(url=in_url, link_text=in_link_text)

def wrap_color(in_string: str, in_color_tag: str) -> str:
    '''
    Wraps a string in a color style tag (#ffffff etc.)
    '''

    return COLOR_TAGS.format(color_tag=in_color_tag, colored_text=in_string)

# Internal
HTML_TAGS = '''<a href="{url}">{link_text}</a>'''
COLOR_TAGS = '''<span style="color: {color_tag}">{colored_text}</span>'''