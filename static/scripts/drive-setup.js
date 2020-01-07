//gets the displays ip address from the url
function getUrlVars() {
    let vars = {}
    let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value
    })
    return vars
}
  
window.addEventListener("load", getPath)
window.addEventListener("load", getUserList)
window.addEventListener("load", pageLoad);
  
function pageLoad(){
    document.getElementById("add-drive").addEventListener('click', addNewDrive)
    document.getElementById("drive-raid").addEventListener('click', getRaidList)
}
  
let path
function getPath(){
    path = getUrlVars()["path"]
    document.getElementById("path").textContent = path
}

let userList

async function getUserList(){
    const url = "/api/userList"
    const response = await fetch(url)
    userList = await response.json()
    const permissionList = document.getElementById("permission-list")
    for (let i = 0; i < userList.length; i++) {
        const elem = document.createElement("li")
        const read = document.createElement("input")
        read.id=userList[i].user_name+"-read"
        read.type = "checkbox"
        const write = document.createElement("input")
        write.id = userList[i].user_name+"-write"
        write.type = "checkbox"
        elem.append
        elem.textContent = userList[i].user_name
        elem.id = userList[i].user_name;
        permissionList.appendChild(elem)
        permissionList.appendChild(read)
        permissionList.appendChild(write)
    }
}

function validateRaid(){
    const raid = document.getElementById("drive-raid")
    if (raid.checked == true){ 
      return true
    } else {
      return false
    }
}

function generatePermissionList(){
    let permissionTable = []
    for(let i = 0; i < userList.length; i++){
        const user = document.getElementById(userList[i].user_name)
        const read = document.getElementById(userList[i].user_name+"-read")
        const write = document.getElementById(userList[i].user_name+"-write")
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
        userEntry = {"user": userList[i].user_name, "readValue": readValue, "writeValue": writeValue}
        permissionTable.push(userEntry)
    }
    return permissionTable
}

async function getRaidList(){
  const url = "/api/driveList"
  const response = await fetch(url)
  const raidList = await response.json()
  const selectionList = document.getElementById("raid-list")
  for (let i = 0; i < raidList.length; i++) {
      const elem = document.createElement("li")
      const select = document.createElement("input")
      select.id=raidList[i].addedDrive_name
      select.type = "checkbox"
      elem.append
      elem.textContent = raidList[i].addedDrive_name
      elem.id = raidList[i].addedDrive_path;
      selectionList.appendChild(elem)
      selectionList.appendChild(select)
  }
}

async function addNewDrive(){
  const driveName = document.getElementById("drive-name").value
  const raid = validateRaid()
  const raidTarget = document.getElementById("raid-target").value
  const userPermissionList = generatePermissionList()
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
  const response = await fetch('/api/newDrive', data);
}