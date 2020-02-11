window.addEventListener("load", pageLoad);
  
function pageLoad(){
    document.getElementById("login-button").addEventListener('click', login)
}


async function login(){
    const url = `/user/login`
    const response = await fetch(url)
    const result = await response
    console.log(result.url)
    location.replace(result.url);
}