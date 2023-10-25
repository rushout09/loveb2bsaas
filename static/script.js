const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
sendButton.addEventListener('click', sendMessage);

// Event listener for the "Enter" key
messageInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

window.addEventListener('beforeunload', function (event) {
    // Perform actions before the page is reloaded
    // You can show a confirmation dialog or save data here

    // The following line clears session storage.
    sessionStorage.clear();
});

function appendMessage(message, sender) {
    const messageDiv = document.createElement('div');
    var formattedMessage = message.replace(/\n/g, '<br>'); // Replace newline characters with HTML line breaks

    var paragraph = document.createElement('p');
    paragraph.innerHTML = `<b>Bot:</b> ${formattedMessage}<br><br>`;


    if (sender === 'User')
        paragraph.innerHTML = `<b>User:</b> ${formattedMessage}<br><br>`;

    messageDiv.appendChild(paragraph);

    // Check the sender and add appropriate class for styling
    if (sender === 'User') {
        messageDiv.classList.add('message', 'user-message');
    } else if (sender === 'Bot') {
        messageDiv.classList.add('message', 'bot-message');
    }

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function sendMessage() {
    const userMessage = messageInput.value.trim();
    if (userMessage === '') return;

    appendMessage(userMessage, 'User');
    messageInput.value = '';

    // Check if the UUID is already stored in localStorage
    let uniqueId = sessionStorage.getItem('uniqueId');

    // If the UUID is not in localStorage, generate a new one and store it
    if (!uniqueId) {
        uniqueId = Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('uniqueId', uniqueId);
    }

    console.log('Unique ID:', uniqueId);

    const messageObject = {
    uuid: uniqueId,
    message: userMessage
    };

    // Send user message to the server
    fetch('/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageObject)
    })
    .then(response => response.json())
    .then(data => {
        const botMessage = data.bot;
        appendMessage(botMessage, 'Bot');
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

appendMessage("Hi, I can help you find a room in HSR Layout, Bangalore. Let me know your details to find a lead!", "Bot")