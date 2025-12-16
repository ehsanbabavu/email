# راهنمای نصب و راه‌اندازی روی سرور اوبونتو
# Ubuntu Server Deployment Guide

## پیش‌نیازها (Prerequisites)

### 1. نصب Node.js

```bash
# به‌روزرسانی پکیج‌ها
sudo apt update && sudo apt upgrade -y

# نصب curl
sudo apt install -y curl

# نصب Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# بررسی نسخه
node -v
npm -v
```

### 2. نصب Git

```bash
sudo apt install -y git
```

### 3. نصب PM2 (مدیر پروسه)

```bash
sudo npm install -g pm2
```

---

## دانلود و نصب پروژه

### 1. کلون کردن پروژه

```bash
# ایجاد دایرکتوری برای پروژه
sudo mkdir -p /var/www
cd /var/www

# کلون کردن پروژه (آدرس ریپازیتوری خود را جایگزین کنید)
sudo git clone <YOUR_REPOSITORY_URL> temp-email
cd temp-email

# تغییر مالکیت به کاربر فعلی
sudo chown -R $USER:$USER /var/www/temp-email
```

### 2. نصب وابستگی‌ها

```bash
npm install
```

### 3. ساخت پروژه

```bash
npm run build
```

---

## تنظیمات متغیرهای محیطی

### 1. ایجاد فایل .env

```bash
nano .env
```

محتوای فایل:

```env
NODE_ENV=production
PORT=5000
SESSION_SECRET=your-very-long-random-secret-key-here
```

برای تولید یک کلید تصادفی:

```bash
openssl rand -hex 32
```

---

## اجرا با PM2

### 1. شروع برنامه

```bash
pm2 start npm --name "temp-email" -- start
```

### 2. ذخیره تنظیمات PM2

```bash
pm2 save
pm2 startup
```

دستور خروجی را کپی و اجرا کنید تا PM2 در هنگام ریبوت سرور به صورت خودکار اجرا شود.

### 3. دستورات مفید PM2

```bash
# مشاهده وضعیت
pm2 status

# مشاهده لاگ‌ها
pm2 logs temp-email

# ریستارت برنامه
pm2 restart temp-email

# توقف برنامه
pm2 stop temp-email

# حذف برنامه
pm2 delete temp-email
```

---

## تنظیمات Nginx (Reverse Proxy)

### 1. نصب Nginx

```bash
sudo apt install -y nginx
```

### 2. ایجاد فایل تنظیمات

```bash
sudo nano /etc/nginx/sites-available/temp-email
```

محتوای فایل:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
```

### 3. فعال‌سازی سایت

```bash
sudo ln -s /etc/nginx/sites-available/temp-email /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## تنظیمات SSL با Let's Encrypt

### 1. نصب Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2. دریافت گواهی SSL

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 3. تمدید خودکار

```bash
sudo crontab -e
```

اضافه کردن خط زیر:

```
0 12 * * * /usr/bin/certbot renew --quiet
```

---

## تنظیمات فایروال

```bash
# فعال‌سازی UFW
sudo ufw enable

# اجازه دسترسی SSH
sudo ufw allow ssh

# اجازه دسترسی HTTP و HTTPS
sudo ufw allow 'Nginx Full'

# بررسی وضعیت
sudo ufw status
```

---

## تنظیمات DNS

در پنل مدیریت دامنه خود، رکوردهای زیر را اضافه کنید:

| نوع | نام | مقدار | TTL |
|-----|-----|-------|-----|
| A | @ | IP سرور شما | 3600 |
| A | www | IP سرور شما | 3600 |

### برای دریافت ایمیل واقعی (اختیاری)

برای دریافت ایمیل‌های واقعی، نیاز به تنظیم رکوردهای MX دارید:

| نوع | نام | مقدار | اولویت |
|-----|-----|-------|--------|
| MX | @ | mail.yourdomain.com | 10 |
| A | mail | IP سرور شما | 3600 |

---

## به‌روزرسانی برنامه

```bash
cd /var/www/temp-email

# دریافت آخرین تغییرات
git pull origin main

# نصب وابستگی‌های جدید
npm install

# ساخت مجدد
npm run build

# ریستارت برنامه
pm2 restart temp-email
```

---

## عیب‌یابی (Troubleshooting)

### مشکل: برنامه بالا نمی‌آید

```bash
# بررسی لاگ‌ها
pm2 logs temp-email --lines 50

# بررسی پورت
sudo lsof -i :5000
```

### مشکل: خطای 502 در Nginx

```bash
# بررسی وضعیت Nginx
sudo systemctl status nginx

# بررسی لاگ‌های Nginx
sudo tail -f /var/log/nginx/error.log
```

### مشکل: مصرف بالای حافظه

```bash
# محدود کردن حافظه PM2
pm2 start npm --name "temp-email" -- start --max-memory-restart 300M
```

---

## نکات امنیتی

1. **همیشه از HTTPS استفاده کنید**
2. **SESSION_SECRET را به یک مقدار قوی و تصادفی تغییر دهید**
3. **دسترسی SSH را فقط با کلید محدود کنید**
4. **به‌روزرسانی‌های امنیتی را به صورت منظم نصب کنید**

```bash
# به‌روزرسانی خودکار امنیتی
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

---

## ساختار پروژه

```
temp-email/
├── client/           # کد فرانت‌اند (React)
├── server/           # کد بک‌اند (Express)
├── shared/           # کد مشترک (Types)
├── dist/             # خروجی ساخته شده
├── package.json      # تنظیمات npm
└── .env              # متغیرهای محیطی
```

---

## پشتیبانی

برای سوالات و مشکلات، یک Issue در ریپازیتوری GitHub ایجاد کنید.

---

**موفق باشید! 🎉**
