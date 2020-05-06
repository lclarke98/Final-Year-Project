sudo apt-get update -y
sudo apt-get upgrade -y

curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -
sudo apt install nodejs -y


sudo apt-get install mysql-server -y
sudo apt-get install mariadb-server -y
sudo mysql_secure_installation -y
sudo apt-get install samba samba-common-bin -y

sudo chmod a+rwx "/etc/fstab"
sudo chmod a+rwx "/etc/samba/smb.conf"


git clone "https://github.com/lclarke98/Final-Year-Project"
cd "Final-Year-Project"
sudo npm install
sudo npm start