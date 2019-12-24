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
    document.getElementById("add-drive").addEventListener('click', addDisplay);
}
  
let path;
function getPath(){
    path = getUrlVars()["path"]
    document.getElementById("path").textContent = path
}

async function getUserList(){
    const url = "/api/userList"
    const response = await fetch(url)
    const userList = await response.json()
    const permissionList = document.getElementById("permission-list")
    for (let i = 0; i < userList.length; i++) {
        console.log(userList[i])
        const elem = document.createElement("li")
        const read = document.createElement("input")
        read.type = "checkbox"
        const write = document.createElement("input")
        write.type = "checkbox"
        elem.append
        elem.textContent = userList[i].user_name
        elem.id = userList[i].user_name;
        permissionList.appendChild(elem)
        permissionList.appendChild(read)
        permissionList.appendChild(write)
    }
}

async function addNewDrive(){
    const driveNmae = document.getElementById("drive-name")
    const raid = document.getElementById("drive-raid")
    const raidTarget = document.getElementById("raid-target")
    const userPermission = document.getElementById("user-permissions")
    const data = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            name: driveName,
            raid: raid,
            raidTarget: raidTarget,
            userPermission: userPermission,
          }
        })
      }
    const response = await fetch('/api/newDrive', data);
    const obj = await response.json();
}