from flask import Flask
from routing import init_routes

def create_app(test: bool = False):
    '''
    Entry point for the webserver
    '''
    
    app = Flask(__name__)

    init_routes(app)

    return app