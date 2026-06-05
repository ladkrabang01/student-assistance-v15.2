import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Plus, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export default function Attendance() {
  const { data: students } = trpc.students.list.useQuery();
  const createMutation = trpc.attendance.create.useMutation();
  const { data: todayAttendance, refetch } = trpc.attendance.getByDate.useQuery({
    date: new Date().toISOString().split("T")[0],
  });

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    status: "present" as const,
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const student = students?.find((s) => s.id === parseInt(formData.studentId));
      if (!student) {
        toast.error("เลือกนักศึกษา");
        return;
      }

      await createMutation.mutateAsync({
        studentId: student.id,
        attendanceDate: selectedDate,
        status: formData.status,
        notes: formData.notes,
      });

      toast.success("บันทึกการมาพบกลุ่มสำเร็จ");
      setFormData({ studentId: "", status: "present", notes: "" });
      setIsOpen(false);
      refetch();
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "absent":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "late":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "excused":
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "present":
        return "มาเรียน";
      case "absent":
        return "ขาดเรียน";
      case "late":
        return "มาสาย";
      case "excused":
        return "ลาป่วย/ลากิจ";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800";
      case "absent":
        return "bg-red-100 text-red-800";
      case "late":
        return "bg-yellow-100 text-yellow-800";
      case "excused":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">เช็คชื่อพบกลุ่ม</h1>
            <p className="text-gray-500 mt-1">บันทึกการมาพบกลุ่มของนักศึกษา</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                บันทึกการมา
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>บันทึกการมาพบกลุ่ม</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="date">วันที่ *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="student">นักศึกษา *</Label>
                  <Select value={formData.studentId} onValueChange={(value) => setFormData({ ...formData, studentId: value })}>
                    <SelectTrigger>
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
                </div>

                <div>
                  <Label htmlFor="status">สถานะ *</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">มาเรียน</SelectItem>
                      <SelectItem value="absent">ขาดเรียน</SelectItem>
                      <SelectItem value="late">มาสาย</SelectItem>
                      <SelectItem value="excused">ลาป่วย/ลากิจ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">หมายเหตุ</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="เช่น ลาป่วย, ไปแข่งขัน, ฯลฯ"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    ยกเลิก
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    บันทึก
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Date Selector */}
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-gray-400" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  refetch();
                }}
                className="max-w-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Attendance Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">มาเรียน</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {todayAttendance?.filter((a) => a.status === "present").length || 0}
                  </p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-400 opacity-30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">ขาดเรียน</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {todayAttendance?.filter((a) => a.status === "absent").length || 0}
                  </p>
                </div>
                <XCircle className="w-10 h-10 text-red-400 opacity-30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">มาสาย</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {todayAttendance?.filter((a) => a.status === "late").length || 0}
                  </p>
                </div>
                <Clock className="w-10 h-10 text-yellow-400 opacity-30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">ลาป่วย/ลากิจ</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {todayAttendance?.filter((a) => a.status === "excused").length || 0}
                  </p>
                </div>
                <CheckCircle className="w-10 h-10 text-blue-400 opacity-30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Records */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>บันทึกการมาพบกลุ่ม - {selectedDate}</CardTitle>
          </CardHeader>
          <CardContent>
            {!todayAttendance || todayAttendance.length === 0 ? (
              <div className="text-center py-8 text-gray-500">ไม่มีบันทึกการมาพบกลุ่มในวันนี้</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead>นักศึกษา</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>หมายเหตุ</TableHead>
                      <TableHead>เวลาบันทึก</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todayAttendance.map((record) => {
                      const student = students?.find((s) => s.id === record.studentId);
                      return (
                        <TableRow key={record.id} className="border-gray-100 hover:bg-gray-50">
                          <TableCell className="font-medium">{student?.name || "ไม่ทราบ"}</TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                              {getStatusIcon(record.status)}
                              {getStatusLabel(record.status)}
                            </div>
                          </TableCell>
                          <TableCell>{record.notes || "-"}</TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {new Date(record.createdAt).toLocaleTimeString("th-TH")}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
