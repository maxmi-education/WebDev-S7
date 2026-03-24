    var socket = io();

    userCountField = document.getElementById('userCount');

    var username = prompt('Please enter a username');
    document.getElementById('usernameInput').value = username;
    socket.emit('join', username);

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

    document.getElementById('chatInputDiv').addEventListener('submit', (e) => {
        e.preventDefault();
        socket.emit('send message', {
            message: document.getElementById('messageInput').value,
            name: document.getElementById('usernameInput').value,
            time: Date.now(),
            color: document.getElementById('colorInput').value,
        });
        document.getElementById('messageInput').value = '';
    })

    function textToHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    socket.on('receive message',  (data) => {
        const message = document.createElement('li');
        message.classList.add('chatMessage');
        message.style.backgroundColor = data.color;
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
            <span class='preserve-formatting'>${textToHTML(data.message)}</span> <br>
            <span class='preserve-formatting'>${textToHTML(data.name)}</span> <br>
            ${date.toLocaleDateString("de-DE", options)}
        `;
        document.getElementById('chatBox').appendChild(message);
        message.scrollIntoView();
    })

    document.getElementById('messageInput').addEventListener('input', () => {
        if (!document.getElementById('messageInput').value == '') {
            socket.emit('typing')
        }
        else {
            socket.emit('stopped typing')
        }
    })

    let typers = [];
    socket.on('user typing', (user) => {
        if (!typers.includes(user.name)) {
            typers.push(user.name);
        }
        updateTypingInterface()
    })

    socket.on('user stopped typing', (user) => {
        typers.pop(user.name)
        updateTypingInterface()
    })

    const typingElement = document.getElementById('typingIndicator')
    function updateTypingInterface() {
        if (typers.length == 0) {
            typingElement.innerText = '';
        }
        else if (typers.length == 1) {
            typingElement.innerText = typers[0] + ' is typing...'
        }
        else {
            let typingUsers = typers.join(', ')
            typingElement.innerText = typers + " are typing..."
        }
    }