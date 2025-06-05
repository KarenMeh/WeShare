from flask import Flask, request, jsonify, send_from_directory, url_for, make_response
from flask_cors import CORS
import json
import os
from datetime import datetime
import markdown
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder='public')
CORS(app)

# Configuration
UPLOAD_FOLDER = os.path.join('public', 'uploads')
DATA_FOLDER = os.path.join('public', 'data')
POSTS_FILE = os.path.join(DATA_FOLDER, 'posts.json')

# Ensure absolute paths
UPLOAD_FOLDER = os.path.abspath(UPLOAD_FOLDER)
DATA_FOLDER = os.path.abspath(DATA_FOLDER)

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
    posts = get_posts()
    # Add full URL for images
    for post in posts:
        if post.get('image'):
            post['image_url'] = url_for('serve_upload', filename=post['image'], _external=True)
    response = jsonify(posts)
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response

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
    
    if image and image.filename:
        # Ensure the filename is secure and unique
        timestamp = datetime.now().timestamp()
        original_filename = secure_filename(image.filename)
        filename = f"{timestamp}_{original_filename}"
        image_path = os.path.join(UPLOAD_FOLDER, filename)
        
        # Save the image
        try:
            image.save(image_path)
            image_name = filename
            # Verify the file was saved
            if not os.path.exists(image_path):
                raise Exception("File was not saved successfully")
        except Exception as e:
            print(f"Error saving image: {e}")
            return jsonify({'success': False, 'error': 'Failed to save image'}), 500
    
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
    
    # Add the full URL for the image
    if image_name:
        post['image_url'] = url_for('serve_upload', filename=image_name, _external=True)
    
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

@app.route('/api/posts/<post_id>', methods=['GET'])
def get_post(post_id):
    posts = get_posts()
    for post in posts:
        if post['id'] == post_id:
            # Add full URL for image if present
            if post.get('image'):
                post['image_url'] = url_for('serve_upload', filename=post['image'], _external=True)
            response = jsonify(post)
            response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            response.headers['Pragma'] = 'no-cache'
            response.headers['Expires'] = '0'
            return response
    return jsonify({'error': 'Post not found'}), 404

# Serve static files
@app.route('/')
def serve_index():
    response = send_from_directory(app.static_folder, 'index.html')
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response

@app.route('/admin')
def serve_admin():
    response = send_from_directory(app.static_folder, 'admin.html')
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response

@app.route('/blog')
def serve_blog():
    print(f"Attempting to serve blog.html from {app.static_folder}")
    try:
        response = send_from_directory(app.static_folder, 'blog.html')
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        return response
    except Exception as e:
        print(f"Error serving blog.html: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/faq')
def serve_faq():
    print(f"Attempting to serve faq.html from {app.static_folder}")
    try:
        response = send_from_directory(app.static_folder, 'faq.html')
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        return response
    except Exception as e:
        print(f"Error serving faq.html: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory(os.path.join(app.static_folder, 'css'), filename)

@app.route('/img/<path:filename>')
def serve_img(filename):
    return send_from_directory(os.path.join(app.static_folder, 'img'), filename)

@app.route('/uploads/<path:filename>')
def serve_upload(filename):
    try:
        # Log the requested file and path for debugging
        print(f"Attempting to serve file: {filename}")
        
        # Use send_from_directory with the static folder and relative path
        return send_from_directory(app.static_folder, os.path.join('uploads', filename), as_attachment=False)
    except Exception as e:
        print(f"Error serving file {filename}: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Try different ports if 5050 is in use
    port = 5050
    while port < 5060:
        try:
            app.run(host='0.0.0.0', debug=True, port=port)
            break
        except OSError as e:
            if "Address already in use" in str(e):
                print(f"Port {port} is in use, trying next port...")
                port += 1
            else:
                raise 