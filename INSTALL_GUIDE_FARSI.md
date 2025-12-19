# راهنمای نصب برنامه ایمیل موقت

## 📋 فهرست مطالب
1. [پیش‌نیازها](#پیش‌نیازها)
2. [دانلود فایل‌ها](#دانلود-فایل‌ها)
3. [نصب کامل](#نصب-کامل)
4. [به‌روزرسانی](#به‌روزرسانی)
5. [راهنمای تنظیمات](#راهنمای-تنظیمات)
6. [حل مشکلات](#حل-مشکلات)

---

## 🔧 پیش‌نیازها

این اسکریپت برای **سرورهای لینوکسی** طراحی شده است:

### سیستم‌های پشتیبانی‌شده:
- ✅ Ubuntu (18.04 و بالاتر)
- ✅ Debian (10 و بالاتر)
- ✅ CentOS / RHEL / Fedora

### الزامات:
- 🖥️ **سرویس اختصاصی یا VPS**
- 🔑 **دسترسی ROOT** یا **توانایی استفاده sudo**
- 📡 **اتصال اینترنت** پایدار
- 💾 **حداقل 512 MB RAM** (پیشنهاد: 1GB+)
- 📦 **حداقل 1 GB فضای خالی**

---

## 📥 دانلود فایل‌ها

### گزینه 1: دانلود از Git
```bash
git clone https://github.com/yourusername/temp-email.git
cd temp-email
```

### گزینه 2: دانلود دستی
```bash
# دانلود فایل install.py
wget https://raw.githubusercontent.com/yourusername/temp-email/main/install.py

# یا استفاده از curl
curl -O https://raw.githubusercontent.com/yourusername/temp-email/main/install.py
```

### بررسی فایل:
```bash
ls -la install.py
```

---

## ⚙️ نصب کامل

### مرحله 1: نصب ساده (تنظیمات پیش‌فرض)
```bash
sudo python3 install.py
```

**این دستور:**
- مسیر نصب: `/var/www/temp-email`
- دامنه: `localhost`
- تمام وابستگی‌ها را نصب می‌کند

---

### مرحله 2: نصب با مشخص کردن مسیر
```bash
sudo python3 install.py /var/www/Email
```

**این دستور:**
- پروژه را در `/var/www/Email` نصب می‌کند
- دامنه: `localhost`

---

### مرحله 3: نصب کامل با تمام پارامترها
```bash
sudo python3 install.py /var/www/Email yourdomain.com
```

**این دستور:**
- مسیر نصب: `/var/www/Email`
- دامنه وب: `yourdomain.com`
- Nginx را برای دامنه تنظیم می‌کند

---

## 📊 مثال‌های عملی

### مثال 1: نصب در مسیر پیش‌فرض
```bash
sudo python3 install.py
```

### مثال 2: نصب برای دامنه ariyabot.ir
```bash
sudo python3 install.py /var/www/Email ariyabot.ir
```

### مثال 3: نصب در مسیر سفارشی
```bash
sudo python3 install.py /home/user/projects/temp-email example.com
```

---

## 🔄 به‌روزرسانی برنامه

### به‌روزرسانی مسیر پیش‌فرض:
```bash
sudo python3 install.py update
```

### به‌روزرسانی مسیر مشخص:
```bash
sudo python3 install.py update /var/www/Email
```

**این دستور:**
- ✅ تغییرات جدید را دریافت می‌کند
- ✅ وابستگی‌ها را به‌روز می‌کند
- ✅ پروژه را دوباره می‌سازد
- ✅ برنامه را ریستارت می‌کند

---

## 🔨 راهنمای تنظیمات

### مشاهده وضعیت برنامه:
```bash
pm2 status
```

### مشاهده لاگ‌های برنامه:
```bash
pm2 logs temp-email
```

### متوقف کردن برنامه:
```bash
pm2 stop temp-email
```

### ریستارت برنامه:
```bash
pm2 restart temp-email
```

### شروع مجدد برنامه:
```bash
pm2 start ecosystem.config.cjs
```

---

## 🔒 فعال‌سازی SSL/HTTPS

### نصب Certbot:
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

### فعال‌سازی SSL:
```bash
sudo certbot --nginx -d yourdomain.com
```

### تجدید خودکار SSL:
```bash
sudo certbot renew --quiet
```

---

## 🌐 تنظیمات DNS

### رکورد A:
```
yourdomain.com  A  192.168.1.100
```

### رکورد MX (برای دریافت ایمیل):
```
yourdomain.com  MX  10  mail.yourdomain.com
```

### رکورد A برای mail:
```
mail.yourdomain.com  A  192.168.1.100
```

---

## 📧 تنظیمات SMTP

### بررسی وضعیت SMTP:
```bash
# بررسی پورت 25
sudo ss -tlnp | grep 25

# بررسی پورت 2525
sudo ss -tlnp | grep 2525
```

### باز کردن پورت‌های SMTP در فایروال:
```bash
# UFW
sudo ufw allow 25/tcp
sudo ufw allow 2525/tcp
sudo ufw allow 587/tcp

# یا برای iptables
sudo iptables -A INPUT -p tcp --dport 25 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 2525 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 587 -j ACCEPT
```

---

## 🐛 حل مشکلات

### مشکل 1: Permission Denied
```bash
chmod +x install.py
sudo python3 install.py
```

### مشکل 2: Python3 نصب نیست
```bash
sudo apt update
sudo apt install python3 python3-pip -y
```

### مشکل 3: npm دستور یافت نشد
```bash
# بررسی Node.js
node -v

# اگر نصب نبود:
sudo apt install curl -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y
```

### مشکل 4: Nginx بند نمی‌شود
```bash
# بررسی پورت 80
sudo lsof -i :80

# اگر فرآیند دیگری استفاده می‌کند
sudo fuser -k 80/tcp

# سپس Nginx را ریستارت کنید
sudo systemctl restart nginx
```

### مشکل 5: PM2 کار نمی‌کند
```bash
# حذف process‌های قدیمی
pm2 delete all

# نصب مجدد
npm install -g pm2

# شروع دوباره
sudo python3 install.py /var/www/Email yourdomain.com
```

### مشکل 6: پورت 5000 در حال استفاده است
```bash
# یافتن فرآیند
sudo lsof -i :5000

# متوقف کردن فرآیند
sudo kill -9 <PID>

# یا
sudo fuser -k 5000/tcp
```

---

## 📊 بررسی وضعیت سیستم

### وضعیت سرویس‌ها:
```bash
# Nginx
sudo systemctl status nginx

# PM2
pm2 status

# Node.js
node -v
npm -v
```

### بررسی فضای دیسک:
```bash
df -h
```

### بررسی مصرف حافظه:
```bash
free -h
```

---

## 📝 فایل‌های مهم

### مسیر پروژه (پیش‌فرض):
```
/var/www/temp-email/
├── client/              # کد فرانت‌اند
├── server/              # کد백‌اند
├── package.json         # وابستگی‌های npm
├── ecosystem.config.cjs # تنظیمات PM2
└── .env                 # متغیرهای محیطی
```

### فایل تنظیمات Nginx:
```bash
/etc/nginx/sites-available/temp-email
/etc/nginx/sites-enabled/temp-email
```

### لاگ‌ها:
```bash
# لاگ‌های PM2
~/.pm2/logs/temp-email-out.log
~/.pm2/logs/temp-email-error.log

# لاگ‌های Nginx
/var/log/nginx/access.log
/var/log/nginx/error.log
```

---

## 🎯 تغییر پورت

### تغییر پورت در .env:
```bash
cd /var/www/Email
nano .env

# تغییر:
PORT=5000  →  PORT=3000
```

### تنظیم Nginx برای پورت جدید:
```bash
sudo nano /etc/nginx/sites-available/temp-email

# تغییر:
proxy_pass http://localhost:5000;  →  proxy_pass http://localhost:3000;

# سپس:
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🚀 نکات مهم

✅ **نکته 1:** همیشه `sudo` استفاده کنید
✅ **نکته 2:** پیش از نصب، بک‌آپ فایل‌های قدیمی بگیرید
✅ **نکته 3:** لاگ‌های را چک کنید: `pm2 logs temp-email`
✅ **نکته 4:** SSL را فعال کنید: `certbot --nginx -d yourdomain.com`
✅ **نکته 5:** DNS را بررسی کنید: `nslookup yourdomain.com`

---

## 📞 کمک و پشتیبانی

اگر مشکل دارید:

1. **لاگ‌ها را بررسی کنید:**
```bash
pm2 logs temp-email
tail -f /var/log/nginx/error.log
```

2. **Nginx را تست کنید:**
```bash
sudo nginx -t
```

3. **پورت‌ها را بررسی کنید:**
```bash
sudo netstat -tlnp | grep LISTEN
```

4. **فایروال را بررسی کنید:**
```bash
sudo ufw status
```

---

## 📄 نسخه: 1.0
**تاریخ آخرین بروزرسانی:** دسامبر 1403

---

**برنامه ایمیل موقت 🚀**
