from flask import Flask, Response, send_from_directory, request, flash
from camera import Camera
from werkzeug.utils import secure_filename
import os
from flask_socketio import SocketIO, emit
import time
import cv2
import base64
from threading import Thread
import serial

# app = Flask(__name__)
app = Flask(__name__,static_folder='../react-flask-app/build')
app.config['UPLOAD_FOLDER'] = "./uploads"
app.secret_key = 'hola'
socketio = SocketIO(app, cors_allowed_origins="*")

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


@app.route('/upload_file', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        print(request.files)
        if 'file' not in request.files:
            flash('No file part')
            return 'bad request no file part!', 400
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            flash('No selected file')
            return 'bad request no file!', 400
        if file:
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            print(filename)
            os.system("sudo cp ./uploads/{} /dev/disk/by-label/MICROBIT".format(filename))
            # with serial.Serial('/dev/disk/by-label/MICROBIT', baudrate=115200) as ser:
            #     ser.write(file.read())
            return 'archivo guardado', 200



# def send_file_to_microbit(file_path):
#     ser = serial.Serial('/dev/ttyUSB0', baudrate=9600)  # Update with your Microbit serial port
#     with open(file_path, 'rb') as file:
#         file_data = file.read()
#         ser.write(file_data)
#     ser.close()
# # OpenCV setup - Replace '0' with the camera index or video file path


@socketio.on('video_feed', namespace='/streaming')
def image(data):
    cap = cv2.VideoCapture(0)
    while not stop: 
        success, frame = cap.read()
        # Encode the frame as JPEG
        if(success):
            _, buffer = cv2.imencode('.jpg', frame)
            frame_encoded = base64.b64encode(buffer).decode('utf-8')
            # Send the frame to the client
            emit('video_frame', {'image': frame_encoded})
        time.sleep(1/int(data))

@socketio.on('stop_video_feed', namespace='/streaming')
def stop(data):   
    global stop
    stop = True



@socketio.on('connect', namespace='/streaming')
def handle_connect():
    global stop
    stop = False

    print("Client connected")

@socketio.on('disconnect',namespace='/streaming')
def test_disconnect():
    global cap
    print('Client disconnected')
    if(cap):
        cap.release()


# if __name__ == "__main__":
#     from waitress import serve
#     serve(app, host="0.0.0.0", port=5000)

