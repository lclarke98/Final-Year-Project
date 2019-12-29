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
        let item = document.createElement('li');
        let a = document.createElement('a');
        a.textContent = list[i].addedDrive_name;
        let path = list[i].addedDrive_path;
        let link = 'file-manager.html?path='+path;
        a.setAttribute('href', link);
        item.appendChild(a);
        driveList.appendChild(item);
    }
}