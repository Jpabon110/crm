#!/bin/bash
if [ $# -ne 1 ]; then
    echo ERROR: $0: usage: $0 PATH_TO_FILE_PEM
    exit 1
fi

tar cvfz dist.tgz -C dist .
sudo scp -i $1 -rp dist.tgz ubuntu@ec2-34-215-77-39.us-west-2.compute.amazonaws.com:/home/ubuntu  
