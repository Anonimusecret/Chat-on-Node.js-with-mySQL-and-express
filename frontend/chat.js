const sendMessageButton = document.getElementById('sendMessageButton')
sendMessageButton.addEventListener('click', () => sendMessage(document.getElementById('messageText').value), false);

const inviteButton = document.getElementById('inviteButton')
inviteButton.addEventListener('click', () => invite(), false);

 //= document.getElementById('sendMessageButton'); str.
let currentLocation = window.location;
let chatid = currentLocation.pathname.slice(6);

console.log(currentLocation.pathname)
console.log(chatid)

const chatContainer = document.getElementById('chatContainer');

let msgdiv;
let p;
let userMessages;
let lastuid = -1;

let position;
let user;

//getUser();



printMessages();

async function getUser() {
    response = await fetch('/users/this', {
        method: "GET",
    });

    user = await response.json();
    console.log(user)
}



async function getMessages() {
    data = {chatid: chatid}

    response = await fetch(currentLocation.pathname, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    let result = await response.json();
    console.log(result)

    return result;
    
}

async function printMessages(){

    response = await fetch(`/chat_members/${chatid}`, {
        method: "GET",
    });

    let chatMembersResuslt = await response.json();
    let chatMembers = {};

    for(obj of chatMembersResuslt){
        chatMembers[obj.uid] = obj.login
    }
    console.log('chatMembers = ' + chatMembers[7])

    response = await fetch('/users/this', {
        method: "GET",
    });

    user = await response.json();
    console.log(user)

    let data = {chatid: chatid}

    response = await fetch(currentLocation.pathname, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    let messages = await response.json();
    console.log(messages)

    if(messages.length == 0){
        let divider = document.createElement('div') 
        divider.className = 'divider d-flex align-items-center mb-4'

        p = document.createElement('p')  
        p.textContent = 'В чате пока нет сообщений'
        p.className = 'text-center mx-3 mb-0'
        p.style = 'color: #a2aab7;'
        divider.appendChild(p)
        chatContainer.appendChild(divider)

    }else{

        let divider = document.createElement('div') 
        divider.className = 'divider d-flex align-items-center mb-4'

        p = document.createElement('p')  
        p.textContent = 'Начало чата'
        p.className = 'text-center mx-3 mb-0'
        p.style = 'color: #a2aab7;'
        divider.appendChild(p)
        chatContainer.appendChild(divider)
        
        for(let i = 0 ; i < messages.length ; i++){
        //for(mess of messages){
            
            if(messages[i].uid != lastuid){
                messageTemplate(chatMembers[messages[i].uid])
            }
            addMessage(messages[i].message)
            console.log(messages[i].message)
            lastuid = messages[i].uid;
        }

    }

}



function messageTemplate(username){

    //if(author == user.uid){
    //    position = 'start'
    //}else{
    //    position = 'end'
    //}
    
    let avatar = 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp'

    userMessages = document.createElement('div') 
    userMessages.className = `d-flex flex-row justify-content-start mb-4`

    //let img = document.createElement('img')
    //img.src = avatar
    //img.style = "width: 45px; height: 100%;"
    //img.alt = 'avatar'
    //userMessages.appendChild(img)

    msgdiv = document.createElement('div')

    let nickname = document.createElement('p')
    nickname.className = 'h5'
    nickname.textContent = username //messages.time
    msgdiv.appendChild(nickname)
    console.log(username)

    //addMessage here

    //let time = document.createElement('p')
    //time.className = 'small ms-3 mb-3 rounded-3 text-muted'
    //time.textContent = '00:00' //messages.time
    //msgdiv.appendChild(time)

    

    userMessages.appendChild(msgdiv)
    chatContainer.appendChild(userMessages)

}

function addMessage(message){

    p = document.createElement('p')
    p.textContent = message;
    p.className = "small p-2 ms-3 mb-1 rounded-3 bg-body-tertiary"
    msgdiv.appendChild(p)

}


async function sendMessage(input){
    
    data = {message: input}

    response = await fetch(currentLocation.pathname, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    let result = await response.json();
    console.log(result)

    input = '';
}

async function invite(){

    let input = prompt('Введите uid');

    data = {user: input}

    response = await fetch(`/invite/${chatid}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    let result = await response.json();
    console.log(result)

}
