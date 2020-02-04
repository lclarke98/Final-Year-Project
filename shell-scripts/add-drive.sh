#!/bin/sh

#KEY
# $1 drive path
# $2 drive name

newPath="/media/pi/"+$2

# Step 0 create mount point

sudo mkdir /home/pi/nas-mount/$2

# Step get sda and add mount point to fstab

getPath="$(ls -l /dev/disk/by-label/MJRO1815 | tail -c 6)"

sd="${getPath}" 

sudo echo "/dev$sd /home/pi/nas-mount$2 ext4 defaults 0 0" >> "/ect/fstab"

echo $sd

# Step one umount the drive

sudo umount -a $1

# Step two format drive with new name

sudo mkfs.ext4 /dev/sda1 -L $2

# Step three mount the drive

sudo mount $newPath

# Step four change the r+w permissions

sudo chmod a+rwx $newPath

# Now add to SAMBA ????????????????????????????

smbConf="/etc/samba/smb.conf"
name="nas1"
newPath="/media/pi/"$name

echo "[$name]" >> $smbConf
echo "path = "$newPath >> $smbConf
echo "writeable=yes" >> $smbConf
echo "create mask=0777" >> $smbConf
echo "directory mask=0777" >> $smbConf
echo "public=no" >> $smbConf