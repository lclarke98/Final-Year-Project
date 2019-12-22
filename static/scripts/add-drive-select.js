window.addEventListener("load", getIpList);

//gets the initial list of displays ip addresses
async function getDriveList() {
  const url = `/api/driveList`;
  const response = await fetch(url);
  const result = await response.json();
  let list = document.getElementById('drive-list');
  for(let i = 0; i < result.length; i++) {
    let item = document.createElement('li');
    let a = document.createElement('a');
    a.textContent = result[i].drivePath;
    let address= result[i].ip_address;
    let link = 'drive-setup.html?path='+address;
    a.setAttribute('href', link);
    item.appendChild(a);
    list.appendChild(item);
  }
  return list;
}