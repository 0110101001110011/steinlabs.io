'''
A module containing helper functions for various things...
'''

import requests

def get_vimeo_raw(vid_id: int, resolution: str):
    '''
    Allowed resolutions:
    1080, 720, 540, 360.

    If the chosen one is not found it searches down the heirarchy
    '''

    # Must be in descending order for the next bit to work properly!
    resolutions = ['1080p', '720p', '540p', '360p']

    if (str(resolution) + 'p') not in resolutions:
        return ''

    resolutions.remove((str(resolution) + 'p'))

    try:
        response = requests.get('https://player.vimeo.com/video/{}/config'.format(str(vid_id)))
        opts = response.json()['request']['files']['progressive']

        urls = {}

        for opt in opts:
            urls[opt.get('quality')] = opt.get('url')

        if (str(resolution) + 'p') in urls.keys():
            return urls[(str(resolution) + 'p')]

        for resolution in resolutions:
            if resolution in urls.keys():
                return urls[resolution]
    except Exception:
        return ''

    return ''
    