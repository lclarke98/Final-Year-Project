window.addEventListener('load', pageLoad)

function pageLoad() {
  document.getElementById("submitBtn").addEventListener("click", sendPath)
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
let write
// gets url vars
function getPath() {
  path = getUrlVars()["location"]
  write = getUrlVars()["write"]
}

// gets all files for selected nas drive
async function getAllFiles() {
  console.log(path)
  const url = `/api/allFiles?location=${path}`
  const response = await fetch(url)
  const allFiles = await response.json()
  console.log(allFiles)
  generateFileList(allFiles)
}

// creates the file list
async function generateFileList(files) {
  let list = document.getElementById('fileList');
  list.textContent = ""
  for (let i = 0; i < files.length; i++) {
    let item = document.createElement('li');
    item.id = files[i].Name
    let link = 'file-manager.html?location=' + path + "/" + files[i].Path;
    if (files[i].IsDirectory === true) {
      if(files[i].Name !== "lost+found"){
        let a = document.createElement('a');
        a.textContent = files[i].Name;
        a.setAttribute('href', link);
        item.appendChild(a);
      }
    }
    else {
      let buttonGroup = document.createElement("div")
      buttonGroup.id = "button-group"
      let preview = document.createElement("img")
      preview.setAttribute("src", "/image/preview-icon.png")
      preview.addEventListener("click", openPreview)
      preview.id = path + "/" + files[i].Path;
      buttonGroup.appendChild(preview)
      let download = document.createElement("img")
      download.setAttribute("src", "/image/download-icon.png")
      download.addEventListener("click", downloadFile)
      download.id = path + "/" + files[i].Path;
      buttonGroup.appendChild(download)
      if(write == 1){
        let deleteItem = document.createElement("img")
        deleteItem.setAttribute("src", "/image/delete-icon.png")
        deleteItem.id = path + "/" + files[i].Path;
        deleteItem.addEventListener("click", deleteFile)
        buttonGroup.appendChild(deleteItem)
      }
      item.textContent = files[i].Name
      item.appendChild(buttonGroup)
    }
    list.appendChild(item);
  }
}

// adds the event losteners
function addEventListeners() {
  document.getElementById("uploadNewFile").addEventListener("click", openDownloadModal)
  document.getElementById("create-folder").addEventListener("click", openNewFolderWindow)
  document.getElementById("dialogClose").addEventListener("click", closeDownloadModal)
  document.getElementById("fileViewerClose").addEventListener("click", closePreview)
}

//open download window
function openUploadModal() {
  document.getElementById("uploadFileDialog").style.display = "flex"
}

//close download window
function closeUploadModal() {
  document.getElementById("uploadFileDialog").style.display = "none"
}

// opens preview window when file clicked
function openPreview() {
  const file = this.id.replace("/home/pi/Final-Year-Project/static", "")
  console.log(file)
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

// closes file preview window
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

// opens new folder modal
function openNewFolderWindow() {
  document.getElementById("new-folder-window").style.display = "block";
  document.getElementById("close-new-folder-window").addEventListener("click", closeNewFolderWindow)
  document.getElementById("add-new-folder-button").addEventListener("click", addNewFolder)
}

// closes new folder modal
function closeNewFolderWindow() {
  document.getElementById("new-folder-window").style.display = "none";
  getAllFiles()
}

// adds new folder to nas drive
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

// downloads selected drive
async function downloadFile() {
  console.log(this.id)
  const filePath = this.id.replace("/home/pi/Final-Year-Project/", "")
  const url = `/api/download?path=${filePath}`
  console.log(url)
  const response = await fetch(url)
  const res = await response
  console.log(res)
  location.replace(res.url)
}

// delets selected file
async function deleteFile() {
  console.log(this.id) 
  const filePath = this.id
  const url = `/api/delete?path=${filePath}`
  const response = await fetch(url)
  getAllFiles()
}

// sends download path to server
async function sendPath(){
  const url = `/api/uploadPath?location=${path}`
  const response = await fetch(url)
  getAllFiles()
}