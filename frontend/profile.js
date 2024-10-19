const logoutButton = document.getElementById('logoutButton')
logoutButton.addEventListener('click', () => logout())

const apiButton = document.getElementById('apiButton')
apiButton.addEventListener('click', () => api())

async function logout(){

    location.href = '/logout'

}

async function api() {


    response = await fetch('/users/all', {
        method: "GET",
    });
    let result = await response.json();
    console.log(result)
    downloadObjectAsJson(result, 'Зарегистрированные пользователи чата')

}

function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }