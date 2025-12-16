document.getElementById('submitButton').addEventListener('click', async (event) => {
    event.preventDefault();

    const payload = {
        first_name: document.getElementById('first_name').value.trim(),
        last_name: document.getElementById('last_name').value.trim(),
        email: document.getElementById('email').value.trim(),
    }

    fetch('/api/insert_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
        .then(Result => Result.json())
        .then(console.log("success"))
        .catch(errorMSG => console.error("error " + errorMSG));
});