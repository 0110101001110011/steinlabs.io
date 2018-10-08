from flask import Flask, url_for
from lib.routing import init_routes

def create_app(test: bool = False):
    '''
    Entry point for the webserver
    '''
    
    app = Flask(__name__, static_url_path='/cdn', static_folder='static/cdn')
    
    init_routes(app)
    return app