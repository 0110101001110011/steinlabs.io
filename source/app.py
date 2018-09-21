from flask import Flask

def create_app(test: bool = False):
    '''
    Entry point for the webserver
    '''
    
    app = Flask(__name__)

    @app.route("/")
    def home():
        return 'Hello, Flask!'

    return app