window.addEventListener('load', pageLoad)

function pageLoad() {
  getPath()
  addEventListeners()
  getAllFiles()
}

//gets the displays ip address from the url
function getUrlVars() {
  let vars = {}
  let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value
  })
  return vars
}

let path
function getPath(){
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
    for(let i = 0; i < files.length; i++) {
      let item = document.createElement('li');
      let link = 'file-manager.html?location='+ path + "/" + files[i].Path;
      if(files[i].IsDirectory === true){
        let a = document.createElement('a');
        a.textContent = files[i].Name;
        a.setAttribute('href', link);
        item.appendChild(a);
      }
      else{
          item.textContent = files[i].Name
      }
      list.appendChild(item);
    }
}

function addEventListeners() {
  document.getElementById("uploadNewFile").addEventListener("click", openDialog)
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
  const file = this.id
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


async function downloadFile() {
  const filePath = this.id
  const url = `/api/download?path=${filePath}`
  const response = await fetch(url)
  const allFiles = await response.json()
}

async function openSubDir(){
  const reqPath = this.id
  console.log(reqPath)
  const url = '/api/subDir'
  const response = await fetch(url)
  const subDirFiles = await response.json()
  console.log(subDirFiles)
}