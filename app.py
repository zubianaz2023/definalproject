from flask import Flask

app = Flask(__name__)

@app.route('/api/')
def hello_world():
    return "<p>Hello, World!</p>"
@app.route('/api/test')
def test():
    return "<p>Testing New Route</p>"