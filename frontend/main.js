//const chatList = document.getElementById("chatlist");
//  testButton.addEventListener('click', () => startMain(document.getElementById(user.session)), false);

let chatList = document.getElementById("firsList1");
let id = 0;
let chat;
let chatname;
let message;

printChats()



async function getChats() {
    let result;

    let response = await fetch('/chatsMain', {
        method: 'GET'
    })
    result = await response.json();
    return await result;
    
}

async function createNewChat(chatname) {
    
    let data = {name: chatname};
    let result;


    let response = await fetch('/createChat', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    result = await response.json();

    chatRedirect(result.chatid)



}


async function printChats() {

    let chatInfo = await getChats();

    if(chatInfo.length == 0){
        message = 'Вы не состоите ни в одном чате. Нажмите, чтобы создать чат'
        chat = createChatTemplate(0, message)

        chat.addEventListener('click', () => createNewChat(prompt('Введите название чата')), false);

        chatList.appendChild(chat)

    }else{
        let chatIDs = [];
        let i = 0;

        for(info of chatInfo){

            id = info.chatid;
            chatname = info.name
            chat = createChatTemplate(id, chatname)

            

            chatIDs[i] = id
            i++;

            chatList.appendChild(chat)

        }

        for(let i=0 ; i < chatIDs.length; i++){

            chat = document.getElementById(`chatButton${chatIDs[i]}`)

            chat.addEventListener('click', () => chatRedirect(chatIDs[i]), false);

        }

        message = 'Нажмите, чтобы создать чат'
        chat = createChatTemplate(0, message)

        chat.addEventListener('click', () => createNewChat(prompt('Введите название чата')), false);

        chatList.appendChild(chat)

    }
    

}

function createChatTemplate(id, chatName){
    let chatTemplate = document.createElement('a')
    chatTemplate.className = "list-group-item list-group-item-action d-flex gap-3 py-3"
    chatTemplate.ariaCurrent = 'true'
    chatTemplate.id = `chatButton${id}`
    
    let img = document.createElement('img')
    img.src = 'https://community.adobe.com/legacyfs/online/1591122_thin-0306_chat_message_discussion_bubble_conversation-512.png'
    img.alt = 'twbs'
    img.width = '32'
    img.height = "32"
    img.className = "rounded-circle flex-shrink-0"
    chatTemplate.appendChild(img)

    let div = document.createElement('div')
    div.className="d-flex gap-2 w-100 justify-content-between"

    let div2 = document.createElement('div')


    let h = document.createElement('h6')
    h.className = "mb-0"
    h.textContent = `${chatName}`


    //let p = document.createElement('p')
    //p.className="mb-0 opacity-75"
    //p.textContent = 'Chat description'

    
    div2.appendChild(h)
    //div2.appendChild(p)
    div.appendChild(div2)

    //let small = document.createElement('small')
    //small.className="opacity-50 text-nowrap"
    //small.textContent = 'time'

    //div.appendChild(small)

    chatTemplate.appendChild(div)

    return chatTemplate;
}



async function chatRedirect(chatroomid){
    data = {chatid: chatroomid}
    
    response = await fetch(`/chat/${chatroomid}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    let result = await response.json();
    console.log(result)

    location.href=`./chat/${chatroomid}`
    //alert(`Кнопка ${id} работает`)
}
