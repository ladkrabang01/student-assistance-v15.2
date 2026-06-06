import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Plus, Edit2, Trash2, Search, Upload } from "lucide-react";
import { toast } from "sonner";

export default function StudentManagement() {
  const { data: students, isLoading, refetch } = trpc.students.list.useQuery();
  const createMutation = trpc.students.create.useMutation();
  const updateMutation = trpc.students.update.useMutation();
  const deleteMutation = trpc.students.delete.useMutation();
  const uploadProfileMutation = trpc.storage.uploadStudentProfile.useMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    level: "ประถม",
    pin: "",
    phone: "",
    parentName: "",
    parentPhone: "",
    address: "",
    classTeacher: "",
  });

  const filteredStudents = students?.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.includes(searchTerm)
  ) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let studentIdForUpload = editingId;

      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
        });
        toast.success("อัปเดตข้อมูลนักศึกษาสำเร็จ");
      } else {
        await createMutation.mutateAsync(formData);
        // Get the last created student ID from the list
        const allStudents = await refetch();
        if (allStudents.data && allStudents.data.length > 0) {
          studentIdForUpload = allStudents.data[allStudents.data.length - 1].id;
        }
        toast.success("เพิ่มนักศึกษาใหม่สำเร็จ");
      }

      // Upload profile image if provided
      if (profileImage && studentIdForUpload) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const base64 = event.target?.result as string;
          try {
            await uploadProfileMutation.mutateAsync({
              studentId: studentIdForUpload!,
              imageData: base64.split(",")[1] || base64,
            });
            toast.success("อัปโหลดรูปโปรไฟล์สำเร็จ");
          } catch (error) {
            toast.error("เกิดข้อผิดพลาดในการอัปโหลดรูป");
          }
        };
        reader.readAsDataURL(profileImage);
      }

      setIsOpen(false);
      setEditingId(null);
      setProfileImage(null);
      setFormData({
        studentId: "",
        name: "",
        level: "ประถม",
        pin: "",
        phone: "",
        parentName: "",
        parentPhone: "",
        address: "",
        classTeacher: "",
      });
      refetch();
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  const handleEdit = (student: any) => {
    setFormData({
      studentId: student.studentId,
      name: student.name,
      level: student.level,
      pin: student.pin,
      phone: student.phone || "",
      parentName: student.parentName || "",
      parentPhone: student.parentPhone || "",
      address: student.address || "",
      classTeacher: student.classTeacher || "",
    });
    setEditingId(student.id);
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("คุณแน่ใจหรือว่าต้องการลบนักศึกษานี้?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("ลบนักศึกษาสำเร็จ");
        refetch();
      } catch (error) {
        toast.error("เกิดข้อผิดพลาด");
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">จัดการนักศึกษา</h1>
            <p className="text-gray-500 mt-1">เพิ่ม แก้ไข และลบข้อมูลนักศึกษา</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingId(null);
                  setProfileImage(null);
                  setFormData({
                    studentId: "",
                    name: "",
                    level: "ประถม",
                    pin: "",
                    phone: "",
                    parentName: "",
                    parentPhone: "",
                    address: "",
                    classTeacher: "",
                  });
                }}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                เพิ่มนักศึกษาใหม่
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? "แก้ไขนักศึกษา" : "เพิ่มนักศึกษาใหม่"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="studentId">รหัสนักศึกษา *</Label>
                    <Input
                      id="studentId"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      disabled={!!editingId}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">ชื่อนักศึกษา *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="level">ชั้น *</Label>
                    <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ประถม">ประถมศึกษา</SelectItem>
                        <SelectItem value="ม.ต้น">มัธยมศึกษาตอนต้น</SelectItem>
                        <SelectItem value="ม.ปลาย">มัธยมศึกษาตอนปลาย</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pin">PIN (รหัสผ่าน) *</Label>
                    <Input
                      id="pin"
                      type="password"
                      value={formData.pin}
                      onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">เบอร์โทร</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="parentName">ชื่อผู้ปกครอง</Label>
                    <Input
                      id="parentName"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="parentPhone">เบอร์โทรผู้ปกครอง</Label>
                    <Input
                      id="parentPhone"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="classTeacher">ครูประจำกลุ่ม</Label>
                    <Input
                      id="classTeacher"
                      value={formData.classTeacher}
                      onChange={(e) => setFormData({ ...formData, classTeacher: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">ที่อยู่</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="profileImage">รูปโปรไฟล์</Label>
                  <div className="flex gap-2">
                    <Input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                    />
                    {profileImage && <span className="text-sm text-green-600">{profileImage.name}</span>}
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    ยกเลิก
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending || uploadProfileMutation.isPending}>
                    {editingId ? "บันทึก" : "เพิ่ม"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="ค้นหาตามชื่อหรือรหัสนักศึกษา..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>รายชื่อนักศึกษา ({filteredStudents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">ไม่พบข้อมูลนักศึกษา</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead>รหัสนักศึกษา</TableHead>
                      <TableHead>ชื่อ</TableHead>
                      <TableHead>ชั้น</TableHead>
                      <TableHead>เบอร์โทร</TableHead>
                      <TableHead>ผู้ปกครอง</TableHead>
                      <TableHead className="text-right">การกระทำ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id} className="border-gray-100 hover:bg-gray-50">
                        <TableCell className="font-medium">{student.studentId}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.level}</TableCell>
                        <TableCell>{student.phone || "-"}</TableCell>
                        <TableCell>{student.phone ? "ผู้ปกครอง" : "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(student)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(student.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
