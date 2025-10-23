import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { set, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import useAuthStore from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
import { useState } from "react";

const signInSchema = z.object({
   username: z.string().min(3, "Tên đăng nhập bắt buộc phải có"),
   password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

/** @typedef {z.infer<typeof signInSchema>} SignInFormValues */

export function SigninForm({ className, ...props }) {
   const { signIn } = useAuthStore();
   const navigate = useNavigate();
   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
   } = useForm({
      resolver: zodResolver(signInSchema),
   });
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const onSubmit = async (/** @param {SignUpFormValues} data */ data) => {
      const { username, password } = data;
      try {
         await signIn(username, password);
         navigate("/");
      } catch (error) {
         set({ username: null });
      }
   };
   return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
         <Card className="overflow-hidden p-0 border-border">
            <CardContent className="grid p-0 md:grid-cols-2">
               <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-6">
                     {/* Header - logo */}
                     <div className="flex flex-col gap-6 item-center text-center gap-2">
                        <a href="/" className="mx-auto block w-fit text-center">
                           <img src="/logo.svg" alt="logo" />
                        </a>
                        <h1 className="text-2xl font-bold">Chào mừng</h1>
                        <p className="text-muted-foreground text-balance">
                           Đăng nhập vào tài khoản của bạn!
                        </p>
                     </div>

                     {/* username */}
                     <div className="flex flex-col gap-3">
                        <Label htmlFor="username" className="block text-sm">
                           Tên đăng nhập
                        </Label>
                        <Input
                           type="text"
                           id="username"
                           placeholder="username123"
                           {...register("username")}
                        />
                        {errors.username && (
                           <p className="text-destructive text-sm">{errors.username.message}</p>
                        )}
                     </div>

                     {/* password */}
                     <div className="flex flex-col gap-3">
                        <Label htmlFor="password" className="block text-sm">
                           Mật khẩu
                        </Label>
                        <Input type="password" id="password" {...register("password")} />
                        {errors.password && (
                           <p className="text-destructive text-sm">{errors.password.message}</p>
                        )}
                     </div>

                     {/* nút đăng nhập */}
                     <Button type="submit" className="w-full" disabled={isSubmitting}>
                        Đăng nhập
                     </Button>

                     <div className="text-center text-sm">
                        Chưa có tài khoản?{" "}
                        <a href="/signup" className="underline underline-offset-4">
                           Đăng ký
                        </a>
                     </div>
                  </div>
               </form>
               <div className="bg-muted relative hidden md:block">
                  <img
                     src="/placeholder.png"
                     alt="Image"
                     className="absolute top-1/2 -translate-y-1/2 object-cover"
                  />
               </div>
            </CardContent>
         </Card>
         <div className="text-xs text-balance px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offset-4">
            Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a> và{" "}
            <a href="#">Chính sách bảo mật</a> của chúng tôi.
         </div>
      </div>
   );
}
