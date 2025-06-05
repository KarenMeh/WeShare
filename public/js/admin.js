let allPosts = [];
let isEditMode = false;

// Load posts when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
});

async function loadPosts() {
    try {
        const response = await fetch('/api/posts', {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        allPosts = await response.json();
        updatePostsDisplay(allPosts);
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

function scrollToForm() {
    document.querySelector('.admin-form').scrollIntoView({ behavior: 'smooth' });
}

function updatePostsDisplay(posts) {
    const container = document.getElementById('posts-container');
    container.innerHTML = posts.map(post => `
        <div class="post-item" data-post-id="${post.id}">
            <div class="post-header">
                <h3 class="post-title">${post.title}</h3>
                <div class="post-actions">
                    <button class="btn btn-success" onclick="editPost('${post.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                        </svg>
                        Edit
                    </button>
                    <button class="btn btn-danger" onclick="deletePost('${post.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                        Delete
                    </button>
                </div>
            </div>
            <div class="post-meta">
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    ${post.category}
                </span>
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                        <line x1="16" x2="16" y1="2" y2="6"></line>
                        <line x1="8" x2="8" y1="2" y2="6"></line>
                        <line x1="3" x2="21" y1="10" y2="10"></line>
                    </svg>
                    ${post.date}
                </span>
            </div>
            ${post.image ? `
                <div class="post-image-container">
                    <img src="${post.image_url || `/uploads/${post.image}`}" 
                         alt="${post.title}" 
                         class="post-image"
                         onerror="this.onerror=null; this.src='/img/placeholder-image.svg'; this.alt='Image not found'">
                </div>
            ` : ''}
            <p>${post.description.substring(0, 150)}...</p>
        </div>
    `).join('');
}

function updateFormMode(editing = false, post = null) {
    isEditMode = editing;
    const formTitle = document.getElementById('form-title-text');
    const formDescription = document.getElementById('form-description');
    const submitButton = document.querySelector('button[type="submit"]');
    const resetButton = document.querySelector('button[type="button"]');
    
    if (editing && post) {
        formTitle.textContent = 'Edit Post';
        formDescription.textContent = 'Update the details of your blog post below. All fields marked with * are required.';
        submitButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Update Post
        `;
        resetButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
            </svg>
            Cancel Edit
        `;
        document.getElementById('post-form').scrollIntoView({ behavior: 'smooth' });
    } else {
        formTitle.textContent = 'Create New Post';
        formDescription.textContent = 'Fill in the details below to create a new blog post. All fields marked with * are required.';
        submitButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 5v14"></path>
                <path d="M5 12h14"></path>
            </svg>
            Create Post
        `;
        resetButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
            </svg>
            Reset Form
        `;
    }
}

async function editPost(id) {
    try {
        const post = allPosts.find(p => p.id === id);
        if (post) {
            // Fill form with post data
            document.getElementById('post_id').value = post.id;
            document.getElementById('title').value = post.title;
            document.getElementById('category').value = post.category;
            document.getElementById('description').value = post.description;
            
            // Handle image preview if exists
            if (post.image) {
                const preview = document.getElementById('image-preview');
                const previewImg = preview.querySelector('img');
                const hasImageInput = document.getElementById('has_image');
                const uploadContainer = document.getElementById('image-upload-container');
                
                previewImg.src = post.image_url || `/uploads/${post.image}`;
                preview.style.display = 'block';
                hasImageInput.value = '1';
                uploadContainer.style.borderColor = 'var(--primary-color)';
                uploadContainer.style.backgroundColor = 'var(--bg-light)';
            }
            
            // Update form mode
            updateFormMode(true, post);
            
            // Highlight the post being edited
            document.querySelectorAll('.post-item').forEach(item => {
                item.classList.remove('editing');
                if (item.dataset.postId === id) {
                    item.classList.add('editing');
                }
            });
        }
    } catch (error) {
        console.error('Error loading post for edit:', error);
        alert('Failed to load post for editing. Please try again.');
    }
}

async function deletePost(id) {
    if (confirm('Are you sure you want to delete this post?')) {
        try {
            const formData = new FormData();
            formData.append('id', id);
            
            const response = await fetch('/api/posts', {
                method: 'DELETE',
                body: formData
            });
            
            if (response.ok) {
                loadPosts();
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    }
}

function triggerFileInput() {
    document.getElementById('image').click();
}

function handleImageUpload(input) {
    const preview = document.getElementById('image-preview');
    const previewImg = preview.querySelector('img');
    const hasImageInput = document.getElementById('has_image');
    const uploadContainer = document.getElementById('image-upload-container');
    
    if (input.files && input.files[0]) {
        const file = input.files[0];
        
        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            alert('File size must be less than 2MB');
            input.value = '';
            return;
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (PNG, JPG, or GIF)');
            input.value = '';
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            preview.style.display = 'block';
            hasImageInput.value = '1';
            uploadContainer.style.borderColor = 'var(--primary-color)';
            uploadContainer.style.backgroundColor = 'var(--bg-light)';
        }
        
        reader.onerror = function() {
            previewImg.src = '/img/placeholder-image.svg';
            preview.style.display = 'block';
            hasImageInput.value = '0';
        }
        
        reader.readAsDataURL(file);
    }
}

function resetForm() {
    if (isEditMode) {
        // If in edit mode, just cancel the edit
        updateFormMode(false);
    }
    
    // Reset form fields
    document.getElementById('post-form').reset();
    document.getElementById('post_id').value = '';
    document.getElementById('has_image').value = '0';
    
    // Reset image preview
    const imagePreview = document.getElementById('image-preview');
    const uploadContainer = document.getElementById('image-upload-container');
    imagePreview.style.display = 'none';
    uploadContainer.style.borderColor = 'var(--border-color)';
    uploadContainer.style.backgroundColor = 'transparent';
    
    // Remove editing highlight
    document.querySelectorAll('.post-item').forEach(item => {
        item.classList.remove('editing');
    });
}

// Preview markdown
document.addEventListener('DOMContentLoaded', () => {
    const descriptionInput = document.getElementById('description');
    if (descriptionInput) {
        descriptionInput.addEventListener('input', async function(e) {
            try {
                const response = await fetch('/api/markdown', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        markdown: e.target.value
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    document.getElementById('markdown-preview').innerHTML = data.html;
                }
            } catch (error) {
                console.error('Error converting markdown:', error);
            }
        });
    }
});

function togglePreview() {
    const preview = document.getElementById('markdown-preview');
    preview.classList.toggle('active');
} 