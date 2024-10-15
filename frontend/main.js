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
    console.log(result)
    console.log('xx2 = ' + result.length)
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
        message = 'Вы не состоите не в одном чате. Нажмите, чтобы создать чат'
        chat = createChatTemplate(0, message)

        chat.addEventListener('click', () => createNewChat('testchat2'), false);

        chatList.appendChild(chat)

    }else{
        let chatIDs = [];
        let i = 0;

        for(info of chatInfo){
            id = info.chatid;
            chatname = 'example ' + id;
            //chatname = info.name
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

        chat.addEventListener('click', () => createNewChat('testchat2'), false);

        chatList.appendChild(chat)

    }
    

}

function createChatTemplate(id, chatName){
    let chatTemplate = document.createElement('a')
    chatTemplate.className = "list-group-item list-group-item-action d-flex gap-3 py-3"
    chatTemplate.ariaCurrent = 'true'
    chatTemplate.id = `chatButton${id}`
    
    let img = document.createElement('img')
    img.src = 'https://github.com/twbs.png'
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


    let p = document.createElement('p')
    p.className="mb-0 opacity-75"
    p.textContent = 'Chat description'

    
    div2.appendChild(h)
    div2.appendChild(p)
    div.appendChild(div2)

    let small = document.createElement('small')
    small.className="opacity-50 text-nowrap"
    small.textContent = 'time'

    div.appendChild(small)

    chatTemplate.appendChild(div)

    return chatTemplate;
}


//<img src="https://github.com/twbs.png" alt="twbs" width="32" height="32" class="rounded-circle flex-shrink-0">
//<div class="d-flex gap-2 w-100 justify-content-between">
//<div>
//  <h6 class="mb-0">Test Chat 1</h6>
//  <p class="mb-0 opacity-75">Описпние чата</p>
//</div>
//<small class="opacity-50 text-nowrap">now</small>
//</div>

async function chatRedirect(chatroomid){
    data = {chatid: chatroomid}

    alert(chatroomid);
    
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
