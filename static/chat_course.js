var socket = io();



document.getElementById('sendMessageForm').addEventListener('submit', (event) => {
    event.preventDefault();
    data = {
        time: Date.now(),
        message: document.getElementById('messageInput').value,
    };
    socket.emit('send message course', data);
    document.getElementById('messageInput').value = '';
});

socket.on('receive message course', (data) => {
    const message = document.createElement('div');
    message.innerHTML = `
        ${data.message} <br>
        ${data.name}
    `;
    document.getElementById('chatBox').appendChild(message);
});