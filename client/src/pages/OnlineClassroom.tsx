import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Plus, BookOpen, Link as LinkIcon, FileDown, Upload } from "lucide-react";
import { toast } from "sonner";

export default function OnlineClassroom() {
  const { data: subjects, isLoading: subjectsLoading } = trpc.subjects.list.useQuery();
  const { data: assignments } = trpc.assignments.getBySubject.useQuery(
    { subjectId: 1 },
    { enabled: false }
  );
  const createSubjectMutation = trpc.subjects.create.useMutation();
  const createAssignmentMutation = trpc.assignments.create.useMutation();

  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [isSubjectOpen, setIsSubjectOpen] = useState(false);
  const [isAssignmentOpen, setIsAssignmentOpen] = useState(false);
  const [subjectForm, setSubjectForm] = useState({
    name: "",
    code: "",
    description: "",
    youtubeUrl: "",
    level: "ม.ต้น",
  });
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    description: "",
    fileUrl: "",
    dueDate: "",
  });

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSubjectMutation.mutateAsync(subjectForm);
      toast.success("เพิ่มวิชาเรียนสำเร็จ");
      setSubjectForm({ name: "", code: "", description: "", youtubeUrl: "", level: "ม.ต้น" });
      setIsSubjectOpen(false);
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject) {
      toast.error("เลือกวิชาเรียนก่อน");
      return;
    }
    try {
      await createAssignmentMutation.mutateAsync({
        subjectId: selectedSubject,
        ...assignmentForm,
      });
      toast.success("เพิ่มใบงานสำเร็จ");
      setAssignmentForm({ title: "", description: "", fileUrl: "", dueDate: "" });
      setIsAssignmentOpen(false);
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
            <h1 className="text-3xl font-bold text-gray-900">ห้องเรียนออนไลน์</h1>
            <p className="text-gray-500 mt-1">วิชาเรียน วิดีโอ และใบงาน</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isSubjectOpen} onOpenChange={setIsSubjectOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  เพิ่มวิชาเรียน
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>เพิ่มวิชาเรียนใหม่</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateSubject} className="space-y-4">
                  <div>
                    <Label htmlFor="name">ชื่อวิชา *</Label>
                    <Input
                      id="name"
                      value={subjectForm.name}
                      onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="code">รหัสวิชา *</Label>
                    <Input
                      id="code"
                      value={subjectForm.code}
                      onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">คำอธิบาย</Label>
                    <Input
                      id="description"
                      value={subjectForm.description}
                      onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="youtubeUrl">ลิงก์วิดีโอ YouTube</Label>
                    <Input
                      id="youtubeUrl"
                      type="url"
                      value={subjectForm.youtubeUrl}
                      onChange={(e) => setSubjectForm({ ...subjectForm, youtubeUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setIsSubjectOpen(false)}>
                      ยกเลิก
                    </Button>
                    <Button type="submit" disabled={createSubjectMutation.isPending}>
                      เพิ่ม
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Subjects Grid */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">วิชาเรียน</h2>
          {subjectsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : !subjects || subjects.length === 0 ? (
            <Card className="border-0 shadow-sm border-dashed border-2">
              <CardContent className="pt-12 text-center">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">ยังไม่มีวิชาเรียน</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject) => (
                <Card
                  key={subject.id}
                  className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedSubject(subject.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    <p className="text-sm text-gray-500">{subject.code}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {subject.description && <p className="text-sm text-gray-600">{subject.description}</p>}

                    {subject.youtubeUrl && (
                      <a
                        href={subject.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                      >
                        <LinkIcon className="w-4 h-4" />
                        ดูวิดีโอ
                      </a>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSubject(subject.id);
                      }}
                    >
                      ดูรายละเอียด
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Selected Subject Details */}
        {selectedSubject && (
          <Tabs defaultValue="assignments" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="assignments">ใบงาน</TabsTrigger>
              <TabsTrigger value="submissions">การส่ง</TabsTrigger>
            </TabsList>

            <TabsContent value="assignments" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">ใบงาน</h3>
                <Dialog open={isAssignmentOpen} onOpenChange={setIsAssignmentOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      เพิ่มใบงาน
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>เพิ่มใบงานใหม่</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateAssignment} className="space-y-4">
                      <div>
                        <Label htmlFor="title">ชื่อใบงาน *</Label>
                        <Input
                          id="title"
                          value={assignmentForm.title}
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">คำอธิบาย</Label>
                        <Input
                          id="description"
                          value={assignmentForm.description}
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="fileUrl">ลิงก์ไฟล์</Label>
                        <Input
                          id="fileUrl"
                          type="url"
                          value={assignmentForm.fileUrl}
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, fileUrl: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="dueDate">วันส่ง</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={assignmentForm.dueDate}
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                        />
                      </div>

                      <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={() => setIsAssignmentOpen(false)}>
                          ยกเลิก
                        </Button>
                        <Button type="submit" disabled={createAssignmentMutation.isPending}>
                          เพิ่ม
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {!assignments || assignments.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">ไม่มีใบงาน</p>
                    ) : (
                      assignments.map((assignment) => (
                        <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                              {assignment.description && (
                                <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                              )}
                              {assignment.dueDate && (
                                <p className="text-xs text-gray-500 mt-2">
                                  วันส่ง: {new Date(assignment.dueDate).toLocaleDateString("th-TH")}
                                </p>
                              )}
                            </div>
                            {assignment.fileUrl && (
                              <a
                                href={assignment.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-4 inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-sm"
                              >
                                <FileDown className="w-4 h-4" />
                                ดาวน์โหลด
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="submissions" className="space-y-4">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>การส่งใบงาน</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 text-center py-8">ฟีเจอร์นี้จะเปิดใช้งานในเร็ว ๆ นี้</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
}
