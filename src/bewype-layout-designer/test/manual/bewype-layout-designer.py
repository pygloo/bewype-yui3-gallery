import os
from flask import Flask, request, render_template
from werkzeug import secure_filename

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('bewype-layout-designer.html')

@app.route('/upload', methods=['POST'])
def upload():
    _file = request.files['file']
    _filename = secure_filename(_file.filename)
    _file.save(os.path.join('static', _filename))
    return _filename

if __name__ == '__main__':
    app.run(debug=True)
