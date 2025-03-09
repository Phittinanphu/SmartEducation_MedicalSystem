import os
import json
from ollama import chat
from datetime import datetime
from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")

initTime = datetime.now().strftime("%Y%m%d_%H%M%S")
FILENAME = f"chat{initTime}.json"

logDir = "logs"
if not os.path.exists(logDir):
    os.makedirs(logDir)

FILEPATH = os.path.join(logDir, FILENAME)


def read_json():
    if os.path.exists(FILEPATH):
        with open(FILEPATH, "r") as file:
            return json.load(file)
    return []


def write_json(data):
    with open(FILEPATH, "w") as file:
        json.dump(data, file, indent=4)


def filter_think_tags(content):
    return re.sub(r"<think>.*?</think>", "", content, flags=re.DOTALL)


@socketio.on("message")
def handle_message(user_input):
    messages = read_json()
    messages.append({"role": "user", "content": user_input})

    response = chat(model="deepseek-r1:latest", messages=messages)
    filtered_content = filter_think_tags(response.message.content)

    messages.append({"role": "assistant", "content": filtered_content})
    write_json(messages)

    emit("response", filtered_content)


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5001)
