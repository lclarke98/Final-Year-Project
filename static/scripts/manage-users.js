window.addEventListener('load', getUsers)
window.addEventListener('load', pageLoad)
let data

function pageLoad(){
    document.getElementById("open-add-user").addEventListener("click", openAddUserWindow)
    document.getElementById("add-user").addEventListener("click", addNeweUser)
}


function activateOverlay(){
  document.getElementById("overlay").classList.add("overlay");
}

function deactivateOverlay(){
  document.getElementById("overlay").classList.remove("overlay");
}

function openAddUserWindow(){
    getDriveList()
    document.getElementById("add-user-menu").style.display = "block";
    document.getElementById("close-add-window").addEventListener("click", closeAddUserWindow)
    document.getElementById("user-list").style.pointerEvents = "none";
    activateOverlay()
}

function closeAddUserWindow(){
    document.getElementById("add-user-menu").style.display = "none"
    document.getElementById("permission-list").textContent = ""
    document.getElementById("user-list").style.pointerEvents = "all";
    document.getElementById("overlay").classList.remove("overlay");
    deactivateOverlay()
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
    const userID = data[index].user_id
    const url = `/api/permissionListByUsername?userID=${userID}`;
    const response = await fetch(url)
    result = await response.json()
    const permissionList = document.getElementById("user-permissions")
    for (let i = 0; i < result.length; i++) {
        const elem = document.createElement("li")
        const read = document.createElement("input")
        read.id=result[i].addedDrive_name+"-read"
        read.type = "checkbox"
        if(result[i].permission_read == 1){
            read.checked = true
        }
        const write = document.createElement("input")
        write.id = result[i].addedDrive_name+"-write"
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
      const tile = document.createElement("div")
      tile.id = "tile"
      const icon = document.createElement("IMG");
      icon.setAttribute("src", "/image/user-icon.png")
      let name = document.createElement("figcaption")
      name.textContent =  list[i].user_name
      icon.id = i
      tile.appendChild(icon)
      tile.appendChild(name)
      icon.addEventListener("click", openUserWindow)
      userList.appendChild(tile)
    }
}


let userIndex

function openUserWindow(){
  activateOverlay()
    userIndex = this.id
    getPermissionList(userIndex)
    let userName = data[this.id].user_id
    document.getElementById("close").addEventListener("click", closeWindow)
    document.getElementById("update-user-permsiions-button").addEventListener("click", updatePermissions)
    document.getElementById("change-username-button").addEventListener('click', openChangeUsernameWindow)
    document.getElementById("change-password-button").addEventListener('click', openChangePasswordWindow)
    document.getElementById("user-list").style.pointerEvents = "none";
    document.getElementById("delete-user").addEventListener("click", function(){
        deleteUser(userIndex)
    }, false);
    document.getElementById("menu").style.display = "block";
    document.getElementById("user-name").textContent = data[this.id].user_name
    document.getElementById("user-name").setAttribute("name", data[this.id].user_id);
}

function closeWindow(){
    document.getElementById("menu").style.display = "none"
    document.getElementById("user-permissions").textContent = ""
    document.getElementById("user-list").style.pointerEvents = "all";
    userIndex = ""
    deactivateOverlay()
}

function clearList(){
    document.getElementById("user-list").textContent  = ""
    document.getElementById("permission-list").textContent  = ""
    document.getElementById("user-permissions").textContent  = ""
}

async function deleteUser(index){
    const userID = data[index].user_id
    const userData = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          info: {
            userID: userID,
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
    console.log(response)
    closeAddUserWindow()
}

//////////////////////////Update functions////////////////////////////////////

function openChangeUsernameWindow(){
    console.log("open")
    document.getElementById("change-username-window").style.display = "block"
    document.getElementById("close-change-username-window").addEventListener("click", closeChangeUsernameWindow)
    document.getElementById("change-username").addEventListener("click", changeUsername)
}

function openChangePasswordWindow(){
    document.getElementById("change-password-window").style.display = "block"
    document.getElementById("close-change-password-window").addEventListener("click", closeChangePasswordWindow)
    document.getElementById("change-password").addEventListener("click", changePassword)
}

function closeChangeUsernameWindow(){
    console.log("here")
    document.getElementById("change-username-window").style.display = "none"
}

function closeChangePasswordWindow(){
    document.getElementById("change-password-window").style.display = "none"
}

async function changeUsername(){
    const currentUsername = document.getElementById("user-name").textContent
    const newUsername = document.getElementById("updated-username").value
    console.log(currentUsername)
    console.log(newUsername)
    const data = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          info: {
            currentUsername: currentUsername,
            newUsername: newUsername, 
          }
        })
      }
    const response = await fetch('/api/username', data);
    console.log(response)
    closeAddUserWindow()
}

async function changePassword(){
    const username = document.getElementById("user-name").textContent
    const newPassword= document.getElementById("updated-password").value
    console.log(username)
    console.log(newPassword)
    const data = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          info: {
            username: username,
            newPassword: newPassword, 
          }
        })
      }
    const response = await fetch('/api/password', data);
    console.log(response)
    closeAddUserWindow()
}



function generateNewPermissionList(){
  let newPermissionTable = []
  for(let i = 0; i < driveList.length; i++){
    console.log(driveList[i])
      const userID = document.getElementById("user-name").getAttribute("name")
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
      userEntry = {"user": userID, "driveName": driveName, "readValue": readValue, "writeValue": writeValue}
      newPermissionTable.push(userEntry)
  }
  return newPermissionTable
}

async function updatePermissions(){
  const newPermissionsTable = generateNewPermissionList()
  const username = document.getElementById("user-name").userid
  console.log(newPermissionsTable)
  const data = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      info: {
        username: username,
        newPermissions: newPermissionsTable, 
      }
    })
  }
const response = await fetch('/api/userPermissions', data);
console.log(response)
closeAddUserWindow()
}