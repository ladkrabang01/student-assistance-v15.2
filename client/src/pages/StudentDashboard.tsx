import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, Award, Bell, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      await logout();
      setLocation("/");
      toast.success("ออกจากระบบสำเร็จ");
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-slate-50 to-pink-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">สกร. V15</h1>
              <p className="text-sm text-gray-600">ระบบช่วยเหลือผู้เรียน</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-600">นักศึกษา</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ยินดีต้อนรับ, {user?.name}
          </h2>
          <p className="text-gray-600">ดูข้อมูลห้องเรียน คะแนน และข่าวสาร</p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="classroom" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-slate-200">
            <TabsTrigger value="classroom" className="gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">ห้องเรียน</span>
            </TabsTrigger>
            <TabsTrigger value="scores" className="gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">คะแนน</span>
            </TabsTrigger>
            <TabsTrigger value="attendance" className="gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">เช็คชื่อ</span>
            </TabsTrigger>
            <TabsTrigger value="news" className="gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">ข่าวสาร</span>
            </TabsTrigger>
          </TabsList>

          {/* Classroom Tab */}
          <TabsContent value="classroom" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>ห้องเรียนออนไลน์</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      วิชาคณิตศาสตร์
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      บทเรียนและใบงานสำหรับวิชาคณิตศาสตร์
                    </p>
                    <Button variant="outline" size="sm" className="gap-2">
                      <BookOpen className="w-4 h-4" />
                      ดูรายละเอียด
                    </Button>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      วิชาภาษาไทย
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      บทเรียนและใบงานสำหรับวิชาภาษาไทย
                    </p>
                    <Button variant="outline" size="sm" className="gap-2">
                      <BookOpen className="w-4 h-4" />
                      ดูรายละเอียด
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scores Tab */}
          <TabsContent value="scores" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>คะแนนของฉัน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">
                        คณิตศาสตร์ - ควิซที่ 1
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        85/100
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      วันที่ส่ง: 5 มิถุนายน 2566
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">
                        ภาษาไทย - ใบงานที่ 2
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        92/100
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      วันที่ส่ง: 4 มิถุนายน 2566
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>ประวัติการเช็คชื่อ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-gray-900">สัปดาห์ที่ 1 (มิ.ย. 1-5)</span>
                    <span className="text-sm font-semibold text-green-600">
                      ✓ มา 5 วัน
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-gray-900">สัปดาห์ที่ 2 (มิ.ย. 8-12)</span>
                    <span className="text-sm font-semibold text-green-600">
                      ✓ มา 4 วัน
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <span className="text-gray-900">สัปดาห์ที่ 3 (มิ.ย. 15-19)</span>
                    <span className="text-sm font-semibold text-yellow-600">
                      ⚠ มา 3 วัน (ขาด 2 วัน)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>ข่าวสารล่าสุด</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      ประกาศปิดเทอมวันที่ 30 มิถุนายน
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      โรงเรียนจะปิดเทอมวันที่ 30 มิถุนายน 2566 ขอให้นักศึกษาเตรียมตัวให้พร้อม
                    </p>
                    <p className="text-xs text-gray-500">
                      วันที่ 5 มิถุนายน 2566
                    </p>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      กิจกรรมวันเด็กไทย
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      โรงเรียนจะจัดกิจกรรมวันเด็กไทยในวันที่ 10 มิถุนายน ที่สนามกีฬา
                    </p>
                    <p className="text-xs text-gray-500">
                      วันที่ 3 มิถุนายน 2566
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
