#!/bin/sh

#KEY
# $1 drive path
# $2 drive name
# $3 permissions

newPath="/media/pi/"+$2

# Step 0 create mount point
sudo mkdir /home/pi/nas-mount/$2

# Format drive and rename
sudo mkfs.ext4 /dev/sda1 -L $2

# Step get sda and add mount point to fstab
getPath="$(ls -l /dev/disk/by-label/MJRO1815 | tail -c 6)"
sd="${getPath}" 
sudo echo "/dev$sd /home/pi/nas-mount$2 ext4 defaults 0 0" >> "/ect/fstab"

# mount the drive
sudo mount /home/pi/nas-mount/$2


# Step four change the r+w permissions

sudo chmod a+rwx /home/pi/nas-mount/$2

# add drive to smb config

smbConf="/etc/samba/smb.conf"
newPath="/home/pi/nas-mount/$2"

echo "[$2]" >> $smbConf
echo "path = "$newPath >> $smbConf
echo "writeable=yes" >> $smbConf
echo "create mask=0777" >> $smbConf
echo "directory mask=0777" >> $smbConf
echo "public=no" >> $smbConf