window.addEventListener("load", pageLoad);
  
function pageLoad(){
    document.getElementById("login-button").addEventListener('click', login)
}

// login to system
async function login(){
  const username = document.getElementById("username-input").value
  const password = document.getElementById("password-input").value
  const url = `/user/login?username=${username}&password=${password}`;
  const response = await fetch(url);
  const result = await response
  location.replace(result.url)
}