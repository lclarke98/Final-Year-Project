#!/bin/bash

# KEY
# $1 comment line
# $2 new permissions line

sed -i "/$1/c\ read list=  $2" /etc/samba/smb.conf

