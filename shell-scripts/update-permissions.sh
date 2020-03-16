#!/bin/bash

# KEY
# $1 comment line
# $2 new permissions line

sed -i '/'$1'/c\'$2'' /etc/samab/smb.conf

path = /home/pi/nas-mount/NAS1         #nas1-path