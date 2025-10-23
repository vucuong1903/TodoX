import { Toaster, toast } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import ChatAppPage from "./pages/ChatAppPage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AppLayout } from "./components/AppSidebar";
import PlainLayout from "./components/PlainLayout";

function App() {
   return (
      <>
         <BrowserRouter>
            <Routes>
               {/* Nhóm KHÔNG sidebar */}
               <Route element={<PlainLayout />}>
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/signin" element={<SignInPage />} />
               </Route>

               {/* Nhóm CÓ sidebar (chỉ Home hoặc trang bạn chọn) */}
               <Route element={<ProtectedRoute />}>
                  <Route element={<AppLayout />}>
                     <Route path="/" element={<HomePage />} />
                     {/* Nếu muốn thêm các trang khác cũng có sidebar, khai báo tại đây */}
                     {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
                  </Route>

                  {/* Các trang bảo vệ nhưng KHÔNG sidebar để ngoài AppLayout */}
                  {/* <Route path="/chat" element={<ChatAppPage />} /> */}
               </Route>

               <Route path="*" element={<NotFound />} />
            </Routes>
         </BrowserRouter>
         <Toaster position="bottom-right" richColors />
      </>
   );
}

export default App;
