# Key
# $1 RAID name
# $2 RAID target
# $3 RAID dest

sudo mdadm --create --verbose /dev/$1 --level=mirror --raid-devices=2 /dev/$2 /dev/$3

echo "UUID=394fd8f2-7b2a-474f-8e58-48b81a6ca8fb /mnt ext4 defaults 0 0" >> "/etc/fstab"