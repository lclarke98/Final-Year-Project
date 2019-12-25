function loadScripts() {
  loadPageHeader();
  addEventListeners();
  getAllFiles();
};

async function getAllFiles() {
  const url = '/api/allFiles';
  const response = await fetch(url);
  const allFiles = await response.json();
  console.log(allFiles);
  generateFileList("fileList", "delFilesList", allFiles);
};

async function generateFileList(ID, deleteID, files) {
  console.log(files)
  const list = document.getElementById(ID);
  const deleteList = document.getElementById(deleteID);

  for (let i = 0; i < files.length; i++) {
    const elem = document.createElement("li");
    elem.textContent = files[i];
    elem.id = files[i];;
    list.appendChild(elem);
    document.getElementById(elem.id).addEventListener("click", openSubDir);
  }
};

function addEventListeners() {
  document.getElementById("uploadNewFile").addEventListener("click", openDialog);
  document.getElementById("dialogClose").addEventListener("click", closeDialog);
  document.getElementById("fileViewerClose").addEventListener("click", closePreview);
};

function openDialog() {
  document.getElementById("uploadFileDialog").style.display = "flex";
};

function closeDialog() {
  document.getElementById("uploadFileDialog").style.display = "none";
};

function openPreview() {
  const file = this.id;
  let previewWindow;

  if (file.substr(-4) === ".mp4" || file.substr(-5) === ".webm" || file.substr(-4) === ".ogg") {
    previewWindow = document.getElementById("previewVideo");
    previewWindow.src = "../displays" + file;

  } else if (file.substr(-4) === ".jpg" || file.substr(-4) === ".png" || file.substr(-4) === ".gif" || file.substr(-4) === ".svg" || file.substr(-5) === ".jpeg") {
    previewWindow = document.getElementById("previewImage");
    previewWindow.src = "../displays" + file;
  } else {
    previewWindow = document.getElementById("previewError");
  }

  previewWindow.style.display = "block";
  document.getElementById("fileViewer").style.display = "flex";
  console.log("HUB: Preview loaded for " + file);

}

function closePreview() {
  const previewImage = document.getElementById("previewImage");
  const previewVideo = document.getElementById("previewVideo");
  const previewError = document.getElementById("previewError");

  document.getElementById("fileViewer").style.display = "none";

  previewImage.style.display = "none";
  previewVideo.style.display = "none";
  previewError.style.display = "none";
  previewImage.src = "";
  previewVideo.src = "";
  console.log("HUB: Preview closed");
}

window.addEventListener('load', loadScripts);

async function downloadFile() {
  const filePath = this.id;
  const url = `/api/download?path=${filePath}`;
  const response = await fetch(url);
  const allFiles = await response.json();
  console.log("All files retrieved");
  generateFileList("fileList", "delFilesList", allFiles);
}

async function openSubDir(){
  const reqPath = this.id
  console.log(reqPath)
  //const drivePath = drive
  const url = '/api/subDir'
  const response = await fetch(url);
  const subDirFiles = await response.json()
  console.log(subDirFiles)
}

//function to clear current generated list