//gets the displays ip address from the url
function getUrlVars() {
    var vars = {}
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value
    });
    return vars
  }
  
  window.addEventListener("load", getPath)
  //window.addEventListener("load", pageLoad);
  
//function pageLoad() {
    //document.getElementById("addDisplay").addEventListener('click', addDisplay);
//}
  
let path;
function getPath(){
    path = getUrlVars()["path"]
    console.log(path)
    document.getElementById("path").textContent = path
}