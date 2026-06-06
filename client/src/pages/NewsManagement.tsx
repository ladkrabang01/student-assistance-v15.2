import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { Plus, Trash2, Edit2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function NewsManagement() {
  const { data: news, refetch } = trpc.news.listAll.useQuery();
  const createMutation = trpc.news.create.useMutation();
  const updateMutation = trpc.news.update.useMutation();
  const deleteMutation = trpc.news.delete.useMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    detailUrl: "",
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
        });
        toast.success("อัปเดตข่าวสารสำเร็จ");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("เพิ่มข่าวสารสำเร็จ");
      }

      setIsOpen(false);
      setEditingId(null);
      setFormData({ title: "", content: "", imageUrl: "", detailUrl: "", isActive: true });
      refetch();
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      title: item.title,
      content: item.content || "",
      imageUrl: item.imageUrl || "",
      detailUrl: item.detailUrl || "",
      isActive: item.isActive,
    });
    setEditingId(item.id);
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("คุณแน่ใจหรือว่าต้องการลบข่าวสารนี้?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("ลบข่าวสารสำเร็จ");
        refetch();
      } catch (error) {
        toast.error("เกิดข้อผิดพลาด");
      }
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      await updateMutation.mutateAsync({
        id,
        isActive: !currentStatus,
      });
      toast.success("อัปเดตสถานะสำเร็จ");
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
            <h1 className="text-3xl font-bold text-gray-900">จัดการข่าวสาร</h1>
            <p className="text-gray-500 mt-1">สร้าง แก้ไข และจัดการข่าวสารของสถานศึกษา</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingId(null);
                  setFormData({ title: "", content: "", imageUrl: "", detailUrl: "", isActive: true });
                }}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                เพิ่มข่าวสาร
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? "แก้ไขข่าวสาร" : "เพิ่มข่าวสารใหม่"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">หัวข้อ *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content">เนื้อหา</Label>
                  <Input
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="เนื้อหาข่าวสาร"
                  />
                </div>

                <div>
                  <Label htmlFor="imageUrl">ลิงก์รูปภาพ</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <Label htmlFor="detailUrl">ลิงก์รายละเอียด</Label>
                  <Input
                    id="detailUrl"
                    type="url"
                    value={formData.detailUrl}
                    onChange={(e) => setFormData({ ...formData, detailUrl: e.target.value })}
                    placeholder="https://example.com/news/detail"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="active">เปิดใช้งาน</Label>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    ยกเลิก
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingId ? "บันทึก" : "เพิ่ม"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* News Grid */}
        <div>
          {!news || news.length === 0 ? (
            <Card className="border-0 shadow-sm border-dashed border-2">
              <CardContent className="pt-12 text-center">
                <p className="text-gray-500">ยังไม่มีข่าวสาร</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300 bg-white border border-gray-200"
                >
                  {/* Image */}
                  {item.imageUrl && (
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {!item.isActive && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-semibold">ปิดใช้งาน</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{item.title}</h3>
                    {item.content && <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.content}</p>}

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>
                        {item.publishDate
                          ? new Date(item.publishDate).toLocaleDateString("th-TH")
                          : "ยังไม่ได้เผยแพร่"}
                      </span>
                      {item.isActive ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <Eye className="w-3 h-3" />
                          เปิด
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-400">
                          <EyeOff className="w-3 h-3" />
                          ปิด
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleActive(item.id, item.isActive ?? true)}
                      >
                        {item.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
