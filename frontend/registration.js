loginForm.onsubmit = async (form) => {
    form.preventDefault();
    let formData = new FormData(document.getElementById("loginForm"))

    let data = Object.fromEntries(formData)
    
    if(data.login.length > 12 || data.login.length < 4){
        alert('Логин должен быть от 4 до 12 символов')
    } else if (data.password.length < 5){
        alert('Пароль ненадежен')
    }else if(data.password != data.passwordConfirmation){
        alert('Пароли не совпадают')
    } else {
        let response = await fetch("/reg", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        let result = await response.json();

        if(result.status == 'reg'){
            location.href="./login.html"
        } else if (result.status == 'pas'){
            alert('пароли не совпадают')
        } else if (result.status == 'deny'){
            alert('Никнейм занят')
        }
        console.log(result.status)
        }
};