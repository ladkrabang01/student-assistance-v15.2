import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Calendar, BookOpen, Award, Home, FileText } from "lucide-react";

export default function StudentHistory() {
  const { data: students } = trpc.students.list.useQuery();
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const historyQuery = trpc.reports.studentHistory.useQuery(
    { studentId: parseInt(selectedStudentId) },
    { enabled: !!selectedStudentId }
  );

  const data = historyQuery.data;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ประวัตินักศึกษา</h1>
          <p className="text-gray-500 mt-1">ดูข้อมูลประวัติการเรียนของนักศึกษา</p>
        </div>

        {/* Student Selection */}
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="เลือกนักศึกษา" />
              </SelectTrigger>
              <SelectContent>
                {students?.map((student) => (
                  <SelectItem key={student.id} value={student.id.toString()}>
                    {student.name} ({student.studentId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Content */}
        {historyQuery.isLoading ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        ) : data ? (
          <>
            {/* Student Info */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>ข้อมูลนักศึกษา</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">ชื่อ</p>
                    <p className="text-lg font-semibold">{data.student?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">รหัสนักศึกษา</p>
                    <p className="text-lg font-semibold">{data.student?.studentId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ชั้น</p>
                    <p className="text-lg font-semibold">{data.student?.level}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="attendance" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="attendance">เช็คชื่อ</TabsTrigger>
                <TabsTrigger value="scores">คะแนน</TabsTrigger>
                <TabsTrigger value="assignments">ใบงาน</TabsTrigger>
                <TabsTrigger value="moral">คุณธรรม</TabsTrigger>
                <TabsTrigger value="homevisits">เยี่ยมบ้าน</TabsTrigger>
              </TabsList>

              {/* Attendance Tab */}
              <TabsContent value="attendance">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>ประวัติการเช็คชื่อ ({data.attendance?.length || 0})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {data.attendance && data.attendance.length > 0 ? (
                        data.attendance.map((record: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <span>{new Date(record.date).toLocaleDateString("th-TH")}</span>
                            </div>
                            <span className={`px-3 py-1 rounded text-sm font-semibold ${
                              record.status === "present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {record.status === "present" ? "มาเรียน" : "ขาดเรียน"}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-4">ไม่มีข้อมูล</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Scores Tab */}
              <TabsContent value="scores">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>คะแนนควิซ ({data.scores?.length || 0})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {data.scores && data.scores.length > 0 ? (
                        data.scores.map((score: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <div>
                              <p className="font-semibold">{score.subject}</p>
                              <p className="text-sm text-gray-600">{new Date(score.date).toLocaleDateString("th-TH")}</p>
                            </div>
                            <span className="text-lg font-bold text-blue-600">{score.score}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-4">ไม่มีข้อมูล</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Assignments Tab */}
              <TabsContent value="assignments">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>ใบงาน ({data.assignments?.length || 0})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {data.assignments && data.assignments.length > 0 ? (
                        data.assignments.map((assignment: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-orange-600" />
                              <div>
                                <p className="font-semibold">{assignment.title}</p>
                                <p className="text-sm text-gray-600">{assignment.description}</p>
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-gray-600">
                              {new Date(assignment.dueDate).toLocaleDateString("th-TH")}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-4">ไม่มีข้อมูล</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Moral Tab */}
              <TabsContent value="moral">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>ประเมินคุณธรรม ({data.moral?.length || 0})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {data.moral && data.moral.length > 0 ? (
                        data.moral.map((record: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-purple-600" />
                              <div>
                                <p className="font-semibold">ประเมินคุณธรรม</p>
                                <p className="text-sm text-gray-600">{new Date(record.date).toLocaleDateString("th-TH")}</p>
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-purple-600">บันทึกแล้ว</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-4">ไม่มีข้อมูล</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Home Visits Tab */}
              <TabsContent value="homevisits">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>เยี่ยมบ้าน ({data.homeVisits?.length || 0})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {data.homeVisits && data.homeVisits.length > 0 ? (
                        data.homeVisits.map((visit: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <Home className="w-4 h-4 text-green-600" />
                              <div>
                                <p className="font-semibold">เยี่ยมบ้าน</p>
                                <p className="text-sm text-gray-600">{new Date(visit.visitDate).toLocaleDateString("th-TH")}</p>
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-green-600">เสร็จสิ้น</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-4">ไม่มีข้อมูล</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
