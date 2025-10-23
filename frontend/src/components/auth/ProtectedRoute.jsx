import useAuthStore from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";

const ProtectedRoute = () => {
   const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();
   const [starting, setstarting] = useState(true)
   const location = useLocation();
   
   const init = async () => {
      // Only try to refresh if we're not on auth pages and there's no access token
      if (!accessToken && !location.pathname.includes('/signin') && !location.pathname.includes('/signup')) {
         try {
            await refresh()
         } catch (error) {
            // If refresh fails, just continue without showing additional error messages
            console.log('Refresh failed in ProtectedRoute:', error);
         }
      }
      // Only fetch user data if we have a valid access token
      if (accessToken && !user) {
         try {
            await fetchMe()
         } catch (error) {
            // If fetchMe fails, clear the invalid token
            console.log('FetchMe failed in ProtectedRoute:', error);
         }
      }
      setstarting(false)
   }
   
   useEffect(() => {
      init()
   }, [location.pathname]) // Add location.pathname as dependency
   
   if (starting || loading) {
      return <div className="flex h-screen items-center justify-center">Đang tải trang...</div>
   }
   if (!accessToken) {
      return <Navigate to="/signin" replace />;
   }
   return <Outlet></Outlet>;
};

export default ProtectedRoute;
