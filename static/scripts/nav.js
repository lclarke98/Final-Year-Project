window.addEventListener("load", pageLoad)

function pageLoad(){
    document.getElementById("logout-button").addEventListener("click", logout)
}

function logout(){
    console.log("logout")
}