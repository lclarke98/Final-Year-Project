window.addEventListener("load", pageLoad);
  
function pageLoad(){
    document.getElementById("login-button").addEventListener('click', login)
}


async function login(){
    const username = document.getElementById("username")
    const password = document.getElementById("password")
    const data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          info: {
            username: username,
            password: password,
          }
        })
      }
    const response = await fetch('/api/newDrive', data)
    const response = await fetch(url)
    const result = await response
    location.replace(result.url);
}