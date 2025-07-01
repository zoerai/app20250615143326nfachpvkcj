
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CreateTodoRequest } from "@/types/todo";

interface TodoFormProps {
  onSubmit: (todo: CreateTodoRequest) => Promise<void>;
  loading?: boolean;
}

export function TodoForm({ onSubmit, loading }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("1");
  const [dueDate, setDueDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        priority: parseInt(priority),
        due_date: dueDate?.toISOString(),
      });
      
      // 重置表单
      setTitle("");
      setDescription("");
      setPriority("1");
      setDueDate(undefined);
    } catch (error) {
      // 错误处理由父组件处理
    } finally {
      setIsSubmitting(false);
    }
  };

  const priorityLabels = {
    "1": "低",
    "2": "较低",
    "3": "中等",
    "4": "较高",
    "5": "高",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-card rounded-lg border">
      <div className="flex items-center gap-2 mb-4">
        <Plus className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">添加新任务</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <Input
            placeholder="输入任务标题..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-base"
            disabled={isSubmitting || loading}
          />
        </div>

        <div>
          <Textarea
            placeholder="任务描述（可选）"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[80px] resize-none"
            disabled={isSubmitting || loading}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <Select value={priority} onValueChange={setPriority} disabled={isSubmitting || loading}>
              <SelectTrigger>
                <SelectValue placeholder="选择优先级" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(priorityLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}优先级
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                  disabled={isSubmitting || loading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "yyyy-MM-dd") : "选择截止日期"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={!title.trim() || isSubmitting || loading}
        >
          {isSubmitting ? "添加中..." : "添加任务"}
        </Button>
      </div>
    </form>
  );
}
