
"use client";

import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { TodoForm } from "@/components/todo/TodoForm";
import { TodoList } from "@/components/todo/TodoList";
import { TodoFilter, FilterType, SortType } from "@/components/todo/TodoFilter";
import { useTodos } from "@/hooks/useTodos";
import { CheckSquare } from "lucide-react";

export default function HomePage() {
  const { todos, loading, addTodo, editTodo, removeTodo, toggleComplete } = useTodos();
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("create_time");
  const [search, setSearch] = useState("");

  const filteredAndSortedTodos = useMemo(() => {
    let filtered = todos;

    // 搜索过滤
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(searchLower) ||
        todo.description?.toLowerCase().includes(searchLower)
      );
    }

    // 状态过滤
    switch (filter) {
      case "pending":
        filtered = filtered.filter(todo => !todo.is_completed);
        break;
      case "completed":
        filtered = filtered.filter(todo => todo.is_completed);
        break;
      case "overdue":
        filtered = filtered.filter(todo => 
          !todo.is_completed && 
          todo.due_date && 
          new Date(todo.due_date) < new Date()
        );
        break;
      default:
        break;
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sort) {
        case "title":
          return a.title.localeCompare(b.title);
        case "priority":
          return b.priority - a.priority; // 高优先级在前
        case "due_date":
          if (!a.due_date && !b.due_date) return 0;
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        case "create_time":
        default:
          return new Date(b.create_time).getTime() - new Date(a.create_time).getTime();
      }
    });

    return filtered;
  }, [todos, filter, sort, search]);

  return (
    <MainLayout>
      <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* 页面标题 */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <CheckSquare className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">待办事项</h1>
          </div>
          <p className="text-muted-foreground">
            高效管理你的任务，让生活更有条理
          </p>
        </div>

        {/* 添加任务表单 */}
        <TodoForm onSubmit={addTodo} loading={loading} />

        {/* 过滤和搜索 */}
        <TodoFilter
          filter={filter}
          onFilterChange={setFilter}
          sort={sort}
          onSortChange={setSort}
          search={search}
          onSearchChange={setSearch}
        />

        {/* 任务列表 */}
        <TodoList
          todos={filteredAndSortedTodos}
          loading={loading}
          onToggleComplete={toggleComplete}
          onEdit={editTodo}
          onDelete={removeTodo}
        />
      </div>
    </MainLayout>
  );
}
