window.addEventListener('load', getUsers)
window.addEventListener('load', pageLoad)
let data

function pageLoad(){
    document.getElementById("open-add-user").addEventListener("click", openAddUserWindow)
    document.getElementById("add-user").addEventListener("click", addNeweUser)
}

function openAddUserWindow(){
    getDriveList()
    document.getElementById("add-user-menu").style.display = "block";
    document.getElementById("close-add-window").addEventListener("click", closeAddUserWindow)
}

function closeAddUserWindow(){
    document.getElementById("add-user-menu").style.display = "none"
    document.getElementById("permission-list").textContent = ""
}

async function getUsers(){
    const url = `/api/userList`
    const response = await fetch(url)
    data = await response.json()
    displayUserList(data)
}

let driveList

//gets the nas drives tio allow admin to assign permissions for new user
async function getDriveList(){
    const url = "/api/driveList"
    const response = await fetch(url)
    driveList = await response.json()
    const permissionList = document.getElementById("permission-list")
    for (let i = 0; i < driveList.length; i++) {
        const elem = document.createElement("li")
        const read = document.createElement("input")
        const readLabel = document.createElement("p")
        read.id=driveList[i].addedDrive_name+"-read"
        read.type = "checkbox"
        readLabel.textContent = "Read"
        read.appendChild(readLabel)
        const write = document.createElement("input")
        write.id = driveList[i].addedDrive_name+"-write"
        write.type = "checkbox"
        write.textContent = "Write"
        elem.append
        elem.textContent = driveList[i].addedDrive_name
        elem.id = driveList[i].addedDrive_name
        elem.appendChild(read)
        elem.appendChild(write)
        permissionList.appendChild(elem)
    }
}

async function getPermissionList(index){
    const userName = data[index].user_name
    const url = `/api/permissionListByUsername?userName=${userName}`;
    const response = await fetch(url)
    result = await response.json()
    const permissionList = document.getElementById("user-permissions")
    for (let i = 0; i < result.length; i++) {
        const elem = document.createElement("li")
        const read = document.createElement("input")
        read.id=result[i].permission_read+"-read"
        read.type = "checkbox"
        if(result[i].permission_read == 1){
            read.checked = true
        }
        const write = document.createElement("input")
        write.id = result[i].permission_write+"-write"
        write.type = "checkbox"
        if(result[i].permission_write == 1){
            write.checked = true
        }
        elem.append
        elem.textContent = result[i].addedDrive_name
        elem.id = result[i].addedDrive_name;
        elem.appendChild(read)
        elem.appendChild(write)
        permissionList.appendChild(elem)
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
    getPermissionList(userIndex)
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
    document.getElementById("user-permissions").textContent = ""
    userIndex = ""
}

function clearList(){
    document.getElementById("user-list").textContent  = ""
    document.getElementById("permission-list").textContent  = ""
    document.getElementById("user-permissions").textContent  = ""
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
    for(let i = 0; i < driveList.length; i++){
        const userName = document.getElementById("new-user-name").value
        const driveName = driveList[i].addedDrive_name
        const read = document.getElementById(driveList[i].addedDrive_name+"-read")
        const write = document.getElementById(driveList[i].addedDrive_name+"-write")
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


async function addNeweUser(){
    const permissions = generatePermissionList()
    const userName = document.getElementById("new-user-name").value
    const password = document.getElementById("password").value
    console.log(permissions)
    console.log(userName)
    console.log(password)
    const data = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          info: {
            userName: userName,
            password: password, 
            permissionList: permissions,
          }
        })
      }
    const response = await fetch('/api/newUser', data);
}