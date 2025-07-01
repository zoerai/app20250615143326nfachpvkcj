
export interface Todo {
  id: number;
  title: string;
  description?: string;
  is_completed: boolean;
  priority: number;
  due_date?: string;
  create_time: string;
  modify_time: string;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority?: number;
  due_date?: string;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  is_completed?: boolean;
  priority?: number;
  due_date?: string;
}
