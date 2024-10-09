//const chatList = document.getElementById("chatlist");
//  testButton.addEventListener('click', () => startMain(document.getElementById(user.session)), false);

let chatList = document.getElementById("firsList1");

let chatInfo = getChats();
console.log('Ответ от сервера' + chatInfo)



let id = 0;
let chat;
let chatname = 'example ' + id

for(info of chatinfo){
    id = info.chatid;
    //chatname = info.name
    chat = createChatTemplate(id)

    chatList.appendChild(chat)
}

chat.className = 'list-group-item list-group-item-action d-flex gap-3 py-3'
chat.ariaCurrent = 'true'
chatButton.id = `chatButton${id}`

chatList.appendChild(chat)

chat.addEventListener('click', () => chatRedirect(), false);

async function getChats() { //чет тут не так, оно возвращает промис
    let result;

    let response = await fetch('/chatsMain', {
        method: 'GET'
    })
    result = response.json();
    console.log(result)
    
    return result;
    
}

function createChatTemplate(id){
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
    h.textContent = 'Chat name'


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

function chatRedirect(){
    location.href="./chat.html"
    alert(`Кнопка ${id} работает`)
}
