window.addEventListener('load', pageLoad)


function pageLoad(){
    document.getElementById("add-new-drive").addEventListener("click", openAddNewDriveWindow)
    getDrive()

}

let dbData

function clearList(){
    document.getElementById("drive-list").textContent  = ""
}

async function getDrive(){
    const url = `/api/driveList`
    const response = await fetch(url)
    dbData = await response.json()
    displayDriveList(dbData)
}

async function displayDriveList(list){
    clearList()
    const driveList = document.getElementById("drive-list")
    for(let i = 0; i < list.length; i++) {
        let item = document.createElement('li')
        item.textContent = list[i].addedDrive_name
        item.id = i
        driveList.appendChild(item)
        item.addEventListener("click", openDriveWindow)
    }
}

let driveIndex
function openDriveWindow(){
    driveIndex = this.id
    console.log(driveIndex)
    console.log(dbData[this.id])
    document.getElementById("close").addEventListener("click", closeWindow)
    document.getElementById("delete-drive").addEventListener("click", function(){
        deleteDrive(driveIndex);
    }, false);
    document.getElementById("menu").style.display = "block";
    document.getElementById("drive-name").textContent = dbData[this.id].addedDrive_name
    getPermissionList(driveIndex)
}

function closeWindow(){
    document.getElementById("menu").style.display = "none"
    document.getElementById("permission-list").textContent  = ""
    driveIndex = ""
}

function openAddNewDriveWindow(){
    document.getElementById("add-new-drive-window").style.display = "block"
    document.getElementById("close-add-drive-window").addEventListener("click", closeAddNewDriveWindow)
    getUnaddedDrivList()
}

function closeAddNewDriveWindow(){
    document.getElementById("add-new-drive-window").style.display = "none"
    document.getElementById("unadded-drive-list").textContent = ""
}

async function getUnaddedDrivList(){
    const url = `/api/unaddedDriveList`
    const response = await fetch(url)
    const result = await response.json()
    console.log(result)
    let list = document.getElementById('unadded-drive-list')
    for(let i = 0; i < result.length; i++) {
      let item = document.createElement('li')
      item.textContent = result[i].unaddedDrive_path
      item.id = result[i].unaddedDrive_path
      item.addEventListener("click", openSetupWindow)
      list.appendChild(item)
    }
}

function openSetupWindow(){
    document.getElementById("setup-window").style.display = "block"
    document.getElementById("cancel-setup-button").addEventListener("click", closeSetupWindow)
    document.getElementById("title").textContent = this.id;
    console.log(this.id)
}

function closeSetupWindow(){
    document.getElementById("setup-window").style.display = "none"
}

async function getPermissionList(index){
    const driveName = dbData[index].addedDrive_name
    
    const url = `/api/permissionList?driveName=${driveName}`;
    const response = await fetch(url)
    result = await response.json()
    console.log(result)
    const permissionList = document.getElementById("permission-list")
    for (let i = 0; i < result.length; i++) {
        const elem = document.createElement("li")
        const read = document.createElement("input")
        read.id=result[i].ermission_read+"-read"
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
        elem.textContent = result[i].user_name
        elem.id = result[i].user_name;
        permissionList.appendChild(elem)
        permissionList.appendChild(read)
        permissionList.appendChild(write)
    }
}

async function deleteDrive(index){
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
    const response = await fetch('/api/drive', data);
    closeWindow()
    getDrive()
}