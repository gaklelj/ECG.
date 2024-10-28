from gevent import monkey
monkey.patch_all()

import cv2
import mss
import numpy as np
import grequests  
import base64
from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = '4a4d7ebd0880ec84a2a19a8b7b6a5e7d9f1f4c0d2a9e5a7e9cfa1f2d0f8a7e2e'
socketio = SocketIO(app, cors_allowed_origins="*")

API_KEY = "WapH9HvnhmB00awLAv3N"
PROJECT_NAME = "ecg.analyze"
MODEL_VERSION = "5"

capturing = False

def predict(image):
    url = f"https://detect.roboflow.com/{PROJECT_NAME}/{MODEL_VERSION}?api_key={API_KEY}"
    _, img_encoded = cv2.imencode('.jpg', image)
    request = grequests.post(url, files={"file": img_encoded.tobytes()})
    response = grequests.map([request])[0] 
    predictions = response.json()
    return predictions

def draw_bounding_boxes(image, predictions):
    for prediction in predictions.get('predictions', []):
        x = prediction['x']
        y = prediction['y']
        width = prediction['width']
        height = prediction['height']
        label = prediction['class']
        confidence = prediction['confidence']

        x1 = int(x - width / 2)
        y1 = int(y - height / 2)
        x2 = int(x + width / 2)
        y2 = int(y + height / 2)

        cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(image, f"{label} {confidence:.2f}", (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
    return image

def capture_and_process_screen():
    global capturing
    capturing = True
    sct = mss.mss()
    monitor = sct.monitors[1] 

    while capturing:
        screen_shot = sct.grab(monitor)
        img = np.array(screen_shot)
        img = cv2.cvtColor(img, cv2.COLOR_RGBA2BGR)

        predictions = predict(img)

        if 'predictions' in predictions:
            img = draw_bounding_boxes(img, predictions)

        _, buffer = cv2.imencode('.jpg', img)
        jpg_as_text = base64.b64encode(buffer).decode('utf-8')

        socketio.emit('frame', {'image': jpg_as_text})

        socketio.sleep(0.2)

@app.route('/')
def index():
    return render_template('project.html')

@socketio.on('start_capture')
def handle_start_capture():
    print('Starting screen capture...')
    socketio.start_background_task(capture_and_process_screen)

@socketio.on('stop_capture')
def handle_stop_capture():
    global capturing
    capturing = False
    print('Stopping screen capture...')

if __name__ == '__main__':
    capturing=False
    socketio.run(app, host='0.0.0.0', port=5000)
