+++
title = "Alpine Linux on QEMU with Persistent Storage"
date = 2025-01-29
authors = ["hyouteki"]
description = "A comprehensive guide to setting up Alpine Linux on QEMU with persistent storage and SSH access."
[taxonomies]
tags = ["alpine", "qemu", "virtualization", "linux", "ssh", "blog"]
+++

This blog provides a comprehensive guide to setting up Alpine Linux on QEMU with persistent storage and SSH access.

## Dependencies
1. [Alpine Linux ISO](https://alpinelinux.org/downloads/)
2. [QEMU](https://www.qemu.org/download/)

## Getting Started

### 1. Create a Virtual Disk
To enable persistent storage, create a virtual hard disk:
```bash
qemu-img create -f qcow2 alpine-persistent.qcow2 10G
```

### 2. Run QEMU with ISO and Virtual Disk
Boot Alpine Linux with the installation ISO and attach the virtual disk:
```bash
qemu-system-x86_64 \
  -m 1024 \
  -smp 2 \
  -boot d \
  -cdrom alpine-standard-3.21.2-x86_64.iso \
  -drive file=alpine-persistent.qcow2,format=qcow2 \
  -net nic -net user,hostfwd=tcp::2222-:22 \
  -display gtk
```

### 3. Install Alpine Linux
1. Login with the default credentials i.e. (root,<no_passwd>).
2. Start the setup script via `setup-alpine`.
3. When prompted to select a disk, choose sda (the attached virtual disk).
4. Follow the setup instructions and confirm writing changes to disk.
5. Once installation is complete, reboot the system.

### 4. Enable SSH (Optional)
SSH allows remote access to your VM from the host machine. Start the ssh service and enable for future connections.
```bash
rc-service sshd start
rc-update add sshd
```
You can now connect via SSH using:	
```bash
ssh -p 2222 root@localhost
```
### 5. Boot Installed Alpine Linux
After installation, run QEMU without the ISO:
```bash
qemu-system-x86_64 \
  -m 1024 \
  -smp 2 \
  -drive file=alpine-persistent.qcow2,format=qcow2 \
  -net nic -net user,hostfwd=tcp::2222-:22 \
  -display gtk
```
Now, your Alpine Linux VM is fully set up with persistent storage and SSH access.
