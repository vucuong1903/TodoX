import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarInset,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarProvider,
   SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Home, Package, LayoutDashboard, Cog, Layers, FileText } from "lucide-react";
import { NavLink } from "react-router";
import useAuthStore from "@/stores/useAuthStore";
import Logout from "./auth/Logout";
import { Outlet } from "react-router";

const items = [
   { to: "/", label: "Home", icon: Home },
   { to: "/products", label: "Products", icon: Package },
   { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
   { to: "/setting", label: "Setting", icon: Cog },
   { to: "/log", label: "Log", icon: Layers },
   { to: "/report", label: "Report", icon: FileText },
];

export function AppLayout({ children }) {
   return (
      <SidebarProvider>
         <div className="flex h-screen w-screen overflow-hidden">
            {" "}
            {/* ✅ thêm h-screen */}
            <AppSidebar />
            <SidebarInset className="flex flex-col flex-1">
               {/* Header */}
               <header className="sticky top-0 z-10 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40">
                  <div className="flex h-12 items-center gap-2 px-3">
                     <SidebarTrigger />
                     <Separator orientation="vertical" className="mx-1 h-6" />
                     <h1 className="text-sm font-medium">TodoX</h1>
                  </div>
               </header>

               {/* Nội dung chính */}
               <main className="flex-1 flex items-center justify-center bg-gray-50 p-0 m-0 overflow-hidden">
                  {/* ✅ full chiều cao & căn giữa nội dung */}
                  <Outlet />
                  {children}
               </main>
            </SidebarInset>
         </div>
      </SidebarProvider>
   );
}

function AppSidebar() {
   const user = useAuthStore((s) => s.user);
   // (tuỳ chọn) nếu có hàm logout: const signOut = useAuthStore((s) => s.logout)

   const name = user?.username || user?.name || "User";
   const email = user?.email || "—";
   const initials = name || "U";

   return (
      <Sidebar>
         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupLabel>Menu</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {items.map((it) => (
                        <SidebarMenuItem key={it.to}>
                           <NavLink to={it.to} end>
                              {({ isActive }) => (
                                 <SidebarMenuButton
                                    isActive={isActive}
                                    className="text-[16px] font-medium leading-6"
                                 >
                                    <it.icon className="size-5" />
                                    <span className="ml-2">{it.label}</span>
                                 </SidebarMenuButton>
                              )}
                           </NavLink>
                        </SidebarMenuItem>
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>

         <SidebarFooter>
            <div className="text-xs text-muted-foreground">
               <div className="font-medium text-foreground">{name}</div>
               {email}
            </div>
            <Logout />
         </SidebarFooter>
      </Sidebar>
   );
}
