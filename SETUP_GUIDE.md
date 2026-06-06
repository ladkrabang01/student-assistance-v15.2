# ระบบช่วยเหลือผู้เรียน สกร. V15 - Setup Guide

## 📋 ข้อกำหนดเบื้องต้น

- Node.js 18+ หรือ 22+
- npm หรือ pnpm
- MySQL 8.0+
- Git (ตัวเลือก)

---

## 🚀 ขั้นตอนการติดตั้ง

### 1. แตกไฟล์ ZIP

```bash
unzip student-assistance-v15-export.zip
cd student-assistance-v15
```

### 2. ติดตั้ง Dependencies

```bash
pnpm install
# หรือ
npm install
```

### 3. ตั้งค่า Database

สร้าง MySQL Database:

```sql
CREATE DATABASE student_assistance_v15 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` ที่ root directory:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/student_assistance_v15"

# JWT Secret (สร้างรหัสสุ่ม)
JWT_SECRET="your-secret-key-here-change-this"

# Server Port
PORT=3000

# Frontend URL (สำหรับ CORS)
FRONTEND_URL="http://localhost:5173"
```

### 5. สร้าง Database Schema

```bash
pnpm db:push
```

หรือ รัน migration ด้วยตนเอง:

```bash
# Generate migration
pnpm drizzle-kit generate

# Apply migration
pnpm drizzle-kit migrate
```

### 6. รัน Development Server

```bash
pnpm dev
```

เปิด http://localhost:5173 ในเบราว์เซอร์

---

## 📱 การใช้งาน

### หน้า Landing
- เลือก "ครู" หรือ "นักศึกษา"
- คลิก "เข้าสู่ระบบ" หรือ "สมัครสมาชิก"

### ครู (Admin)
- **Username:** teacher@school.com
- **Password:** teacher123
- **สิทธิ์:** จัดการนักศึกษา, เช็คชื่อ, ประเมินคุณธรรม, ข่าวสาร ฯลฯ

### นักศึกษา (User)
- **Username:** student@school.com
- **Password:** student123
- **สิทธิ์:** ดูข่าวสาร, ส่งงาน, ดูคะแนน ฯลฯ

---

## 🏗️ Build สำหรับ Production

```bash
pnpm build
pnpm start
```

---

## 📁 โครงสร้างไฟล์

```
student-assistance-v15/
├── client/              # Frontend (React)
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # Reusable components
│   │   ├── lib/        # Utilities
│   │   └── App.tsx     # Main app
│   └── index.html
├── server/             # Backend (Express)
│   ├── routers.ts      # API routes
│   ├── db.ts           # Database queries
│   └── _core/          # Core utilities
├── drizzle/            # Database schema
│   ├── schema.ts       # Table definitions
│   └── migrations/     # SQL migrations
├── package.json
└── README.md
```

---

## 🔧 ปัญหาทั่วไป

### ❌ "Cannot find module 'bcryptjs'"
```bash
pnpm install bcryptjs
```

### ❌ "Database connection failed"
- ตรวจสอบ DATABASE_URL ใน .env
- ตรวจสอบ MySQL Server กำลังทำงาน
- ตรวจสอบ Username/Password

### ❌ "Port 3000 already in use"
```bash
# เปลี่ยน PORT ใน .env
PORT=3001
```

---

## 📚 ฟีเจอร์หลัก

- ✅ Login/Register System (Username/Password)
- ✅ Dashboard ครู + นักศึกษา
- ✅ จัดการนักศึกษา (CRUD)
- ✅ เช็คชื่อพบกลุ่ม
- ✅ ห้องเรียนออนไลน์
- ✅ ประเมินคุณธรรม 11 ด้าน
- ✅ จัดการข่าวสาร
- ✅ บันทึกเยี่ยมบ้าน
- ✅ Export Excel
- ✅ Responsive Design

---

## 🚀 Deploy ไปยัง Production

### Option 1: Railway
1. Push code ไป GitHub
2. Connect GitHub ไป Railway
3. Set environment variables
4. Deploy

### Option 2: Render
1. Push code ไป GitHub
2. Create new Web Service ใน Render
3. Connect GitHub repository
4. Set environment variables
5. Deploy

### Option 3: DigitalOcean App Platform
1. Push code ไป GitHub
2. Create new App ใน DigitalOcean
3. Connect GitHub
4. Configure app.yaml
5. Deploy

---

## 📞 Support

หากมีปัญหา:
1. ตรวจสอบ error message ใน console
2. ดู logs ใน `.manus-logs/` directory
3. ตรวจสอบ database connection
4. ลองรัน `pnpm install` อีกครั้ง

---

## 📝 License

MIT License

---

**สร้างโดย:** Manus AI
**วันที่:** June 5, 2026
