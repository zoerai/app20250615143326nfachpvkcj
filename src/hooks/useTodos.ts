
"use client";

import { useState, useEffect, useCallback } from "react";
import { Todo, CreateTodoRequest, UpdateTodoRequest } from "@/types/todo";
import { getTodos, createTodo, updateTodo, deleteTodo, toggleTodoComplete } from "@/lib/api/todos";
import { useToast } from "@/components/ui/use-toast";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "获取待办事项失败";
      setError(errorMessage);
      toast({
        title: "错误",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const addTodo = async (todoData: CreateTodoRequest) => {
    try {
      const newTodo = await createTodo(todoData);
      setTodos(prev => [newTodo, ...prev]);
      toast({
        title: "成功",
        description: "待办事项已创建",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "创建待办事项失败";
      toast({
        title: "错误",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const editTodo = async (id: number, updates: UpdateTodoRequest) => {
    try {
      const updatedTodo = await updateTodo(id, updates);
      setTodos(prev => prev.map(todo => todo.id === id ? updatedTodo : todo));
      toast({
        title: "成功",
        description: "待办事项已更新",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "更新待办事项失败";
      toast({
        title: "错误",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const removeTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      toast({
        title: "成功",
        description: "待办事项已删除",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "删除待办事项失败";
      toast({
        title: "错误",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const toggleComplete = async (id: number, isCompleted: boolean) => {
    try {
      const updatedTodo = await toggleTodoComplete(id, isCompleted);
      setTodos(prev => prev.map(todo => todo.id === id ? updatedTodo : todo));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "更新状态失败";
      toast({
        title: "错误",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return {
    todos,
    loading,
    error,
    addTodo,
    editTodo,
    removeTodo,
    toggleComplete,
    refetch: fetchTodos,
  };
}
