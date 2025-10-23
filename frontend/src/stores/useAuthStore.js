import { create } from "zustand";
import { toast } from "sonner";
import api from "@/lib/axios";
import authService from "@/services/authService";

import { AuthState } from "@/types/store";
import { tr } from "zod/v4/locales";

const useAuthStore = create((set, get) => ({
   accessToken: null,
   user: null,
   loading: false,
   setAccessToken: (token) => {
      set({ accessToken: token });
   },
   clearState: () => {
      set({ accessToken: null, user: null, loading: false });
   },

   signIn: async (username, password) => {
      try {
         set({ loading: true });
         const { accessToken } = await authService.signIn(username, password);
         get().setAccessToken(accessToken);
         await get().fetchMe();
         toast.success("Đăng nhập thành công!");
      } catch (error) {
         console.log(`lỗi ${error}`);
         toast.error(error.response?.data?.message || "Đăng nhập thất bại");
         throw error; // Re-throw the error so the calling function knows it failed
      } finally {
         set({ loading: false });
      }
   },
   signOut: async () => {
      try {
         get().clearState();
         await authService.signOut();
         toast.success("Đăng xuất thành công!");
      } catch (error) {
         console.log(error);
         toast.error(error.response?.data?.message || "Đăng xuất thất bại");
      }
   },
   signUp: async (username, password, email, firstName, lastName) => {
      try {
         set({ loading: true });
         await authService.signUp(username, password, email, firstName, lastName);
         toast.success("Đăng ký thành công! Bạn sẽ đc chuyển sang trang đăng nhập");
      } catch (error) {
         console.log(error);
         toast.error("Đăng ký không thành công");
      } finally {
         set({ loading: false });
      }
   },
   fetchMe: async () => {
      try {
         set({ loading: true });
         const user = await authService.fetchMe();
         set({ user });
      } catch (error) {
         console.log(error);
         set({ user: null, accessToken: null });
         toast.error("Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại");
      } finally {
         set({ loading: false });
      }
   },
   refresh: async () => {
      try {
         set({ loading: true });
         const { user, fetchMe, setAccessToken } = get();
         const accessToken = await authService.refresh();
         setAccessToken(accessToken);
         if (!user) {
            await fetchMe();
         }
      } catch (error) {
         console.log(error);
         // Only show session expired message if it's actually a session/refresh token issue
         // and we're not on the signin page
         const currentPath = window.location.pathname;
         if (
            (error.response?.status === 403 || error.response?.status === 401) &&
            !currentPath.includes("/signin") &&
            !currentPath.includes("/signup")
         ) {
            toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
         }
         get().clearState();
      } finally {
         set({ loading: false });
      }
   },
}));

export default useAuthStore;
