const chatBox = document.querySelector('.chat-box');
let userMessages = [];
let assistantMessages = [];
let myMode = '';
let myAlcohol ='';

function spinner() {
    document.getElementById('loader').style.display = "block";
}

function start() {
    const mood = document.getElementById('mood').value;
    const alcohol = document.getElementById('alcohol').value;
    if (mood === '') {
        alert('오늘 기분을 알려줘!!');
        return;
    }else if(alcohol === ''){
        alert('오늘 먹을 술도 알려줘!!')
    }
    myMode = mood;
    myAlcohol = alcohol;

    document.getElementById("intro").style.display = "none";
    document.getElementById("chat").style.display = "block";
}

const sendMessage = async () => {
    const chatInput = document.querySelector('.chat-input input');
    const chatMessage = document.createElement('div');
    chatMessage.classList.add('chat-message');
    chatMessage.innerHTML = `<p>${chatInput.value}</p>`;
    chatBox.appendChild(chatMessage);
    
    //userMessage 메세지 추가
    userMessages.push(chatInput.value);

    chatInput.value = '';

    const response = await fetch('http://localhost:3000/fortuneTell', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            myMode:myMode,
            myAlcohol:myAlcohol,
            userMessages: userMessages,
            assistantMessages: assistantMessages,
        })
    });

    const data = await response.json();
    document.getElementById('loader').style.display = "none";
    
    //assistantMessage 메세지 추가
    assistantMessages.push(data.assistant);

    const astrologerMessage = document.createElement('div');
    astrologerMessage.classList.add('chat-message');
    astrologerMessage.innerHTML = `<p class='assistant'>${data.assistant}</p>`;
    chatBox.appendChild(astrologerMessage);
};

document.querySelector('.chat-input button').addEventListener('click', sendMessage);