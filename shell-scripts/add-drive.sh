#!/bin/bash
#KEY
# $1 drive path
# $2 drive name
# $3 read list
# $4 write list


echo $1
echo $2
echo $3
echo $4

newPath="/media/pi/"+$2

# Step 0 create mount point

sudo mkdir /home/pi/nas-mount/$2

#Step get sda and add mount point to fstab
getPath="$(ls -l /dev/disk/by-label/$2 | tail -c 6)"
sd="${getPath}" 
echo $sd

sudo umount /dev/$sd
yes| sudo mkfs.ext4 /dev/$sd -L $2
sudo echo "/dev$sd /home/pi/nas-mount/$2 ext4 defaults 0 0" >> "/etc/fstab"

# mount the drive
sudo mount /home/pi/nas-mount/$2
# Step four change the r+w permissions
sudo chmod a+rwx /home/pi/nas-mount/$2

# add drive to smb config
smbConf="/etc/samba/smb.conf"
newPath="/home/pi/nas-mount/$2"
sudo echo "[$2]" >> "/etc/samba/smb.conf"
echo "path = $newPath" >> "/etc/samba/smb.conf"
echo "writeable=yes" >> "/etc/samba/smb.conf"
echo "create mask=0777" >> "/etc/samba/smb.conf"
echo "directory mask=0777" >> "/etc/samba/smb.conf"
echo "public=no" >> "/etc/samba/smb.conf"