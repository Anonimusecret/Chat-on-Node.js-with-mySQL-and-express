loginForm.onsubmit = async (form) => {
    form.preventDefault();
    let formData = new FormData(document.getElementById("loginForm"))

    let data = Object.fromEntries(formData)

    let response = await fetch("/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    //let result = await response.json();
    //console.log(result);
};