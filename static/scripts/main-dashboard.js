window.addEventListener("load", login);
//window.addEventListener("load", loadNav);

async function login(){
    const url = `/user/session`
    const response = await fetch(url)
    const result = await response.json()
    console.log(result)
}

async function fetchHtmlAsText(url) {
    return await (await fetch(url)).text();
}


async function loadNav() {
    document.getElementById("nav-bar").innerHTML= await fetchHtmlAsText("nav.html");
}