import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, Award, Bell, LogOut, Loader } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { useState } from "react";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const logoutMutation = trpc.auth.logout.useMutation();

  // Fetch student data
  const { data: subjects, isLoading: subjectsLoading } = trpc.subjects.list.useQuery();
  const { data: quizScores, isLoading: scoresLoading } = trpc.quizScores.getByStudent.useQuery(
    { studentId: user?.id || 0 },
    { enabled: !!user?.id }
  );
  const { data: attendance, isLoading: attendanceLoading } = trpc.attendance.getByStudent.useQuery(
    { studentId: user?.id || 0 },
    { enabled: !!user?.id }
  );
  const { data: news, isLoading: newsLoading } = trpc.news.getActive.useQuery();

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
                {subjectsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-5 h-5 animate-spin text-gray-400" />
                  </div>
                ) : subjects && subjects.length > 0 ? (
                  <div className="space-y-4">
                    {subjects.map((subject) => (
                      <div
                        key={subject.id}
                        className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedSubject(subject.id)}
                      >
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {subject.name}
                        </h3>
                        {subject.description && (
                          <p className="text-sm text-gray-600 mb-4">
                            {subject.description}
                          </p>
                        )}
                        {subject.youtubeLink && (
                          <a
                            href={subject.youtubeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                          >
                            <BookOpen className="w-4 h-4" />
                            ดูวิดีโอ
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    ยังไม่มีวิชาเรียน
                  </div>
                )}
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
                {scoresLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-5 h-5 animate-spin text-gray-400" />
                  </div>
                ) : quizScores && quizScores.length > 0 ? (
                  <div className="space-y-4">
                    {quizScores.map((score) => {
                      const percentage = (score.score / score.maxScore) * 100;
                      const color = percentage >= 80 ? "green" : percentage >= 60 ? "yellow" : "red";
                      return (
                        <div key={score.id} className="p-4 bg-slate-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-900">
                              {score.quizName}
                            </span>
                            <span className={`text-lg font-bold text-${color}-600`}>
                              {score.score}/{score.maxScore}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            วันที่: {new Date(score.quizDate).toLocaleDateString("th-TH")}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    ยังไม่มีคะแนน
                  </div>
                )}
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
                {attendanceLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-5 h-5 animate-spin text-gray-400" />
                  </div>
                ) : attendance && attendance.length > 0 ? (
                  <div className="space-y-2">
                    {attendance.map((record) => {
                      const bgColor =
                        record.status === "present"
                          ? "bg-green-50 border-green-200"
                          : record.status === "absent"
                          ? "bg-red-50 border-red-200"
                          : record.status === "late"
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-blue-50 border-blue-200";
                      const textColor =
                        record.status === "present"
                          ? "text-green-600"
                          : record.status === "absent"
                          ? "text-red-600"
                          : record.status === "late"
                          ? "text-yellow-600"
                          : "text-blue-600";
                      const statusLabel =
                        record.status === "present"
                          ? "✓ มา"
                          : record.status === "absent"
                          ? "✗ ขาด"
                          : record.status === "late"
                          ? "⚠ มาสาย"
                          : "ลาป่วย";
                      return (
                        <div
                          key={record.id}
                          className={`flex justify-between items-center p-3 rounded-lg border ${bgColor}`}
                        >
                          <span className="text-gray-900">
                            {new Date(record.attendanceDate).toLocaleDateString("th-TH")}
                          </span>
                          <span className={`text-sm font-semibold ${textColor}`}>
                            {statusLabel}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    ยังไม่มีบันทึกการเช็คชื่อ
                  </div>
                )}
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
                {newsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-5 h-5 animate-spin text-gray-400" />
                  </div>
                ) : news && news.length > 0 ? (
                  <div className="space-y-4">
                    {news.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-40 object-cover rounded-lg mb-3"
                          />
                        )}
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        {item.content && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {item.content}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          วันที่ {new Date(item.publishDate).toLocaleDateString("th-TH")}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    ยังไม่มีข่าวสาร
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
