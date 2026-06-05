import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Plus, MapPin, Phone, Home, Calendar } from "lucide-react";
import { toast } from "sonner";

export default function HomeVisit() {
  const { data: students } = trpc.students.list.useQuery();
  const createMutation = trpc.homeVisits.create.useMutation();
  const { data: visits, refetch } = trpc.homeVisits.getByStudent.useQuery(
    { studentId: 0 },
    { enabled: false }
  );

  const [isOpen, setIsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    visitDate: new Date().toISOString().split("T")[0],
    familyInfo: "",
    behavior: "",
    cooperationPlan: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      toast.error("เลือกนักศึกษา");
      return;
    }

    try {
      await createMutation.mutateAsync({
        studentId: selectedStudent,
        ...formData,
      });

      toast.success("บันทึกเยี่ยมบ้านสำเร็จ");
      setIsOpen(false);
      setSelectedStudent(null);
      setFormData({
        visitDate: new Date().toISOString().split("T")[0],
        familyInfo: "",
        behavior: "",
        cooperationPlan: "",
        notes: "",
      });
      refetch();
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">เยี่ยมบ้าน</h1>
            <p className="text-gray-500 mt-1">บันทึกข้อมูลการเยี่ยมบ้านและสภาพครอบครัว</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                เพิ่มการเยี่ยมบ้าน
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>บันทึกการเยี่ยมบ้าน</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Student Selection */}
                <div className="space-y-2">
                  <Label htmlFor="student">นักศึกษา *</Label>
                  <Select value={selectedStudent?.toString() || ""} onValueChange={(v) => setSelectedStudent(parseInt(v))}>
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

                {/* Visit Date */}
                <div className="space-y-2">
                  <Label htmlFor="date">วันที่เยี่ยมบ้าน *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.visitDate}
                    onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                    required
                  />
                </div>

                {/* Family Info */}
                <div className="space-y-2">
                  <Label htmlFor="familyInfo">ข้อมูลครอบครัว</Label>
                  <Input
                    id="familyInfo"
                    value={formData.familyInfo}
                    onChange={(e) => setFormData({ ...formData, familyInfo: e.target.value })}
                    placeholder="สภาพครอบครัว สถานะเศรษฐกิจ ผู้ปกครอง ฯลฯ"
                  />
                </div>

                {/* Behavior */}
                <div className="space-y-2">
                  <Label htmlFor="behavior">พฤติกรรมและการวิเคราะห์</Label>
                  <Input
                    id="behavior"
                    value={formData.behavior}
                    onChange={(e) => setFormData({ ...formData, behavior: e.target.value })}
                    placeholder="พฤติกรรมของนักศึกษา ปัญหาที่พบ การวิเคราะห์"
                  />
                </div>

                {/* Cooperation Plan */}
                <div className="space-y-2">
                  <Label htmlFor="cooperationPlan">แผนความร่วมมือ</Label>
                  <Input
                    id="cooperationPlan"
                    value={formData.cooperationPlan}
                    onChange={(e) => setFormData({ ...formData, cooperationPlan: e.target.value })}
                    placeholder="แผนการแก้ไข ความร่วมมือกับผู้ปกครอง"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">หมายเหตุเพิ่มเติม</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="บันทึกอื่น ๆ"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    ยกเลิก
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || !selectedStudent}>
                    บันทึก
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Home className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">ทั้งหมด</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">เดือนนี้</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">ยังไม่เยี่ยม</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Visits */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>ประวัติการเยี่ยมบ้านล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-center text-gray-500 py-8">ยังไม่มีบันทึกการเยี่ยมบ้าน</p>
            </div>
          </CardContent>
        </Card>

        {/* Guidelines */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-amber-50 to-orange-50">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">แนวทางการเยี่ยมบ้าน</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• เยี่ยมบ้านเพื่อสร้างสัมพันธ์ที่ดีกับครอบครัว</li>
                <li>• สำรวจสภาพครอบครัว สถานะเศรษฐกิจ และสภาพแวดล้อม</li>
                <li>• ศึกษาพฤติกรรมและปัญหาของนักศึกษา</li>
                <li>• วางแผนความร่วมมือเพื่อแก้ไขปัญหา</li>
                <li>• บันทึกข้อมูลอย่างละเอียดและเป็นระบบ</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
