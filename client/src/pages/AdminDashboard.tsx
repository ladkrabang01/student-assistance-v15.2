import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, Users, CheckCircle, FileText, AlertCircle } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";

export default function AdminDashboard() {
  const { data: stats, isLoading } = trpc.statistics.dashboard.useQuery();
  const attendanceReportQuery = trpc.export.attendanceReport.useQuery({});
  const scoresReportQuery = trpc.export.scoresReport.useQuery({});
  const [exporting, setExporting] = useState(false);

  const handleExportExcel = () => {
    setExporting(true);
    try {
      if (!stats) return;

      const workbook = XLSX.utils.book_new();

      // Sheet 1: Summary
      const summaryData = [
        ["ระบบช่วยเหลือผู้เรียน สกร. V15 - รายงานสรุป"],
        [],
        ["สถิติทั่วไป"],
        ["จำนวนนักศึกษาทั้งหมด", stats.totalStudents],
        [],
        ["การมาพบกลุ่มวันนี้"],
        ["มาเรียน", stats.totalAttendance],
        ["ขาดเรียน", 0],
        ["มาสาย", 0],
        ["ลาป่วย/ลากิจ", 0],
        [],
        ["การส่งใบงาน"],
        ["ใบงานทั้งหมด", stats.totalAssignments],
        ["ส่งแล้ว", 0],
        ["ยังไม่ส่ง", 0],
      ];

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, "สรุป");

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      XLSX.writeFile(workbook, `สกร-รายงาน-${timestamp}.xlsx`);
    } finally {
      setExporting(false);
    }
  };

  const handleExportAttendance = async () => {
    try {
      if (attendanceReportQuery.data?.csvContent) {
        const blob = new Blob([attendanceReportQuery.data.csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = attendanceReportQuery.data.fileName || "attendance-report.csv";
        link.click();
      }
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const handleExportScores = async () => {
    try {
      if (scoresReportQuery.data?.csvContent) {
        const blob = new Blob([scoresReportQuery.data.csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = scoresReportQuery.data.fileName || "scores-report.csv";
        link.click();
      }
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const attendanceChartData = [
    { name: "มาเรียน", value: stats?.totalAttendance || 0, fill: "#a8e6cf" },
    { name: "ขาดเรียน", value: 0, fill: "#ffd3b6" },
    { name: "มาสาย", value: 0, fill: "#ffaaa5" },
    { name: "ลาป่วย/ลากิจ", value: 0, fill: "#c7ceea" },
  ];

  const assignmentChartData = [
    { name: "ส่งแล้ว", value: stats?.totalAssignments || 0, fill: "#a8e6cf" },
    { name: "ยังไม่ส่ง", value: 0, fill: "#ffd3b6" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">แดชบอร์ดหลัก</h1>
            <p className="text-gray-500 mt-1">ยินดีต้อนรับกลับมา ครู</p>
          </div>
          <Button onClick={handleExportExcel} disabled={exporting} className="gap-2">
            <Download className="w-4 h-4" />
            {exporting ? "กำลังส่งออก..." : "ส่งออก Excel"}
          </Button>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">นักศึกษาทั้งหมด</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalStudents || 0}</p>
                </div>
                <Users className="w-12 h-12 text-blue-400 opacity-30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">มาเรียนวันนี้</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalAttendance || 0}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-400 opacity-30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">ใบงานรอส่ง</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalAssignments || 0}</p>
                </div>
                <FileText className="w-12 h-12 text-yellow-400 opacity-30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">ขาดเรียน</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalAttendance || 0}</p>
                </div>
                <AlertCircle className="w-12 h-12 text-red-400 opacity-30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Chart */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">สถิติการมาพบกลุ่มวันนี้</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={attendanceChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {attendanceChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Assignment Chart */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">สถิติการส่งใบงาน</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={assignmentChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#a8e6cf" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Export Reports */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">ส่งออกรายงาน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button onClick={handleExportExcel} disabled={exporting} className="gap-2">
                <Download className="w-4 h-4" />
                ส่งออก Excel
              </Button>
              <Button onClick={handleExportAttendance} disabled={attendanceReportQuery.isLoading} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                ส่งออกการเช็คชื่อ
              </Button>
              <Button onClick={handleExportScores} disabled={scoresReportQuery.isLoading} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                ส่งออกคะแนน
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">การกระทำด่วน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Users className="w-5 h-5" />
                <span className="text-xs">จัดการนักศึกษา</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="text-xs">เช็คชื่อพบกลุ่ม</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <FileText className="w-5 h-5" />
                <span className="text-xs">ใบงาน</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <AlertCircle className="w-5 h-5" />
                <span className="text-xs">ประเมินคุณธรรม</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
