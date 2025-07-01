
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MoreHorizontal, Edit, Trash2, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Todo, UpdateTodoRequest } from "@/types/todo";
import { TodoEditDialog } from "./TodoEditDialog";

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: number, isCompleted: boolean) => Promise<void>;
  onEdit: (id: number, updates: UpdateTodoRequest) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function TodoItem({ todo, onToggleComplete, onEdit, onDelete }: TodoItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleComplete = async () => {
    setIsUpdating(true);
    try {
      await onToggleComplete(todo.id, !todo.is_completed);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(todo.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      // 错误处理由父组件处理
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 5: return "bg-red-500 text-white";
      case 4: return "bg-orange-500 text-white";
      case 3: return "bg-yellow-500 text-black";
      case 2: return "bg-blue-500 text-white";
      case 1: return "bg-gray-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getPriorityLabel = (priority: number) => {
    const labels = { 1: "低", 2: "较低", 3: "中等", 4: "较高", 5: "高" };
    return labels[priority as keyof typeof labels] || "未知";
  };

  const isOverdue = todo.due_date && new Date(todo.due_date) < new Date() && !todo.is_completed;

  return (
    <>
      <Card className={cn(
        "transition-all duration-200 hover:shadow-md",
        todo.is_completed && "opacity-75",
        isOverdue && "border-red-200 bg-red-50 dark:bg-red-950/20"
      )}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={todo.is_completed}
              onCheckedChange={handleToggleComplete}
              disabled={isUpdating}
              className="mt-1"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className={cn(
                    "font-medium text-base leading-tight",
                    todo.is_completed && "line-through text-muted-foreground"
                  )}>
                    {todo.title}
                  </h3>
                  
                  {todo.description && (
                    <p className={cn(
                      "text-sm text-muted-foreground mt-1 line-clamp-2",
                      todo.is_completed && "line-through"
                    )}>
                      {todo.description}
                    </p>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      编辑
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Badge className={getPriorityColor(todo.priority)}>
                  {getPriorityLabel(todo.priority)}优先级
                </Badge>

                {todo.due_date && (
                  <Badge variant="outline" className={cn(
                    "flex items-center gap-1",
                    isOverdue && "border-red-500 text-red-600"
                  )}>
                    <Calendar className="h-3 w-3" />
                    {format(new Date(todo.due_date), "MM-dd")}
                    {isOverdue && <span className="text-xs">(已逾期)</span>}
                  </Badge>
                )}

                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  {format(new Date(todo.create_time), "MM-dd HH:mm")}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <TodoEditDialog
        todo={todo}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={onEdit}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除任务 "{todo.title}" 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
