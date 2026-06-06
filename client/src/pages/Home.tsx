import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { BookOpen, Users, BarChart3, MessageSquare } from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ยินดีต้อนรับ, {user?.name || "ผู้ใช้"}</h1>
              <p className="text-gray-600 mt-1">ระบบช่วยเหลือผู้เรียน สกร. V15</p>
            </div>
            <Button variant="outline" onClick={() => logout()}>
              ออกจากระบบ
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  แดชบอร์ด
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">ดูสถิติและข้อมูลสรุปของระบบ</p>
                <Button variant="outline" className="w-full">
                  เข้าดู
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  จัดการนักศึกษา
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">เพิ่ม แก้ไข และลบข้อมูลนักศึกษา</p>
                <Button variant="outline" className="w-full">
                  เข้าดู
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  เช็คชื่อพบกลุ่ม
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">บันทึกการมาพบกลุ่มของนักศึกษา</p>
                <Button variant="outline" className="w-full">
                  เข้าดู
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  ข่าวสาร
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">จัดการและดูข่าวสารของสถานศึกษา</p>
                <Button variant="outline" className="w-full">
                  เข้าดู
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900">สกร. V15</div>
          <Button onClick={() => {
            const url = getLoginUrl();
            if (!url) {
              alert('ไม่สามารถเข้าสู่ระบบได้ - ตั้งค่าระบบยังไม่เสร็จสมบูรณ์');
              return;
            }
            window.location.href = url;
          }}>เข้าสู่ระบบ</Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">ระบบช่วยเหลือผู้เรียน สกร. V15</h1>
          <p className="text-lg text-gray-600 mb-8">
            ระบบจัดการการเรียนการสอนออนไลน์ที่ครบวงจร สำหรับครูและนักศึกษา พร้อมแดชบอร์ด จัดการนักศึกษา เช็คชื่อ ห้องเรียนออนไลน์ ประเมินคุณธรรม เยี่ยมบ้าน และข่าวสาร
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
              <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">แดชบอร์ดสรุป</h3>
              <p className="text-sm text-gray-600">ดูสถิติและข้อมูลสรุปแบบเรียลไทม์</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">จัดการนักศึกษา</h3>
              <p className="text-sm text-gray-600">เพิ่ม แก้ไข ลบข้อมูลนักศึกษา</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
              <BookOpen className="w-8 h-8 text-pink-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">ห้องเรียนออนไลน์</h3>
              <p className="text-sm text-gray-600">ดูวิดีโอและส่งใบงาน</p>
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => {
              const url = getLoginUrl();
              if (!url) {
                alert('ไม่สามารถเข้าสู่ระบบได้ - ตั้งค่าระบบยังไม่เสร็จสมบูรณ์');
                return;
              }
              window.location.href = url;
            }}
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            เข้าสู่ระบบ
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-gray-600">
          <p>ระบบช่วยเหลือผู้เรียน สกร. V15 © 2026 - สำหรับศูนย์ส่งเสริมการเรียนรู้</p>
        </div>
      </footer>
    </div>
  );
}
