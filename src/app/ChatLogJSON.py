import os
import json
from ollama import chat
from datetime import datetime

initTime = datetime.now().strftime("%Y%m%d_%H%M%S")
FILENAME = f"chat{initTime}.json"

logDir = "logs"
if not os.path.exists(logDir):
    os.makedirs(logDir)

FILEPATH = os.path.join(logDir, FILENAME)

def read_json():
    if os.path.exists(FILEPATH):
        with open(FILEPATH, 'r') as file:
            return json.load(file)
    return []

def write_json(data):
    with open(FILEPATH, 'w') as file:
        json.dump(data, file, indent=4)

while True:
    user_input = input('User: ')
    
    messages = read_json()

    messages.append({'role': 'user', 'content': user_input})

    response = chat(
        model='deepseek-r1:8b',
        messages=messages
    )
    
    messages.append({'role': 'assistant', 'content': response.message.content})

    write_json(messages)

    print('AI: ', response.message.content)