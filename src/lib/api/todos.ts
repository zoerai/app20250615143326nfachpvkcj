
import { postgrestClient } from "@/lib/postgrest";
import { Todo, CreateTodoRequest, UpdateTodoRequest } from "@/types/todo";

export async function getTodos(): Promise<Todo[]> {
  const { data, error } = await postgrestClient
    .from("todos")
    .select("*")
    .order("create_time", { ascending: false });

  if (error) {
    throw new Error(`获取待办事项失败: ${error.message}`);
  }

  return data || [];
}

export async function createTodo(todo: CreateTodoRequest): Promise<Todo> {
  const { data, error } = await postgrestClient
    .from("todos")
    .insert(todo)
    .select("*")
    .single();

  if (error) {
    throw new Error(`创建待办事项失败: ${error.message}`);
  }

  return data;
}

export async function updateTodo(id: number, updates: UpdateTodoRequest): Promise<Todo> {
  const { data, error } = await postgrestClient
    .from("todos")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(`更新待办事项失败: ${error.message}`);
  }

  return data;
}

export async function deleteTodo(id: number): Promise<void> {
  const { error } = await postgrestClient
    .from("todos")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`删除待办事项失败: ${error.message}`);
  }
}

export async function toggleTodoComplete(id: number, isCompleted: boolean): Promise<Todo> {
  return updateTodo(id, { is_completed: isCompleted });
}
