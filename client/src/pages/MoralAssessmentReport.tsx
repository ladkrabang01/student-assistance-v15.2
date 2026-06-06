import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { trpc } from "@/lib/trpc";
import { Download } from "lucide-react";
import { toast } from "sonner";

export default function MoralAssessmentReport() {
  const { data: students } = trpc.students.list.useQuery();
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const moralReportQuery = trpc.reports.moralAssessment.useQuery(
    { studentId: parseInt(selectedStudentId) },
    { enabled: !!selectedStudentId }
  );

  const handleExportReport = () => {
    if (!moralReportQuery.data) return;

    const aspects = [
      "cleanliness", "politeness", "gratitude", "diligence", "frugality",
      "honesty", "unity", "compassion", "discipline", "patriotism", "democracy"
    ];

    const csvData = [
      ["รายงานประเมินคุณธรรมนักศึกษา"],
      ["นักศึกษา", moralReportQuery.data.assessments[0]?.studentId || ""],
      [],
      ["ด้านที่", "คะแนนเฉลี่ย"],
      ...aspects.map(aspect => [
        aspect,
        moralReportQuery.data.summary?.[aspect as keyof typeof moralReportQuery.data.summary] || 0
      ])
    ];

    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `moral-assessment-${selectedStudentId}-${Date.now()}.csv`;
    link.click();
    toast.success("ส่งออกรายงานสำเร็จ");
  };

  const chartData = moralReportQuery.data?.summary
    ? Object.entries(moralReportQuery.data.summary).map(([aspect, value]) => ({
        name: aspect,
        value: typeof value === "number" ? value : 0,
      }))
    : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">รายงานประเมินคุณธรรม</h1>
            <p className="text-gray-500 mt-1">ดูรายงานประเมินคุณธรรมของนักศึกษา</p>
          </div>
        </div>

        {/* Student Selection */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>เลือกนักศึกษา</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
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
              {selectedStudentId && (
                <Button onClick={handleExportReport} disabled={moralReportQuery.isLoading} className="gap-2">
                  <Download className="w-4 h-4" />
                  ส่งออก
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Report Content */}
        {moralReportQuery.isLoading ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        ) : moralReportQuery.data ? (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600">จำนวนการประเมิน</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {moralReportQuery.data.assessments.length}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600">ด้านที่ดีที่สุด</p>
                  <p className="text-xl font-bold text-gray-900 mt-2">
                    {moralReportQuery.data.summary
                      ? Object.entries(moralReportQuery.data.summary).reduce((a, b) =>
                          (b[1] as number) > (a[1] as number) ? b : a
                        )[0]
                      : "-"}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600">คะแนนเฉลี่ยรวม</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {moralReportQuery.data.summary
                      ? (
                          Object.values(moralReportQuery.data.summary).reduce(
                            (a: number, b: any) => a + (typeof b === "number" ? b : 0),
                            0
                          ) / Object.keys(moralReportQuery.data.summary).length
                        ).toFixed(2)
                      : "0.00"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Chart */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>กราฟประเมินคุณธรรม</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#a8e6cf" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Detailed Table */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>รายละเอียดการประเมิน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-4 font-semibold">ด้านที่</th>
                        <th className="text-left py-2 px-4 font-semibold">คะแนนเฉลี่ย</th>
                        <th className="text-left py-2 px-4 font-semibold">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chartData.map((row, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-2 px-4">{row.name}</td>
                          <td className="py-2 px-4">{row.value.toFixed(2)}</td>
                          <td className="py-2 px-4">
                            {row.value >= 3.5 ? (
                              <span className="text-green-600 font-semibold">ดีมาก</span>
                            ) : row.value >= 2.5 ? (
                              <span className="text-blue-600 font-semibold">ดี</span>
                            ) : (
                              <span className="text-yellow-600 font-semibold">ปานกลาง</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
