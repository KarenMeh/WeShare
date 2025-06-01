from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
from datetime import datetime
import markdown
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder='public')
CORS(app)

# Configuration
UPLOAD_FOLDER = 'public/uploads'
DATA_FOLDER = 'public/data'
POSTS_FILE = os.path.join(DATA_FOLDER, 'posts.json')

# Create necessary directories
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(DATA_FOLDER, exist_ok=True)

# Initialize posts file if it doesn't exist
if not os.path.exists(POSTS_FILE):
    with open(POSTS_FILE, 'w') as f:
        json.dump([], f)

def get_posts():
    with open(POSTS_FILE, 'r') as f:
        return json.load(f)

def save_posts(posts):
    with open(POSTS_FILE, 'w') as f:
        json.dump(posts, f, indent=4)

@app.route('/api/posts', methods=['GET'])
def get_all_posts():
    return jsonify(get_posts())

@app.route('/api/posts', methods=['POST'])
def create_post():
    posts = get_posts()
    
    # Get form data
    title = request.form.get('title')
    category = request.form.get('category')
    date = request.form.get('date')
    description = request.form.get('description')
    
    # Handle image upload
    image = request.files.get('image')
    image_name = None
    
    if image:
        filename = secure_filename(f"{datetime.now().timestamp()}_{image.filename}")
        image_path = os.path.join(UPLOAD_FOLDER, filename)
        image.save(image_path)
        image_name = filename
    
    post = {
        'id': str(int(datetime.now().timestamp())),
        'title': title,
        'category': category,
        'date': date,
        'description': description,
        'image': image_name
    }
    
    posts.append(post)
    save_posts(posts)
    
    return jsonify({'success': True, 'post': post})

@app.route('/api/posts', methods=['PUT'])
def update_post():
    posts = get_posts()
    data = request.form
    
    post_id = data.get('id')
    for post in posts:
        if post['id'] == post_id:
            post['title'] = data.get('title')
            post['category'] = data.get('category')
            post['date'] = data.get('date')
            post['description'] = data.get('description')
            
            # Handle image upload for update
            image = request.files.get('image')
            if image:
                filename = secure_filename(f"{datetime.now().timestamp()}_{image.filename}")
                image_path = os.path.join(UPLOAD_FOLDER, filename)
                image.save(image_path)
                post['image'] = filename
            
            break
    
    save_posts(posts)
    return jsonify({'success': True})

@app.route('/api/posts', methods=['DELETE'])
def delete_post():
    posts = get_posts()
    post_id = request.form.get('id')
    
    # Remove post from list
    posts = [post for post in posts if post['id'] != post_id]
    save_posts(posts)
    
    return jsonify({'success': True})

@app.route('/api/markdown', methods=['POST'])
def convert_markdown():
    data = request.get_json()
    if not data or 'markdown' not in data:
        return jsonify({'error': 'No markdown content provided'}), 400
    
    html = markdown.markdown(data['markdown'])
    return jsonify({'html': html})

# Serve static files
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/admin')
def serve_admin():
    return send_from_directory(app.static_folder, 'admin.html')

@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory(os.path.join(app.static_folder, 'css'), filename)

@app.route('/img/<path:filename>')
def serve_img(filename):
    return send_from_directory(os.path.join(app.static_folder, 'img'), filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=9090) 