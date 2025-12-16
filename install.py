#!/usr/bin/env python3
"""
اسکریپت نصب خودکار ایمیل موقت
Automatic Installer for Temporary Email Application

این اسکریپت تمام وابستگی‌ها و تنظیمات لازم را به صورت خودکار نصب می‌کند.
"""

import os
import sys
import subprocess
import platform
import secrets
import shutil
from pathlib import Path

# رنگ‌ها برای خروجی ترمینال
class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_header():
    """نمایش هدر برنامه"""
    print(f"""
{Colors.BLUE}{Colors.BOLD}
╔══════════════════════════════════════════════════════════════╗
║           نصب خودکار برنامه ایمیل موقت                      ║
║         Temporary Email Auto Installer                       ║
╚══════════════════════════════════════════════════════════════╝
{Colors.END}
""")

def print_step(step_num, total, message):
    """نمایش مرحله فعلی"""
    print(f"{Colors.BLUE}[{step_num}/{total}]{Colors.END} {message}")

def print_success(message):
    """نمایش پیام موفقیت"""
    print(f"{Colors.GREEN}✓ {message}{Colors.END}")

def print_warning(message):
    """نمایش هشدار"""
    print(f"{Colors.YELLOW}⚠ {message}{Colors.END}")

def print_error(message):
    """نمایش خطا"""
    print(f"{Colors.RED}✗ {message}{Colors.END}")

def run_command(command, description, check=True, shell=True):
    """اجرای دستور و نمایش نتیجه"""
    try:
        result = subprocess.run(
            command,
            shell=shell,
            check=check,
            capture_output=True,
            text=True
        )
        print_success(description)
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        print_error(f"{description}: {e.stderr}")
        return False, e.stderr

def check_root():
    """بررسی دسترسی root"""
    if os.geteuid() != 0:
        print_warning("این اسکریپت نیاز به دسترسی sudo دارد")
        print("لطفاً با دستور زیر اجرا کنید:")
        print(f"  sudo python3 {sys.argv[0]}")
        sys.exit(1)

def check_os():
    """بررسی سیستم عامل"""
    if platform.system() != "Linux":
        print_error("این اسکریپت فقط برای لینوکس طراحی شده است")
        sys.exit(1)
    
    # بررسی توزیع
    try:
        with open("/etc/os-release") as f:
            content = f.read()
            if "ubuntu" in content.lower() or "debian" in content.lower():
                print_success("سیستم عامل: Ubuntu/Debian")
                return "debian"
            elif "centos" in content.lower() or "rhel" in content.lower() or "fedora" in content.lower():
                print_success("سیستم عامل: CentOS/RHEL/Fedora")
                return "rhel"
    except:
        pass
    
    print_warning("توزیع شناسایی نشد، از دستورات Debian استفاده می‌شود")
    return "debian"

def update_system(distro):
    """به‌روزرسانی سیستم"""
    if distro == "debian":
        run_command("apt update && apt upgrade -y", "به‌روزرسانی سیستم")
    else:
        run_command("yum update -y", "به‌روزرسانی سیستم")

def install_dependencies(distro):
    """نصب وابستگی‌های پایه"""
    if distro == "debian":
        packages = "curl git build-essential"
        run_command(f"apt install -y {packages}", "نصب بسته‌های پایه")
    else:
        packages = "curl git gcc-c++ make"
        run_command(f"yum install -y {packages}", "نصب بسته‌های پایه")

def install_nodejs():
    """نصب Node.js"""
    # بررسی نصب بودن Node.js
    success, output = run_command("node -v", "بررسی Node.js", check=False)
    if success and "v" in output:
        print_success(f"Node.js نصب است: {output.strip()}")
        return True
    
    # نصب Node.js 20
    print("در حال نصب Node.js 20...")
    run_command(
        "curl -fsSL https://deb.nodesource.com/setup_20.x | bash -",
        "افزودن مخزن Node.js"
    )
    run_command("apt install -y nodejs", "نصب Node.js")
    
    # بررسی نصب
    success, output = run_command("node -v", "بررسی نسخه Node.js")
    if success:
        print_success(f"Node.js نصب شد: {output.strip()}")
    
    return success

def install_pm2():
    """نصب PM2"""
    success, _ = run_command("pm2 -v", "بررسی PM2", check=False)
    if success:
        print_success("PM2 نصب است")
        return True
    
    run_command("npm install -g pm2", "نصب PM2")
    return True

def install_nginx(distro):
    """نصب Nginx"""
    success, _ = run_command("nginx -v", "بررسی Nginx", check=False)
    if success:
        print_success("Nginx نصب است")
        return True
    
    if distro == "debian":
        run_command("apt install -y nginx", "نصب Nginx")
    else:
        run_command("yum install -y nginx", "نصب Nginx")
    
    run_command("systemctl enable nginx", "فعال‌سازی Nginx")
    run_command("systemctl start nginx", "شروع Nginx")
    return True

def setup_project(install_dir):
    """تنظیم پروژه"""
    project_dir = Path(install_dir)
    
    # ایجاد دایرکتوری
    if not project_dir.exists():
        project_dir.mkdir(parents=True)
        print_success(f"ایجاد دایرکتوری: {install_dir}")
    
    # کپی فایل‌های پروژه
    current_dir = Path(__file__).parent.resolve()
    
    # لیست فایل‌ها و دایرکتوری‌ها برای کپی
    items_to_copy = [
        "client",
        "server", 
        "shared",
        "script",
        "package.json",
        "package-lock.json",
        "tsconfig.json",
        "tailwind.config.ts",
        "postcss.config.js",
        "vite.config.ts",
        "drizzle.config.ts",
        "components.json",
        "UBUNTU_DEPLOYMENT_GUIDE.md"
    ]
    
    for item in items_to_copy:
        src = current_dir / item
        dst = project_dir / item
        
        if src.exists():
            if src.is_dir():
                if dst.exists():
                    shutil.rmtree(dst)
                shutil.copytree(src, dst)
            else:
                shutil.copy2(src, dst)
            print_success(f"کپی: {item}")
    
    return project_dir

def install_npm_dependencies(project_dir):
    """نصب وابستگی‌های npm"""
    os.chdir(project_dir)
    run_command("npm install", "نصب وابستگی‌های npm")
    return True

def build_project(project_dir):
    """ساخت پروژه"""
    os.chdir(project_dir)
    run_command("npm run build", "ساخت پروژه")
    return True

def create_env_file(project_dir):
    """ایجاد فایل .env"""
    env_file = project_dir / ".env"
    
    # تولید کلید تصادفی
    secret_key = secrets.token_hex(32)
    
    env_content = f"""NODE_ENV=production
PORT=5000
SESSION_SECRET={secret_key}
"""
    
    with open(env_file, "w") as f:
        f.write(env_content)
    
    print_success("ایجاد فایل .env")
    return True

def configure_nginx(project_dir, domain="localhost"):
    """تنظیم Nginx"""
    nginx_config = f"""server {{
    listen 80;
    server_name {domain};

    location / {{
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
    }}
}}
"""
    
    nginx_path = Path("/etc/nginx/sites-available/temp-email")
    with open(nginx_path, "w") as f:
        f.write(nginx_config)
    
    # لینک سیمبولیک
    sites_enabled = Path("/etc/nginx/sites-enabled/temp-email")
    if sites_enabled.exists():
        sites_enabled.unlink()
    sites_enabled.symlink_to(nginx_path)
    
    # تست و ریستارت Nginx
    run_command("nginx -t", "بررسی تنظیمات Nginx")
    run_command("systemctl restart nginx", "ریستارت Nginx")
    
    print_success("تنظیم Nginx")
    return True

def setup_pm2(project_dir):
    """تنظیم PM2"""
    os.chdir(project_dir)
    
    # ایجاد فایل ecosystem
    ecosystem = f"""module.exports = {{
  apps: [{{
    name: 'temp-email',
    script: 'npm',
    args: 'start',
    cwd: '{project_dir}',
    env: {{
      NODE_ENV: 'production',
      PORT: 5000
    }},
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M'
  }}]
}};
"""
    
    ecosystem_path = project_dir / "ecosystem.config.js"
    with open(ecosystem_path, "w") as f:
        f.write(ecosystem)
    
    # شروع با PM2
    run_command("pm2 delete temp-email", "حذف نسخه قبلی PM2", check=False)
    run_command(f"pm2 start {ecosystem_path}", "شروع برنامه با PM2")
    run_command("pm2 save", "ذخیره تنظیمات PM2")
    
    # تنظیم startup
    run_command("pm2 startup systemd -u root --hp /root", "تنظیم PM2 startup", check=False)
    
    print_success("تنظیم PM2")
    return True

def configure_firewall():
    """تنظیم فایروال"""
    # بررسی UFW
    success, _ = run_command("ufw status", "بررسی UFW", check=False)
    if success:
        run_command("ufw allow ssh", "اجازه SSH")
        run_command("ufw allow 'Nginx Full'", "اجازه Nginx")
        run_command("ufw --force enable", "فعال‌سازی UFW")
        print_success("تنظیم فایروال")
    else:
        print_warning("UFW نصب نیست، تنظیم فایروال رد شد")

def print_completion(project_dir, domain):
    """نمایش پیام پایان"""
    print(f"""
{Colors.GREEN}{Colors.BOLD}
╔══════════════════════════════════════════════════════════════╗
║                    نصب با موفقیت انجام شد!                   ║
║                 Installation Complete!                        ║
╚══════════════════════════════════════════════════════════════╝
{Colors.END}

{Colors.BOLD}مسیر نصب:{Colors.END} {project_dir}
{Colors.BOLD}آدرس دسترسی:{Colors.END} http://{domain}

{Colors.BOLD}دستورات مفید:{Colors.END}
  pm2 status          # وضعیت برنامه
  pm2 logs temp-email # مشاهده لاگ‌ها
  pm2 restart temp-email # ریستارت برنامه

{Colors.BOLD}برای SSL (HTTPS):{Colors.END}
  sudo apt install certbot python3-certbot-nginx
  sudo certbot --nginx -d {domain}

{Colors.YELLOW}نکته: برای دریافت ایمیل واقعی، باید رکوردهای DNS و MX را تنظیم کنید.{Colors.END}
""")

def main():
    """تابع اصلی"""
    print_header()
    
    # تنظیمات پیش‌فرض
    install_dir = "/var/www/temp-email"
    domain = "localhost"
    
    # پارامترهای خط فرمان
    if len(sys.argv) > 1:
        install_dir = sys.argv[1]
    if len(sys.argv) > 2:
        domain = sys.argv[2]
    
    total_steps = 12
    
    print(f"{Colors.BOLD}مسیر نصب:{Colors.END} {install_dir}")
    print(f"{Colors.BOLD}دامنه:{Colors.END} {domain}")
    print()
    
    # بررسی root
    check_root()
    
    # بررسی سیستم عامل
    print_step(1, total_steps, "بررسی سیستم عامل...")
    distro = check_os()
    
    # به‌روزرسانی سیستم
    print_step(2, total_steps, "به‌روزرسانی سیستم...")
    update_system(distro)
    
    # نصب وابستگی‌ها
    print_step(3, total_steps, "نصب بسته‌های پایه...")
    install_dependencies(distro)
    
    # نصب Node.js
    print_step(4, total_steps, "نصب Node.js...")
    install_nodejs()
    
    # نصب PM2
    print_step(5, total_steps, "نصب PM2...")
    install_pm2()
    
    # نصب Nginx
    print_step(6, total_steps, "نصب Nginx...")
    install_nginx(distro)
    
    # تنظیم پروژه
    print_step(7, total_steps, "کپی فایل‌های پروژه...")
    project_dir = setup_project(install_dir)
    
    # نصب npm
    print_step(8, total_steps, "نصب وابستگی‌های npm...")
    install_npm_dependencies(project_dir)
    
    # ساخت پروژه
    print_step(9, total_steps, "ساخت پروژه...")
    build_project(project_dir)
    
    # ایجاد .env
    print_step(10, total_steps, "ایجاد فایل تنظیمات...")
    create_env_file(project_dir)
    
    # تنظیم Nginx
    print_step(11, total_steps, "تنظیم Nginx...")
    configure_nginx(project_dir, domain)
    
    # تنظیم PM2
    print_step(12, total_steps, "راه‌اندازی برنامه...")
    setup_pm2(project_dir)
    
    # تنظیم فایروال
    configure_firewall()
    
    # پیام پایان
    print_completion(project_dir, domain)

if __name__ == "__main__":
    main()
