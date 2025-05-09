
const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messagesDiv = document.getElementById('messages');

const sender = Math.random() > 0.5 ? 'user1' : 'user2';

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', { text: input.value, sender });
        input.value = '';
    }
});

socket.on('load messages', function(msgs) {
    messagesDiv.innerHTML = '';
    msgs.forEach(displayMessage);
});

socket.on('chat message', function(msg) {
    displayMessage(msg);
});

socket.on('delete message', function(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
});

function displayMessage(msg) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    msgDiv.classList.add(msg.sender === 'user1' ? 'left' : 'right');
    msgDiv.id = msg._id;

    const avatar = document.createElement('img');
    avatar.src = msg.sender === 'user1' ? 'https://i.imgur.com/WxNUJrj.png' : 'https://i.imgur.com/7k12EPD.png';
    avatar.classList.add('avatar');

    const span = document.createElement('span');
    span.textContent = msg.text;

    const del = document.createElement('button');
    del.classList.add('delete-btn');
    del.textContent = '🗑️';
    del.onclick = () => socket.emit('delete message', msg._id);

    msgDiv.appendChild(avatar);
    msgDiv.appendChild(span);
    msgDiv.appendChild(del);

    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
