document.addEventListener('DOMContentLoaded', () => {
    const blogForm = document.getElementById('blogForm');
    const postsContainer = document.getElementById('postsContainer');

    // Fetch and display posts on page load
    fetchPosts();

    blogForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;

        // Post the new blog entry to the backend
        fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchPosts();
                blogForm.reset();
            } else {
                alert('Error creating post');
            }
        });
    });

    function fetchPosts() {
        fetch('/api/posts')
            .then(response => response.json())
            .then(posts => {
                postsContainer.innerHTML = '';
                posts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.classList.add('post');
                    postElement.innerHTML = `
                        <h2>${post.title}</h2>
                        <p>${post.content}</p>
                        <button onclick="deletePost(${post.id})">Delete</button>
                        <button onclick="editPost(${post.id})">Edit</button>
                    `;
                    postsContainer.appendChild(postElement);
                });
            });
    }
});

function deletePost(id) {
    fetch(`/api/posts/${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchPosts();
            } else {
                alert('Error deleting post');
            }
        });
}

function editPost(id) {
    const title = prompt('Enter new title');
    const content = prompt('Enter new content');

    if (title && content) {
        fetch(`/api/posts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchPosts();
            } else {
                alert('Error updating post');
            }
        });
    }
}
