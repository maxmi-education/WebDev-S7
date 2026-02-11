// Load and display comments for a specific page
function loadComments(pageName) {
    fetch(`/api/get_comments?page=${pageName}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                list = document.getElementById('comment-container');
                list.innerHTML = '';
                data.comments.forEach(comment => {
                    displayComment(list, comment);
                });
            }
        })
        .catch(error => {
            console.error('Error loading comments:', error);
        });
}

function displayComment(container, comment) {
    let element = document.createElement('div');
    element.innerHTML = `
        <li class='comment'>
            ${escapeHtml(comment.message)}
        </li>
    `;
    container.append(element);
}



// Initialize comment system when page loads
document.addEventListener('DOMContentLoaded', () => {
    const pageName = 'home';
    if (pageName) {
        loadComments(pageName);
        //initCommentForm(pageName);
    }
});

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}