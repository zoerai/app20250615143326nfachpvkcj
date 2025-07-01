
"use client";

import { Todo, UpdateTodoRequest } from "@/types/todo";
import { TodoItem } from "./TodoItem";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  onToggleComplete: (id: number, isCompleted: boolean) => Promise<void>;
  onEdit: (id: number, updates: UpdateTodoRequest) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function TodoList({ todos, loading, onToggleComplete, onEdit, onDelete }: TodoListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 border rounded-lg">
            <div className="flex items-start gap-3">
              <Skeleton className="h-5 w-5 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          暂无任务
        </h3>
        <p className="text-sm text-muted-foreground">
          添加你的第一个任务开始管理待办事项
        </p>
      </div>
    );
  }

  const completedTodos = todos.filter(todo => todo.is_completed);
  const pendingTodos = todos.filter(todo => !todo.is_completed);
  const overdueTodos = pendingTodos.filter(todo => 
    todo.due_date && new Date(todo.due_date) < new Date()
  );

  return (
    <div className="space-y-6">
      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <Clock className="h-8 w-8 text-blue-600" />
          <div>
            <p className="text-sm text-muted-foreground">进行中</p>
            <p className="text-2xl font-bold text-blue-600">{pendingTodos.length}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <div>
            <p className="text-sm text-muted-foreground">已完成</p>
            <p className="text-2xl font-bold text-green-600">{completedTodos.length}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
          <AlertCircle className="h-8 w-8 text-red-600" />
          <div>
            <p className="text-sm text-muted-foreground">已逾期</p>
            <p className="text-2xl font-bold text-red-600">{overdueTodos.length}</p>
          </div>
        </div>
      </div>

      {/* 逾期任务 */}
      {overdueTodos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            逾期任务 ({overdueTodos.length})
          </h3>
          <div className="space-y-3">
            {overdueTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* 进行中的任务 */}
      {pendingTodos.filter(todo => !overdueTodos.includes(todo)).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            进行中 ({pendingTodos.filter(todo => !overdueTodos.includes(todo)).length})
          </h3>
          <div className="space-y-3">
            {pendingTodos
              .filter(todo => !overdueTodos.includes(todo))
              .map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
          </div>
        </div>
      )}

      {/* 已完成的任务 */}
      {completedTodos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            已完成 ({completedTodos.length})
          </h3>
          <div className="space-y-3">
            {completedTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
