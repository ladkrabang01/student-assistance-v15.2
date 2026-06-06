# ระบบช่วยเหลือผู้เรียน สกร. V15 - TODO

## Database & Schema
- [x] สร้างตาราง students (รหัสนักศึกษา, ชื่อ, ชั้น, PIN, รูป, ข้อมูลส่วนตัว)
- [x] สร้างตาราง attendance (บันทึกการมาพบกลุ่ม)
- [x] สร้างตาราง quiz_scores (คะแนนควิซ)
- [x] สร้างตาราง assignments (ใบงาน)
- [x] สร้างตาราง moral_assessment (ประเมินคุณธรรม 11 ด้าน)
- [x] สร้างตาราง home_visits (เยี่ยมบ้าน)
- [x] สร้างตาราง news (ข่าวสาร)
- [x] สร้างตาราง subjects (วิชาเรียน)

## Dashboard (Admin/Teacher)
- [x] สร้างหน้า Dashboard หลักแสดงสถิติสรุป
- [x] แสดงจำนวนนักศึกษาทั้งหมด
- [x] แสดงสถิติการมาพบกลุ่ม (ปัจจุบัน/สัปดาห์)
- [x] แสดงสถิติคะแนนควิซเฉลี่ย
- [x] แสดงสถิติการส่งใบงาน
- [x] สร้างปุ่ม Export Excel สำหรับแต่ละสถิติ
- [x] สร้างกราฟแสดงข้อมูลสถิติ

## Student Management (Admin)
- [x] สร้างหน้าจัดการนักศึกษา (List)
- [x] เพิ่มนักศึกษาใหม่ (Create)
- [x] แก้ไขข้อมูลนักศึกษา (Update)
- [x] ลบนักศึกษา (Delete)
- [x] อัปโหลดรูปโปรไฟล์นักศึกษา
- [x] จัดการรหัสผ่าน/PIN ของนักศึกษา
- [x] แสดงประวัติข้อมูลส่วนตัว

## Attendance System
- [x] สร้างหน้าเช็คชื่อพบกลุ่ม (Teacher View)
- [x] สร้างหน้าเช็คชื่อพบกลุ่ม (Student View)
- [x] บันทึกการมาพบกลุ่มรายสัปดาห์
- [x] แสดงประวัติการมาพบกลุ่มย้อนหลัง
- [x] สร้างฟังก์ชัน Export ประวัติการมา

## Online Classroom
- [x] สร้างหน้าห้องเรียนออนไลน์
- [x] แสดงรายวิชา
- [x] ผูกลิงค์วิดโอ YouTube
- [x] สร้างปุ่มส่งใบงานแยกตามรหัสนักศึกษา
- [x] แสดงรายชื่อนักศึกษาที่ส่งใบงาน
- [x] อนุญาตให้นักศึกษาดาวน์โหลดใบงาน

## Moral Assessment (11 Aspects)
- [x] สร้างหน้าประเมินคุณธรรม
- [x] 1. สะอาด (Cleanliness)
- [x] 2. สุภาพ (Politeness)
- [x] 3. กตัญญูกตเวที (Gratitude)
- [x] 4. ขยัน (Diligence)
- [x] 5. ประหยัด (Frugality)
- [x] 6. ซื่อสัตย์ (Honesty)
- [x] 7. สามัคคี (Unity)
- [x] 8. มีน้ำใจ (Compassion)
- [x] 9. วินัย (Discipline)
- [x] 10. รักชาติ ศาสน์ กษัตริย์ (Patriotism)
- [x] 11. ประชาธิปไตย (Democracy)
- [x] บันทึกคะแนนประเมินต่อนักศึกษา
- [x] แสดงรายงานประเมินคุณธรรม

## Home Visit & Notes
- [x] สร้างหน้าบันทึกเยี่ยมบ้าน
- [x] บันทึกข้อมูลครอบครัว
- [x] บันทึกพฤติกรรมและการวิเคราะห์
- [x] บันทึกแผนความร่วมมือ
- [x] อัปโหลดรูปภาพเยี่ยมบ้าน
- [x] แสดงประวัติการเยี่ยมบ้าน

## News & Announcements
- [x] สร้างหน้าจัดการข่าวสาร (Admin)
- [x] เพิ่มข่าวสารใหม่
- [x] แก้ไขข่าวสาร
- [x] ลบข่าวสาร
- [x] แสดงข่าวสารบนหน้าหลัก (Student View)
- [x] เพิ่ม Animation บนการ์ดข่าว

## Authentication & Authorization (Login/Register System)
- [x] ตั้งค่า Role-based Access Control (Admin vs User)
- [x] ครู = admin, นักศึกษา = user
- [x] ตรวจสอบสิทธิ์ในแต่ละหน้า
- [x] ป้องกันการเข้าถึงที่ไม่ได้รับอนุญาต
- [x] สร้าง Landing Page (เลือก ครู/นักศึกษา)
- [x] สร้าง Login Pages (ครู + นักศึกษา)
- [x] สร้าง Register Pages (ครู + นักศึกษา)
- [x] Backend API (Login/Register + Password Hash)
- [x] สร้าง StudentDashboard (แยกจาก Admin)
- [x] สร้าง AdminDashboard (แยกจาก Student)

## UI/UX Design
- [x] ปรับแต่ง Theme Scandinavian (pale cool gray)
- [x] ตั้งค่า Typography (sans-serif bold black + light subtitle)
- [x] เพิ่มรูปทรงเรขาคณิตนามธรรม (soft pastel blue + blush pink)
- [x] เพิ่ม Negative space ที่กว้างขวาง
- [x] ปรับแต่ง DashboardLayout สำหรับครู
- [x] สร้าง Navigation เหมาสมควรเหมาสมควรนักศึกษา
- [x] เพิ่ม Animation บนการ์ดข่าว
- [x] ทดสอบ Responsive Design

## Testing & Deployment
- [x] เขียน Unit Tests สำหรับ API (17 tests)
- [x] ทดสอบ CRUD Operations
- [x] ทดสอบ Authentication Flow
- [x] ทดสอบ Export Excel
- [x] ทดสอบ UI/UX บนอุปกรณ์ต่างๆ
- [x] ทดสอบ Performance
- [x] Deploy ให้พร้อมใช้งาน (Live URL)
- [x] สร้าง Checkpoint สำหรับ Publish (3 checkpoints)
