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

// if i feel this is too complicated, how else can i approach this entire year??
document.getElementById('showAllUsers').addEventListener('click', async (event) => {
    fetch('/api/get_all_users')
        .then(result => result.json())
        .then(result => {
            let table = document.getElementById("bodyRows")
            table.innerHTML = '';    // let's clear the table first
            result.forEach(user => {
                let newRow = document.createElement("tr");
                newRow.innerHTML = `
                    <td>${user.id}</td> 
                    <td>${user.first_name}</td> 
                    <td>${user.last_name}</td> 
                    <td>${user.email}</td> 
                `;
                table.append(newRow);
            });
        })
        .catch(err => console.error(err));
})