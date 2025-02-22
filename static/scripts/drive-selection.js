window.addEventListener('load', getDrive)

// gets drive list from db
async function getDrive(){
    const url = `/user/userDriveList`
    const response = await fetch(url)
    const driveList = await response.json()
    displayDriveList(driveList)
}

// displays drive list
async function displayDriveList(list){
    const driveList = document.getElementById("drive-list")
    console.log(list)
    console.log("hi")
    for(let i = 0; i < list.length; i++) {
        let a = document.createElement('a');
        const tile = document.createElement("div")
        tile.id = "tile"
        const icon = document.createElement("IMG")
        icon.setAttribute("src", "/image/nas-icon.png")
        let name = document.createElement("figcaption")
        name.textContent = list[i].addedDrive_name
        let path = list[i].addedDrive_path
        if(list[i].permission_write === 1){
            a.setAttribute("href",'file-manager.html?write=1&location='+path)
        }else{
            a.setAttribute("href",'file-manager.html?write=0&location='+path)
        }
        a.appendChild(icon)
        tile.appendChild(a)
        tile.appendChild(name)
        driveList.appendChild(tile)
    }
}

