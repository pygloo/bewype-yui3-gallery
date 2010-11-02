import os
from flask import Flask, request, render_template
from werkzeug import secure_filename

app = Flask(__name__)

@app.route('/')
def hello_world():
    return render_template('button-picker-file.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    filename = secure_filename(file.filename)
    file.save(os.path.join('uploads', filename))
    return 'ok'

if __name__ == '__main__':
    app.run(debug=True)
