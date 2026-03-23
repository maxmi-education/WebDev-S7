var socket = io();

    userCountField = document.getElementById('userCount');

    socket.on('user joined', (data) => {
        const message = document.createElement('li');
        message.textContent = data.name + ' joined the chat';
        message.classList.add('userJoined');
        document.getElementById('chatBox').appendChild(message);
        userCountField.innerText = data.userCount;
    })

    socket.on('user left', (data) => {
        const message = document.createElement('li');
        message.textContent = data.name + ' left the chat';
        message.classList.add('userLeft');
        document.getElementById('chatBox').appendChild(message);
        userCountField.innerText = data.userCount;
    })

    document.getElementById('sendBtn').addEventListener('click', () => {
        socket.emit('send message', {
            message: document.getElementById('messageInput').value,
            name: document.getElementById('usernameInput').value,
            time: Date.now(),
        });
    })

    socket.on('receive message',  (data) => {
        const message = document.createElement('li');
        message.classList.add('chatMessage');
        date = new Date(data.time);
        options = {
            day:'numeric',
            month:'numeric',
            year:'numeric',
            hour:'numeric',
            minute: 'numeric',
            second:'numeric',
        }
        message.innerHTML = `
            ${data.message} <br>
            ${data.name} <br>
            ${date.toLocaleDateString("de-DE", options)}
        `;
        document.getElementById('chatBox').appendChild(message);
        message.scrollIntoView();
    })