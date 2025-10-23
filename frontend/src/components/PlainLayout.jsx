// PlainLayout.jsx
import { Outlet } from "react-router";

export default function PlainLayout() {
   return (
      <div className="min-h-screen">
         <Outlet />
      </div>
   );
}
