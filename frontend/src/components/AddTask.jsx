import React, { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import api from "@/lib/axios";

const AddTask = ({ hanldeNewTask }) => {
   const [newTask, setNewTask] = useState("");
   const addTask = async () => {
      if (newTask.trim()) {
         try {
            await api.post("/tasks", { title: newTask });
            toast.success(`Công việc ${newTask} đã được thêm!`);
            hanldeNewTask();
         } catch (error) {
            console.error("Lỗi khi thêm công việc:", error);
            toast.error("Lỗi khi thêm công việc.");
         }
         setNewTask("");
      } else {
         toast.error("Vui lòng nhập tiêu đề công việc.");
      }
   };
   const handleKeyPress = (e) => {
      if (e.key === "Enter") {
         addTask();
      }
   };

   return (
      <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg">
         <div className="flex flex-col gap-3 sm:flex-row">
            <Input
               type="text"
               placeholder="Cần phải làm gì?"
               className="h-12 text-base bg-slate-50 sm:flex-1 border-border/50 focus:border-primaty/50 focus:ring-primaty/20"
               value={newTask}
               onChange={(e) => setNewTask(e.target.value)}
               onKeyPress={handleKeyPress}
            ></Input>
            <Button
               className="px6"
               variant="gradient"
               size="xl"
               onClick={addTask}
               disabled={!newTask.trim()}
            >
               <Plus className="size-5" />
               Thêm
            </Button>
         </div>
      </Card>
   );
};

export default AddTask;
