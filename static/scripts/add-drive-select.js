window.addEventListener("load", getDriveList);

//gets the initial list of displays ip addresses
async function getDriveList() {
  const url = `/api/unaddedDriveList`;
  const response = await fetch(url);
  const result = await response.json();
  let list = document.getElementById('drive-list');
  for(let i = 0; i < result.length; i++) {
    let item = document.createElement('li');
    let a = document.createElement('a');
    a.textContent = result[i].unaddedDrive_path;
    let path = result[i].unaddedDrive_path;
    let link = 'drive-setup.html?path='+path;
    a.setAttribute('href', link);
    item.appendChild(a);
    list.appendChild(item);
  }
  return list;
}