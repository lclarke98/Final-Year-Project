window.addEventListener('load', pageLoad)

function pageLoad() {
  document.getElementById("add-new-drive").addEventListener("click", openAddNewDriveWindow)
  document.getElementById("add-drive").addEventListener('click', addNewDrive)
  getDrive()
  onLoadUserList()
}

let dbData
let userList

function clearList() {
  document.getElementById("drive-list").textContent = ""
}

async function getDrive() {
  const url = `/api/driveList`
  const response = await fetch(url)
  dbData = await response.json()
  displayDriveList(dbData)
}

function activateOverlay(){
  document.getElementById("overlay").classList.add("overlay");
}

function deactivateOverlay(){
  document.getElementById("overlay").classList.remove("overlay");
}

async function displayDriveList(list) {
  clearList()
  const driveList = document.getElementById("drive-list")
  for (let i = 0; i < list.length; i++) {
    const tile = document.createElement("div")
    tile.id = "tile"
    const icon = document.createElement("IMG");
    icon.setAttribute("src", "/image/nas-icon.png")
    let name = document.createElement("figcaption")
    name.textContent = list[i].addedDrive_name
    icon.id = i
    tile.appendChild(icon)
    tile.appendChild(name)
    driveList.appendChild(tile)
    icon.addEventListener("click", openDriveWindow)
  }
}

let driveIndex
function openDriveWindow() {
  activateOverlay()
  document.getElementById("drive-list").style.pointerEvents = "none";
  driveIndex = this.id
  document.getElementById("display-drive-name").textContent = dbData[this.id].addedDrive_name
  document.getElementById("display-drive-name").setAttribute("name", dbData[this.id].addedDrive_name);
  console.log(driveIndex)
  console.log(dbData[this.id])
  document.getElementById("update-user-permsiions-button").addEventListener("click", updatePermissions)
  document.getElementById("close").addEventListener("click", closeWindow)
  document.getElementById("delete-drive").addEventListener("click", function () {
    deleteDrive(driveIndex);
  }, false);
  document.getElementById("menu").style.display = "block";
  document.getElementById("drive-name").textContent = dbData[this.id].addedDrive_name
  getPermissionList(driveIndex)
}

function closeWindow() {
  deactivateOverlay()
  document.getElementById("drive-list").style.pointerEvents = "all";
  document.getElementById("menu").style.display = "none"
  document.getElementById("permission-list").textContent = ""
  driveIndex = ""
}

async function onLoadUserList() {
  const url = "/api/userList"
  const response = await fetch(url)
  userList = await response.json()
  return userList
}

async function getUnaddedDrivList() {
  const url = `/api/unaddedDriveList`
  const response = await fetch(url)
  const result = await response.json()
  console.log(result)
  let list = document.getElementById('unadded-drive-list')
  for (let i = 0; i < result.length; i++) {
    let item = document.createElement('li')
    item.textContent = result[i].unaddedDrive_path
    item.id = result[i].unaddedDrive_path
    item.addEventListener("click", openSetupWindow)
    list.appendChild(item)
  }
}


async function getPermissionList(index) {
  const driveName = dbData[index].addedDrive_name

  const url = `/api/permissionList?driveName=${driveName}`
  const response = await fetch(url)
  result = await response.json()
  console.log(result)
  const permissionList = document.getElementById("permission-list")
  for (let i = 0; i < result.length; i++) {
    const permissionContainer = document.createElement("div")
    permissionContainer.classList.add("permission-container")
    const readLabel = document.createElement("label")
    readLabel.textContent = "read"
    const writeLabel = document.createElement("label")
    writeLabel.textContent = "write"
    const elem = document.createElement("li")
    const read = document.createElement("input")
    read.id = result[i].user_id + "-read"
    read.type = "checkbox"
    if (result[i].permission_read == 1) {
      read.checked = true
    }
    const write = document.createElement("input")
    write.id = result[i].user_id + "-write"
    write.type = "checkbox"
    if (result[i].permission_write == 1) {
      write.checked = true
    }
    elem.append
    elem.textContent = result[i].user_name
    elem.id = result[i].user_id;
    readLabel.appendChild(read)
    writeLabel.appendChild(write)
    permissionContainer.appendChild(readLabel)
    permissionContainer.appendChild(writeLabel)
    elem.appendChild(permissionContainer)
    permissionList.appendChild(elem)
  }
}

async function deleteDrive(index) {
  const driveName = dbData[index].addedDrive_name
  const data = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      info: {
        driveName: driveName,
      }
    })
  }
  const response = await fetch('/api/drive', data)
  closeWindow()
  getDrive()
}


/////////////////////////////////////////////////////////////
//Add Drive Functions
function openAddNewDriveWindow() {
  activateOverlay()
  document.getElementById("drive-list").style.pointerEvents = "none";
  document.getElementById("add-new-drive-window").style.display = "block"
  document.getElementById("close-add-drive-window").addEventListener("click", closeAddNewDriveWindow)
  getUnaddedDrivList()
}

function closeAddNewDriveWindow() {
  deactivateOverlay()
  document.getElementById("drive-list").style.pointerEvents = "all";
  document.getElementById("add-new-drive-window").style.display = "none"
  document.getElementById("unadded-drive-list").textContent = ""
}

let path
function openSetupWindow() {
  document.getElementById("setup-window").style.display = "block"
  document.getElementById("cancel-setup-button").addEventListener("click", closeSetupWindow)
  document.getElementById("title").textContent = this.id
  getUserList()
  path = this.id
  console.log(this.id)
}

function closeSetupWindow() {
  document.getElementById("setup-window").style.display = "none"
}

function completedSetup() {
  closeSetupWindow()
  closeAddNewDriveWindow()
  getDrive()
}

async function getUserList() {
  const url = "/api/userList"
  const response = await fetch(url)
  userList = await response.json()
  const permissionList = document.getElementById("user-permission-list")
  for (let i = 0; i < userList.length; i++) {
    const elem = document.createElement("li")
    const read = document.createElement("input")
    read.id = userList[i].user_id + "-read"
    read.type = "checkbox"
    const write = document.createElement("input")
    write.id = userList[i].user_id + "-write"
    write.type = "checkbox"
    elem.append
    elem.textContent = userList[i].user_name
    elem.id = userList[i].user_id;
    permissionList.appendChild(elem)
    permissionList.appendChild(read)
    permissionList.appendChild(write)
  }
}


function generatePermissionList() {
  let permissionTable = []
  console.log(userList)
  for (let i = 0; i < userList.length; i++) {
    const user = document.getElementById(userList[i].user_id)
    const read = document.getElementById(userList[i].user_id + "-read")
    const write = document.getElementById(userList[i].user_id + "-write")
    if (read.checked == true) {
      readValue = true
    } else {
      readValue = false
    }
    if (write.checked == true) {
      writeValue = true
    } else {
      writeValue = false
    }
    userEntry = { "user": userList[i].user_id, "readValue": readValue, "writeValue": writeValue }
    permissionTable.push(userEntry)
  }
  return permissionTable
}

async function getRaidList() {
  const url = "/api/driveList"
  const response = await fetch(url)
  const raidList = await response.json()
  const selectionList = document.getElementById("raid-list")
  for (let i = 0; i < raidList.length; i++) {
    const elem = document.createElement("li")
    const select = document.createElement("input")
    select.id = raidList[i].addedDrive_name
    select.type = "checkbox"
    elem.append
    elem.textContent = raidList[i].addedDrive_name
    elem.id = raidList[i].addedDrive_path;
    selectionList.appendChild(elem)
    selectionList.appendChild(select)
  }
}

async function addNewDrive() {
  const driveName = document.getElementById("drive-name").value
  const userPermissionList = generatePermissionList()
  const raid = false
  const raidTarget = "0"
  const data = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      info: {
        drivePath: path,
        driveName: driveName,
        raid: raid,
        raidTarget: raidTarget,
        permissionList: userPermissionList,
      }
    })
  }
  const response = await fetch('/api/newDrive', data)
  completedSetup()
}

function generateNewPermissionList() {
  let newPermissionTable = []
  for (let i = 0; i < userList.length; i++) {
    const driveName = document.getElementById("display-drive-name").getAttribute("name")
    const userID = userList[i].user_id
    const read = document.getElementById(userList[i].user_id + "-read")
    const write = document.getElementById(userList[i].user_id + "-write")
    if (read.checked == true) {
      readValue = true
    } else {
      readValue = false
    }
    if (write.checked == true) {
      writeValue = true
    } else {
      writeValue = false
    }
    userEntry = { "user": userID, "driveName": driveName, "readValue": readValue, "writeValue": writeValue }
    newPermissionTable.push(userEntry)
  }
  console.log(newPermissionTable)
  return newPermissionTable
}

async function updatePermissions() {
  const newPermissionsTable = generateNewPermissionList()
  console.log(newPermissionsTable)
  const data = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      info: {
        newPermissions: newPermissionsTable,
      }
    })
  }
  const response = await fetch('/api/userPermissions', data);
  console.log(response)
}