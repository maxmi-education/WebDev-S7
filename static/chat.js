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

    popovers = [];

    socket.on('receive message',  (data) => {
        const message = document.createElement('li');
        message.classList.add('chatMessage');
        //message.dataset.messageId =
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
            <div class="row justify-content-between">
                <div class="col align-self-start">
                    ${date.toLocaleDateString("de-DE", options)}
                </div>
                <div class="col-2 align-self-end text-end reaction-box" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="bottom" data-bs-html="true" data-bs-content="&lt;h1&gt;This is the body text for a popover.&lt;/h1&gt;">
                    &#128514;
                </div>
            </div>
        `;
        document.getElementById('chatBox').appendChild(message);
        message.scrollIntoView();
        popovers.push(new bootstrap.Popover(message.querySelector('[data-bs-toggle="popover"]')))
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