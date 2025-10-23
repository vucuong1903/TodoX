import AddTask from "@/components/AddTask";
import DateTimeFilter from "@/components/DateTimeFilter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import StatsAndFilter from "@/components/StatsAndFilter";
import TaskList from "@/components/TaskList";
import TaskListPagination from "@/components/TaskListPagination";
import React, { use, useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";
import Logout from "@/components/auth/Logout";
import useAuthStore from "@/stores/useAuthStore";

const HomePage = () => {
   const [taskBuffer, setTaskBuffer] = useState([]);
   const [activeTaskCount, setActiveTaskCount] = useState(0);
   const [completeTaskCount, setcompleteTaskCount] = useState(0);
   const [filter, setFilter] = useState("all");
   const [dateQuery, setDateQuery] = useState("today");
   const [page, setPage] = useState(1);

   useEffect(() => {
      fetchTasks();
   }, [dateQuery]);

   useEffect(() => {
      setPage(1);
   }, [filter, dateQuery]);
   //logic
   const fetchTasks = async () => {
      try {
         const response = await api.get(`/tasks?filter=${dateQuery}`);
         setTaskBuffer(response.data.tasks);
         console.log(response.data.tasks);

         setActiveTaskCount(response.data.activeCount);
         setcompleteTaskCount(response.data.completeCount);
      } catch (error) {
         console.error("Error fetching tasks:", error);
         toast.error("Lỗi khi truy xuất tasks.");
      }
   };

   const hanldeTaskChange = () => {
      fetchTasks();
   };

   const hanldeNext = () => {
      if (page < totalPages) {
         setPage((prev) => prev + 1);
      }
   };
   const hanldePrev = () => {
      if (page > 1) {
         setPage((prev) => prev - 1);
      }
   };
   const handlePageChange = (newPage) => {
      setPage(newPage);
   };

   //biến
   const filteredTasks = taskBuffer.filter((task) => {
      switch (filter) {
         case "active":
            return task.status === "active";
         case "completed":
            return task.status === "complete";
         default:
            return true;
      }
   });

   const visibleTasks = filteredTasks.slice((page - 1) * visibleTaskLimit, page * visibleTaskLimit);
   if (visibleTasks.length === 0) {
      hanldePrev();
   }
   const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit);
   const user = useAuthStore((s) => s.user);
   console.log(user.username);

   return (
      <div className="min-h-screen w-full bg-[#f8fafc] relative">
         <div>
            <Logout />
         </div>
         {/* Circuit Board Background */}
         <div
            className="absolute inset-0 z-0"
            style={{
               background: "#f8fafc",
               backgroundImage: `
        linear-gradient(90deg, #e2e8f0 1px, transparent 1px),
        linear-gradient(180deg, #e2e8f0 1px, transparent 1px),
        linear-gradient(90deg, #cbd5e1 1px, transparent 1px),
        linear-gradient(180deg, #cbd5e1 1px, transparent 1px)
      `,
               backgroundSize: "50px 50px, 50px 50px, 10px 10px, 10px 10px",
            }}
         />
         <div className="container pt-8 mx-auto relative z-10">
            <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
               {/* Đầu trang */}
               <Header />

               {/* Tạo nhiệm vụ */}
               <AddTask hanldeNewTask={hanldeTaskChange} />

               {/* Thông kê và bộ lọc */}
               <StatsAndFilter
                  filter={filter}
                  setFilter={setFilter}
                  activeTaskCount={activeTaskCount}
                  complepteedTaskCount={completeTaskCount}
               />

               {/* Danh sách công việc */}
               <TaskList
                  filteredTasks={visibleTasks}
                  filter={filter}
                  handleTaskChanged={hanldeTaskChange}
               />

               {/* Phân trang và lọc theo Date */}
               <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                  <TaskListPagination
                     hanldeNext={hanldeNext}
                     hanldePrev={hanldePrev}
                     hanldePageChange={handlePageChange}
                     page={page}
                     totalPages={totalPages}
                  />
                  <DateTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery} />
               </div>
               {/* Chân Trang */}
               <Footer activeTaskCount={activeTaskCount} completedTaskCount={completeTaskCount} />
            </div>
         </div>
      </div>
   );
};
export default HomePage;
