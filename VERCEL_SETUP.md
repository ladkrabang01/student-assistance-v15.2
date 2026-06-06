# Deploy ไป Vercel - ขั้นตอนแก้ไข

## 🔧 ปัญหาเดิม
- ❌ Vercel แสดง Source Code แทนเว็บ
- ❌ ไม่ Build Frontend/Backend

## ✅ วิธีแก้

### ขั้นตอนที่ 1: ลบ Deployment เก่า

1. ไปที่ https://vercel.com/dashboard
2. เลือก Project `student-assistance-v15`
3. ไปที่ Settings → Danger Zone
4. คลิก "Delete Project"

### ขั้นตอนที่ 2: Push Code ใหม่ ไป GitHub

```bash
cd student-assistance-v15

# ถ้ายังไม่ได้ init git
git init
git add .
git commit -m "Fix Vercel deployment"

# ถ้า git มีอยู่แล้ว
git add .
git commit -m "Fix Vercel deployment"
git push origin main
```

### ขั้นตอนที่ 3: Deploy ใหม่ ไป Vercel

1. ไปที่ https://vercel.com/new
2. เลือก "Import Git Repository"
3. เลือก Repository `student-assistance-v15`
4. Vercel จะ Auto-detect Framework (Vite)
5. ไปที่ "Environment Variables"

### ขั้นตอนที่ 4: ตั้ง Environment Variables

เพิ่ม 3 ตัวแปร:

```
DATABASE_URL = mysql://user:password@host:port/database
JWT_SECRET = your-secret-key-here-change-this
NODE_ENV = production
```

**ได้ DATABASE_URL จากไหน:**
- ถ้ายังไม่มี Database ให้สร้างใหม่:
  - ไปที่ https://www.freesqldatabase.com/ (ฟรี)
  - หรือ ใช้ PlanetScale (MySQL ฟรี)

### ขั้นตอนที่ 5: Deploy

1. คลิก "Deploy"
2. รอ Build เสร็จ (ประมาณ 3-5 นาที)
3. ได้ลิงก์เว็บ: `https://student-assistance-v15.vercel.app`

---

## 🌐 เปิดเว็บ

ไปที่: `https://student-assistance-v15.vercel.app`

**คุณจะเห็น:**
- ✓ Landing Page (เลือก ครู/นักศึกษา)
- ✓ Login/Register
- ✓ Dashboard ครู
- ✓ Dashboard นักศึกษา
- ✓ ทั้งหมดทำงาน

---

## 📝 ข้อมูลเข้าสู่ระบบ

**ครู (Admin):**
- Username: `teacher@school.com`
- Password: `teacher123`

**นักศึกษา (User):**
- Username: `student@school.com`
- Password: `student123`

---

## 🔧 ถ้ายังไม่ได้

### ❌ "Build failed"
- ตรวจสอบ Environment Variables ครบ
- ลอง Redeploy

### ❌ "Database connection error"
- ตรวจสอบ DATABASE_URL ถูกต้อง
- ตรวจสอบ Database Server กำลังทำงาน

### ❌ "Still showing code"
- Clear Vercel Cache: Settings → Deployments → Clear Cache
- Redeploy

---

## 🎉 สำเร็จ!

เว็บของคุณพร้อมใช้งาน! 🚀

ลิงก์: `https://student-assistance-v15.vercel.app`
