'''
Constant values
'''

# For global usage
URL_GITHUB = 'https://github.com/SteinLabs'
URL_LINKEDIN = 'https://www.linkedin.com/in/james-stanton/'
MAIL_ADDDRESS = 'jestanton@outlook.com'
SPLASH_VIDEO_CDN_PATH = 'video/starlight_angel_720_rf26.mp4'
SPLASH_ALT_IMAGE_CDN_PATH = 'images/starlight_angel_720_rf26_still.jpg'
HIGHLIGHT_COLOR = '#000000'
COLOR = {
    'BLACKISH': '#0b0c10',
    'DARKDARKBLUE': '#1f2833',
    'GREY': '#c5c6c7',
    'NEONTEAL': '#66fcf1',
    'MURKYTEAL': '#45a29e'
}

def wrap_color(in_string: str, in_color_tag: str) -> str:
    '''
    Wraps a string in a color style tag (#ffffff etc.)
    '''

    return COLOR_TAGS.format(color_tag=in_color_tag, colored_text=in_string)

# Internal
COLOR_TAGS = '''<span style="color: {color_tag}">{colored_text}</span>'''
