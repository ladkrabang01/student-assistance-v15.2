import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { BookOpen, Users, LogIn, UserPlus } from "lucide-react";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">สกร. V15</h1>
            <p className="text-sm text-gray-500 ml-auto">ระบบช่วยเหลือผู้เรียน</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ยินดีต้อนรับสู่ระบบช่วยเหลือผู้เรียน
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ระบบจัดการการเรียนการสอนออนไลน์ที่ครบวงจรสำหรับครูและนักศึกษา
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Teacher Section */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-400"></div>
            <CardContent className="pt-8 pb-8">
              <div className="text-center mb-6">
                <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">ครู</h3>
                <p className="text-gray-600 text-sm mt-2">
                  จัดการชั้นเรียน ประเมินผล ติดตามนักศึกษา
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => setLocation("/login/teacher")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
                  size="lg"
                >
                  <LogIn className="w-4 h-4" />
                  เข้าสู่ระบบ
                </Button>
                <Button
                  onClick={() => setLocation("/register/teacher")}
                  variant="outline"
                  className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 gap-2"
                  size="lg"
                >
                  <UserPlus className="w-4 h-4" />
                  สมัครสมาชิก
                </Button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-700 space-y-2">
                <p className="font-semibold text-blue-900">ฟีเจอร์สำหรับครู:</p>
                <ul className="space-y-1 text-xs">
                  <li>✓ แดชบอร์ดสรุปสถิติ</li>
                  <li>✓ จัดการนักศึกษา</li>
                  <li>✓ ประเมินคุณธรรม</li>
                  <li>✓ Export รายงาน</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Student Section */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-purple-600 to-pink-400"></div>
            <CardContent className="pt-8 pb-8">
              <div className="text-center mb-6">
                <div className="inline-flex p-4 bg-purple-100 rounded-full mb-4">
                  <BookOpen className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">นักศึกษา</h3>
                <p className="text-gray-600 text-sm mt-2">
                  เข้าชั้นเรียน ส่งงาน ดูคะแนน
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => setLocation("/login/student")}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2"
                  size="lg"
                >
                  <LogIn className="w-4 h-4" />
                  เข้าสู่ระบบ
                </Button>
                <Button
                  onClick={() => setLocation("/register/student")}
                  variant="outline"
                  className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 gap-2"
                  size="lg"
                >
                  <UserPlus className="w-4 h-4" />
                  สมัครสมาชิก
                </Button>
              </div>

              <div className="mt-6 p-4 bg-purple-50 rounded-lg text-sm text-gray-700 space-y-2">
                <p className="font-semibold text-purple-900">ฟีเจอร์สำหรับนักศึกษา:</p>
                <ul className="space-y-1 text-xs">
                  <li>✓ ดูห้องเรียนออนไลน์</li>
                  <li>✓ ส่งงานและดูคะแนน</li>
                  <li>✓ ดูข่าวสาร</li>
                  <li>✓ ตรวจสอบการเช็คชื่อ</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg border border-slate-200 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลทั่วไป</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div>
              <p className="font-semibold text-gray-900 mb-2">🔒 ปลอดภัย</p>
              <p>ข้อมูลของคุณถูกเก็บอย่างปลอดภัยในระบบ</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-2">⚡ รวดเร็ว</p>
              <p>ระบบออนไลน์ที่ตอบสนองได้ทันที</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-2">📱 ทุกอุปกรณ์</p>
              <p>ใช้ได้บนคอมพิวเตอร์ แท็บเล็ต มือถือ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white/50 mt-16 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-600">
          <p>© 2026 ระบบช่วยเหลือผู้เรียน สกร. V15</p>
        </div>
      </div>
    </div>
  );
}
