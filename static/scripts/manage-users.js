window.addEventListener('load', getUsers)
window.addEventListener('load', pageLoad)
let data

function pageLoad(){
    document.getElementById("open-add-user").addEventListener("click", openAddUserWindow)
}

function openAddUserWindow(){
    getDriveList()
    document.getElementById("add-user-menu").style.display = "block";
    document.getElementById("close-add-window").addEventListener("click", closeAddUserWindow)
}

function closeAddUserWindow(){
    document.getElementById("add-user-menu").style.display = "none";
}

async function getUsers(){
    const url = `/api/userList`
    const response = await fetch(url)
    data = await response.json()
    displayUserList(data)
}

let driveList

async function getDriveList(){
    const url = "/api/driveList"
    const response = await fetch(url)
    driveList = await response.json()
    const permissionList = document.getElementById("permission-list")
    for (let i = 0; i < driveList.length; i++) {
        const elem = document.createElement("li")
        const read = document.createElement("input")
        read.id=driveList[i].addedDrive_name+"-read"
        read.type = "checkbox"
        const write = document.createElement("input")
        write.id = driveList[i].addedDrive_name+"-write"
        write.type = "checkbox"
        elem.append
        elem.textContent = driveList[i].addedDrive_name
        elem.id = driveList[i].addedDrive_name;
        permissionList.appendChild(elem)
        permissionList.appendChild(read)
        permissionList.appendChild(write)
    }
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

async function deleteUser(index){
    const userName = data[index].user_name
    const userData = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          info: {
            userName: userName,
          }
        })
      }
    const response = await fetch('/api/user', userData);
    closeWindow()
    getUsers()
}

function generatePermissionList(){
    let permissionTable = []
    for(let i = 0; i < userList.length; i++){
        const userName = document.getElementById("userName")
        const driveName = document.getElementById(driveList[i].addedDrive_name)
        const read = document.getElementById(driveList[i].addedDrive_name+"-read")
        const write = document.getElementById(driveList[i].AddedDrive_name+"-write")
        if (read.checked == true){ 
            readValue = true
        }else {
            readValue = false
        }
        if (write.checked == true){ 
            writeValue = true
        }else {
            writeValue = false
        }
        userEntry = {"user": userName, "driveName": driveName, "readValue": readValue, "writeValue": writeValue}
        permissionTable.push(userEntry)
    }
    return permissionTable
}
