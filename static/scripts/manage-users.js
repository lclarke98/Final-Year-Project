window.addEventListener('load', getUsers)

let data

async function getUsers(){
    const url = `/api/userList`
    const response = await fetch(url)
    data = await response.json()
    displayUserList(data)
}

async function displayUserList(list){
    clearList()
    const userList = document.getElementById("user-list")
    for(let i = 0; i < list.length; i++) {
        let item = document.createElement('li')
        item.textContent =  list[i].user_name
        item.id = i
        item.addEventListener("click", openUserWindow)
        userList.appendChild(item)
    }
}

let userIndex

function openUserWindow(){
    userIndex = this.id
    let userName = data[this.id].user_name
    document.getElementById("close").addEventListener("click", closeWindow)
    document.getElementById("delete-user").addEventListener("click", function(){
        deleteUser(userIndex)
    }, false);
    document.getElementById("menu").style.display = "block";
    document.getElementById("user-name").textContent = data[this.id].user_name
}

function closeWindow(){
    document.getElementById("menu").style.display = "none"
    userIndex = ""
}

function clearList(){
    document.getElementById("user-list").textContent  = ""
}