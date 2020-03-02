window.addEventListener("load", pageLoad)

function pageLoad(){
    document.getElementById("logout-button").addEventListener("click", logout)
}

async function logout(){
    console.log("logout")
    const url = `/user/logout`
    const response = await fetch(url)
    const result = await response
    location.replace(result.url)
}

