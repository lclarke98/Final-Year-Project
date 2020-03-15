window.addEventListener('load', pageLoad)

function pageLoad() {
  getPath()
  addEventListeners()
  getAllFiles()
}

//gets the displays ip address from the url
function getUrlVars() {
  let vars = {}
  let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value
  })
  return vars
}

let path
function getPath() {
  path = getUrlVars()["location"]

}

async function getAllFiles() {
  console.log(path)
  const url = `/api/allFiles?location=${path}`
  const response = await fetch(url)
  const allFiles = await response.json()
  console.log(allFiles)
  generateFileList(allFiles)
}

async function generateFileList(files) {

  let list = document.getElementById('fileList');
  list.textContent = ""
  for (let i = 0; i < files.length; i++) {
    let item = document.createElement('li');
    item.id = files[i].Name
    let link = 'file-manager.html?location=' + path + "/" + files[i].Path;
    if (files[i].IsDirectory === true) {
      let a = document.createElement('a');
      a.textContent = files[i].Name;
      a.setAttribute('href', link);
      item.appendChild(a);
    }
    else {
      let preview = document.createElement("button")
      preview.textContent = "View"
      preview.addEventListener("click", openPreview)
      preview.id = path + "/" + files[i].Path;
      let download = document.createElement("button")
      download.addEventListener("click", downloadFile)
      download.textContent = "Download"
      download.id = path + "/" + files[i].Path;
      let deleteItem = document.createElement("button")
      deleteItem.textContent = "Delete"
      deleteItem.id = path + "/" + files[i].Path;
      deleteItem.addEventListener("click", deleteFile)
      item.textContent = files[i].Name
      item.appendChild(preview)
      item.appendChild(download)
      item.appendChild(deleteItem)
    }
    list.appendChild(item);
  }
}

function addEventListeners() {
  document.getElementById("uploadNewFile").addEventListener("click", openDialog)
  document.getElementById("create-folder").addEventListener("click", openNewFolderWindow)
  document.getElementById("dialogClose").addEventListener("click", closeDialog)
  document.getElementById("fileViewerClose").addEventListener("click", closePreview)
}

function openDialog() {
  document.getElementById("uploadFileDialog").style.display = "flex"
}

function closeDialog() {
  document.getElementById("uploadFileDialog").style.display = "none"
}

function openPreview() {
  const file = path + "/" + this.id
  let previewWindow
  if (file.substr(-4) === ".mp4" || file.substr(-5) === ".webm" || file.substr(-4) === ".ogg") {
    previewWindow = document.getElementById("previewVideo");
    previewWindow.src = file

  } else if (file.substr(-4) === ".jpg" || file.substr(-4) === ".png" || file.substr(-4) === ".gif" || file.substr(-4) === ".svg" || file.substr(-5) === ".jpeg") {
    previewWindow = document.getElementById("previewImage")
    previewWindow.src = file
  } else {
    previewWindow = document.getElementById("previewError")
  }

  previewWindow.style.display = "block";
  document.getElementById("fileViewer").style.display = "flex"
}

function closePreview() {
  const previewImage = document.getElementById("previewImage")
  const previewVideo = document.getElementById("previewVideo")
  const previewError = document.getElementById("previewError")
  document.getElementById("fileViewer").style.display = "none"
  previewImage.style.display = "none"
  previewVideo.style.display = "none"
  previewError.style.display = "none"
  previewImage.src = ""
  previewVideo.src = ""
}

function openNewFolderWindow() {
  document.getElementById("new-folder-window").style.display = "block";
  document.getElementById("close-new-folder-window").addEventListener("click", closeNewFolderWindow)
  document.getElementById("add-new-folder-button").addEventListener("click", addNewFolder)
}

function closeNewFolderWindow() {
  document.getElementById("new-folder-window").style.display = "none";
  getAllFiles()
}

async function addNewFolder() {
  const folderName = path + "/" + document.getElementById("new-folder-name").value
  const data = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      info: {
        folderName: folderName,
      }
    })
  }
  const response = await fetch('/api/newFolder', data);
  closeNewFolderWindow()
}

async function downloadFile() {
  console.log(this.id)
  //const filePath = this.id
  //const url = `/api/download?path=${filePath}`
  //const response = await fetch(url)
  //const allFiles = await response.json()
}

async function deleteFile() {
  console.log(this.id)
  //const filePath = this.id
  //const url = `/api/download?path=${filePath}`
  //const response = await fetch(url)
  //const allFiles = await response.json()
}