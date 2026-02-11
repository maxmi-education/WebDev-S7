document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('repeat_password')?.addEventListener('input', () => {
        let first_password = document.getElementById('password').value;
        let repeat_password = document.getElementById('repeat_password').value;
        let feedback_area = document.getElementById('password_check');
        if (first_password != repeat_password) {
            feedback_area.innerText = 'Passwords do not match!';
        }
        else {
            feedback_area.innerText = '';
        }
    });

    document.getElementById('form_register')?.addEventListener('submit', (event) => {
        event.preventDefault(); // this prevents the standard action that is taken when certain things happen. 
                                // Forms automatically send stuff to the server when submitted, and redirect to a new page.
                                // We don't want that.

        let form = document.getElementById('form_register');
        let formData = new FormData(form);                   // find the form, and transform the data inside of it.

        fetch('/api/register_user', {
            method: 'POST',
            body: formData,
        }) 
        .then(response => response.json())
        .then(data => {
            if (data.status == 'success') {
                document.getElementById('signup_error_message').innerText = '';
                document.getElementById('signup_success_message').innerText = data.message;
            }
            else {
                document.getElementById('signup_error_message').innerText = data.message;
                document.getElementById('signup_success_message').innerText = '';
            }
        })
        .catch(error => {
            console.error(error);
        })
    });

    document.getElementById('form_login')?.addEventListener('submit', (event) => {
        event.preventDefault(); // this prevents the standard action that is taken when certain things happen. 
                                // Forms automatically send stuff to the server when submitted, and redirect to a new page.
                                // We don't want that.

        let form = document.getElementById('form_login');
        let formData = new FormData(form);                   // find the form, and transform the data inside of it.

        fetch('/api/login_user', {
            method: 'POST',
            body: formData,
        }) 
        .then(response => response.json())
        .then(data => {
            if (data.status == 'success') {
                document.getElementById('login_error_message').innerText = '';
                document.getElementById('login_success_message').innerText = data.message;
                location.reload();
            }
            else {
                document.getElementById('login_error_message').innerText = data.message;
                document.getElementById('login_success_message').innerText = '';
            }
        })
        .catch(error => {
            console.error(error);
        })
    });
});