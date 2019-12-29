window.addEventListener('load', getUsers)

async function getUsers(){
    const url = `/api/userList`
    const response = await fetch(url)
    const userList = await response.json()
    displayUserList(userList)
}

async function displayUserList(list){
    const userList = document.getElementById("user-list")
    for(let i = 0; i < list.length; i++) {
        let item = document.createElement('li');
        let a = document.createElement('a');
        a.textContent = list[i].user_name;
        let path = list[i].user_name;
        let link = 'file-manager.html?path='+path;
        a.setAttribute('href', link);
        item.appendChild(a);
        userList.appendChild(item);
    }
}