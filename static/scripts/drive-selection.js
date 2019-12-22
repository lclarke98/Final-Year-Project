window.addEventListener('load', pageLoad)

function pageLoad(){
    getDrive()
}

async function getDrive(){
    const url = `/api/driveList`
    const response = await fetch(url)
    const driveList = await response.json()
    displayDriveList(driveList)
}

async function displayDriveList(list){
    const list = document.getElementById("driveList")
    for (let i = 0; i < list.length; i++) {
        const elem = document.createElement("li")
        elem.textContent = list[i]
        elem.id = list[i];;
        list.appendChild(elem)
        if(list[i] = "..."){
            document.getElementById(elem.id).addEventListener("click", openPreview)
        }
        else{
            document.getElementById(elem.id).addEventListener("click", openSubDir)
        }
    }
}