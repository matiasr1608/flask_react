from flask import Flask, Response, send_from_directory
from camera import Camera
import os

# app = Flask(__name__)
app = Flask(__name__,static_folder='../react-flask-app/build')


def gen(camera):
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
        
@app.route('/video_feed')
def video_feed():
    return Response(gen(Camera()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


# Serve the static files from the React build folder

# @app.route('/<path:path>')
# def serve_static(path):
#     print(path)
#     return send_from_directory('../react-flask-app/build/static', filename)

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    print(path)
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


