import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { trpc } from "@/lib/trpc";
import { Plus, Heart, Award } from "lucide-react";
import { toast } from "sonner";

const MORAL_DIMENSIONS = [
  { key: "cleanliness", label: "ความสะอาด", description: "ความเป็นระเบียบเรียบร้อย" },
  { key: "politeness", label: "ความสุภาพ", description: "การแสดงออกที่สุภาพ" },
  { key: "gratitude", label: "ความกตัญญู", description: "การขอบคุณและรู้จักบุญ" },
  { key: "diligence", label: "ความขยัน", description: "ความตั้งใจและหมั่นเพียร" },
  { key: "frugality", label: "ความออม", description: "การใช้จ่ายอย่างประหยัด" },
  { key: "honesty", label: "ความสัตย์", description: "การพูดจริงและไม่โกหก" },
  { key: "unity", label: "ความเป็นน้อย", description: "การรักษาความสามัคคี" },
  { key: "compassion", label: "ความเมตตา", description: "ความเห็นอกเห็นใจ" },
  { key: "discipline", label: "ความวินัย", description: "การปฏิบัติตามกฎเกณฑ์" },
  { key: "patriotism", label: "ความรักชาติ", description: "ความภักดีต่อชาติ" },
  { key: "democracy", label: "ความเป็นประชาธิปไตย", description: "การเคารพสิทธิของผู้อื่น" },
];

export default function MoralAssessment() {
  const { data: students } = trpc.students.list.useQuery();
  const createMutation = trpc.moralAssessment.create.useMutation();
  const { data: assessments, refetch } = trpc.moralAssessment.getByStudent.useQuery(
    { studentId: 0 },
    { enabled: false }
  );

  const [isOpen, setIsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [assessmentDate, setAssessmentDate] = useState(new Date().toISOString().split("T")[0]);
  const [scores, setScores] = useState<Record<string, number>>({
    cleanliness: 3,
    politeness: 3,
    gratitude: 3,
    diligence: 3,
    frugality: 3,
    honesty: 3,
    unity: 3,
    compassion: 3,
    discipline: 3,
    patriotism: 3,
    democracy: 3,
  });
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      toast.error("เลือกนักศึกษา");
      return;
    }

    try {
      await createMutation.mutateAsync({
        studentId: selectedStudent,
        assessmentDate,
        cleanliness: scores.cleanliness,
        politeness: scores.politeness,
        gratitude: scores.gratitude,
        diligence: scores.diligence,
        frugality: scores.frugality,
        honesty: scores.honesty,
        unity: scores.unity,
        compassion: scores.compassion,
        discipline: scores.discipline,
        patriotism: scores.patriotism,
        democracy: scores.democracy,
        notes,
      });

      toast.success("บันทึกการประเมินคุณธรรมสำเร็จ");
      setIsOpen(false);
      setSelectedStudent(null);
      setNotes("");
      setScores({
        cleanliness: 3,
        politeness: 3,
        gratitude: 3,
        diligence: 3,
        frugality: 3,
        honesty: 3,
        unity: 3,
        compassion: 3,
        discipline: 3,
        patriotism: 3,
        democracy: 3,
      });
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  const averageScore =
    Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ประเมินคุณธรรม</h1>
            <p className="text-gray-500 mt-1">ประเมินคุณธรรมนักศึกษา 11 ด้าน ตามมาตรฐาน สกร.</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                เพิ่มการประเมิน
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>ประเมินคุณธรรมนักศึกษา</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
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

                {/* Assessment Date */}
                <div className="space-y-2">
                  <Label htmlFor="date">วันที่ประเมิน *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={assessmentDate}
                    onChange={(e) => setAssessmentDate(e.target.value)}
                    required
                  />
                </div>

                {/* Moral Dimensions */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">ประเมินคุณธรรม 11 ด้าน</h3>
                  <p className="text-sm text-gray-600">ให้คะแนน 1-5 (1=ต่ำสุด, 5=สูงสุด)</p>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {MORAL_DIMENSIONS.map((dimension) => (
                      <div key={dimension.key} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{dimension.label}</p>
                            <p className="text-xs text-gray-500">{dimension.description}</p>
                          </div>
                          <span className="text-lg font-bold text-blue-600">{scores[dimension.key]}</span>
                        </div>
                        <Slider
                          value={[scores[dimension.key]]}
                          onValueChange={(value) =>
                            setScores({ ...scores, [dimension.key]: value[0] })
                          }
                          min={1}
                          max={5}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>ต่ำ</span>
                          <span>สูง</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Average Score */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">คะแนนเฉลี่ย</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{averageScore.toFixed(2)} / 5.00</p>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">หมายเหตุ</Label>
                  <Input
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="บันทึกเพิ่มเติมเกี่ยวกับนักศึกษา"
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

        {/* Information Card */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Heart className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">มาตรฐานการประเมินคุณธรรม สกร.</h3>
                <p className="text-sm text-gray-600">
                  ระบบนี้ประเมินคุณธรรมนักศึกษาตามมาตรฐาน 11 ด้าน ได้แก่ ความสะอาด ความสุภาพ ความกตัญญู ความขยัน ความออม ความสัตย์ ความเป็นน้อย ความเมตตา ความวินัย ความรักชาติ และความเป็นประชาธิปไตย
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Assessments */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>การประเมินล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-500 py-8">ฟีเจอร์นี้จะแสดงการประเมินล่าสุดในเร็ว ๆ นี้</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
