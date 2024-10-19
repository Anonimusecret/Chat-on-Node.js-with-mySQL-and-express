
loginForm.onsubmit = async (form) => {
    form.preventDefault();
    let formData = new FormData(document.getElementById("loginForm"))

    let data = Object.fromEntries(formData)

    response = await fetch("/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    let result = await response.json();

    if (result.autorized){
        location.href="./main.html"
    } else {
        alert('неверный логин или пароль')
    }

};

async function start(){
    response = fetch('/', {
    method: "POST"
})

let result = await response.json();

if(result){
    location.href="./main.html"
} else {
    location.href="./login.html"
}
}

