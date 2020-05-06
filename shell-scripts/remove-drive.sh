# KEY
# $1 path
# $2 name

# delete from fstab
sed -i "/$1/c\  " /etc/fstab

# delete from smb config
sed -i "/$2/c\ $2+deletedDrive" /etc/samba/smb.conf