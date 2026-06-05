import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { BookOpen, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function RegisterTeacher() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    name: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const registerMutation = trpc.auth.registerTeacher.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password || !formData.name) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setIsLoading(true);
    try {
      await registerMutation.mutateAsync({
        username: formData.username,
        password: formData.password,
        email: formData.email,
        name: formData.name,
      });
      toast.success("สมัครสมาชิกสำเร็จ ไปเข้าสู่ระบบ");
      setLocation("/login/teacher");
    } catch (error: any) {
      toast.error(error.message || "เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50 flex items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">สกร. V15</h1>
        </div>
      </div>

      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => setLocation("/")}
          className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับไปหน้าแรก
        </button>

        {/* Register Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-t-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-white">สมัครสมาชิก - ครู</CardTitle>
                <p className="text-sm text-blue-100 mt-1">สร้างบัญชีใหม่เพื่อเข้าใช้ระบบ</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  ชื่อ-นามสกุล
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="กรอกชื่อ-นามสกุล"
                  value={formData.name}
                  onChange={handleChange}
                  className="border-slate-300 focus:border-blue-500"
                  disabled={isLoading}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  อีเมล (ไม่บังคับ)
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="กรอกอีเมล"
                  value={formData.email}
                  onChange={handleChange}
                  className="border-slate-300 focus:border-blue-500"
                  disabled={isLoading}
                />
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 font-medium">
                  ชื่อผู้ใช้
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="กรอกชื่อผู้ใช้"
                  value={formData.username}
                  onChange={handleChange}
                  className="border-slate-300 focus:border-blue-500"
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  รหัสผ่าน
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="กรอกรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                    value={formData.password}
                    onChange={handleChange}
                    className="border-slate-300 focus:border-blue-500 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                  ยืนยันรหัสผ่าน
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="กรอกรหัสผ่านอีกครั้ง"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="border-slate-300 focus:border-blue-500 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 mt-6"
                disabled={isLoading}
              >
                {isLoading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 pt-6 border-t border-slate-200 text-center">
              <p className="text-sm text-gray-600">
                มีบัญชีแล้ว?{" "}
                <button
                  onClick={() => setLocation("/login/teacher")}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  เข้าสู่ระบบ
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
