window.addEventListener('load', getDrive)

async function getDrive(){
    const url = `/api/driveList`
    const response = await fetch(url)
    const driveList = await response.json()
    displayDriveList(driveList)
}

async function displayDriveList(list){
    const driveList = document.getElementById("drive-list")
    for(let i = 0; i < list.length; i++) {
        let a = document.createElement('a');
        const tile = document.createElement("div")
        tile.id = "tile"
        const icon = document.createElement("IMG")
        icon.setAttribute("src", "/image/nas-icon.png")
        let name = document.createElement("figcaption")
        name.textContent = list[i].addedDrive_name
        let path = list[i].addedDrive_path
        a.setAttribute("href",'file-manager.html?path='+path)
        a.appendChild(icon)
        tile.appendChild(a)
        tile.appendChild(name)
        driveList.appendChild(tile)
    }
}

