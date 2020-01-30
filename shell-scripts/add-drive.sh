#!/bin/sh

#KEY
# $1 drive path
# $2 drive name

newPath="/media/pi/"+$2

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