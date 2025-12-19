# Quick Start Installation Guide

## 🚀 Installation in 3 Steps

### Step 1: Connect to Your Server
```bash
ssh root@your-server-ip
# or
ssh user@your-server-ip
```

### Step 2: Download the Script
```bash
git clone https://github.com/yourusername/temp-email.git
cd temp-email
```

### Step 3: Run Installation
```bash
# Simple installation
sudo python3 install.py

# OR with custom path and domain
sudo python3 install.py /var/www/Email yourdomain.com
```

---

## 📋 Command Reference

| Command | Purpose |
|---------|---------|
| `sudo python3 install.py` | Install with defaults |
| `sudo python3 install.py /path/to/install` | Install to custom path |
| `sudo python3 install.py /path yourdomain.com` | Full installation |
| `sudo python3 install.py update /path` | Update existing installation |
| `sudo python3 install.py --help` | Show help |

---

## ✅ What Gets Installed

The script automatically installs:
- ✅ Node.js 20
- ✅ npm dependencies
- ✅ Nginx web server
- ✅ PM2 process manager
- ✅ UFW firewall rules
- ✅ SSL/HTTPS support (optional)

---

## 🔍 After Installation

### Check Status
```bash
pm2 status
```

### View Logs
```bash
pm2 logs temp-email
```

### Access Your App
```
http://yourdomain.com
```

---

## 🔐 Enable SSL/HTTPS

```bash
sudo certbot --nginx -d yourdomain.com
```

---

## 🆘 Troubleshooting

### Check if services are running
```bash
sudo systemctl status nginx
pm2 status
```

### View detailed logs
```bash
pm2 logs temp-email --lines 100
tail -f /var/log/nginx/error.log
```

### Restart application
```bash
pm2 restart temp-email
```

---

## 📱 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Permission denied | Use `sudo` before the command |
| Python3 not found | `sudo apt install python3 -y` |
| nginx: bind error | `sudo fuser -k 80/tcp` then restart |
| Port 5000 in use | `sudo fuser -k 5000/tcp` |
| PM2 won't start | `pm2 delete all` then reinstall |

---

## 📚 Full Documentation

See `INSTALL_GUIDE_FARSI.md` for detailed Persian instructions with all advanced options.

---

**Ready to deploy? Run: `sudo python3 install.py`** 🚀
