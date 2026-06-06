import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { BookOpen, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function LoginStudent() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = trpc.auth.loginStudent.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }

    setIsLoading(true);
    try {
      await loginMutation.mutateAsync({ username, password });
      toast.success("เข้าสู่ระบบสำเร็จ");
      setLocation("/student");
    } catch (error: any) {
      console.error("[LoginStudent Error]", error);
      
      let errorMessage = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
      
      if (error?.data?.code === "UNAUTHORIZED") {
        errorMessage = error.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
      } else if (error?.data?.code === "INTERNAL_SERVER_ERROR") {
        errorMessage = "เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-slate-50 to-pink-50 flex items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
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

        {/* Login Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-400 text-white rounded-t-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-white">เข้าสู่ระบบ - นักศึกษา</CardTitle>
                <p className="text-sm text-purple-100 mt-1">ใช้ชื่อผู้ใช้และรหัสผ่านของคุณ</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 font-medium">
                  ชื่อผู้ใช้
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="กรอกชื่อผู้ใช้"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-slate-300 focus:border-purple-500"
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
                    type={showPassword ? "text" : "password"}
                    placeholder="กรอกรหัสผ่าน"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-slate-300 focus:border-purple-500 pr-10"
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

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2"
                disabled={isLoading}
              >
                {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
              </Button>
            </form>

            {/* Register Link */}
            <div className="mt-6 pt-6 border-t border-slate-200 text-center">
              <p className="text-sm text-gray-600">
                ยังไม่มีบัญชี?{" "}
                <button
                  onClick={() => setLocation("/register/student")}
                  className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  สมัครสมาชิก
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg text-sm text-gray-700">
          <p className="font-semibold text-purple-900 mb-2">💡 เคล็ดลับ:</p>
          <p>ถ้าคุณยังไม่มีบัญชี ให้คลิก "สมัครสมาชิก" เพื่อสร้างบัญชีใหม่</p>
        </div>
      </div>
    </div>
  );
}
