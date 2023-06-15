from flask import Flask, jsonify, render_template
import json

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/data/shoes.json')
def get_shoes_data():
    # Đọc dữ liệu từ tệp shoes.json và trả về như là JSON
    with open('app/static/data/shoes.json') as f:
        shoes_data = json.load(f)
    return jsonify(shoes_data)

if __name__ == '__main__':
    app.run()
