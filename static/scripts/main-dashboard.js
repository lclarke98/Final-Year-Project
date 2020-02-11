window.addEventListener("load", login);

async function login(){
    const url = `/user/session`
    const response = await fetch(url)
    const result = await response.json()
    console.log(result)
}