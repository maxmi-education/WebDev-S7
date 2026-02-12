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

document.getElementById('commentForm')?.addEventListener('submit', (event) => {
        event.preventDefault(); // this prevents the standard action that is taken when certain things happen. 
                                // Forms automatically send stuff to the server when submitted, and redirect to a new page.
                                // We don't want that.

        let form = document.getElementById('commentForm');
        let formData = new FormData(form);                   // find the form, and transform the data inside of it.
        formData.append('page', 'home');

        fetch('/api/add_comment', {
            method: 'POST',
            body: formData,
        }) 
        .then(response => response.json())
        .then(data => {
            if (data.status == 'success') {
                showToast(data.message);
                const pageName = 'home';
                if (pageName) {
                    loadComments(pageName);
                }
            }
            else {
              console.error(data.message);
            }
        })
        .catch(error => {
            console.error(error);
        })
    });



// Initialize comment system when page loads
document.addEventListener('DOMContentLoaded', () => {
    const pageName = 'home';
    if (pageName) {
        loadComments(pageName);
    }
});

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}

function showToast(message) {
    // Get the toast element
    const toastElement = document.getElementById('myToast');

    // Update the message
    const toastBody = toastElement.querySelector('.toast-body');
    toastBody.textContent = message;

    // Create and show the toast
    const toast = new bootstrap.Toast(toastElement, {
        animation: true,    // Enable fade animation
        autohide: true,     // Auto-hide the toast
        delay: 5000         // Hide after 5000ms (5 seconds)
    });
    toast.show();
}