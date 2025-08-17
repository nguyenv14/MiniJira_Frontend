// types/kanban.types.ts
export interface TaskSearch {
  id: string; // _id từ MongoDB -> toString()
  title: string;
  description?: string;
  status: number;
  assignee?: string; // user name hoặc user id
  priority: number;
  created_by?: string; // tên hoặc id
  createdAt?: Date;
  updatedAt?: Date;
}

// Chứa toàn bộ dữ liệu chi tiết task
export interface TaskSave {
  _id?: string; // _id từ MongoDB
  project_id: string;
  title: string;
  description?: string;
  assignee?: string; // user id
  created_by?: string; // user id
  start_date?: Date;
  end_date?: Date;
  status?: number;
  priority: number;
  tags?: string[];
  attachments?: Array<{
    name: string;
    url: string;
  }>;
  estimated_hours?: number;
  actual_hours?: number;
  completed_at?: Date;
  parent_task_id?: string;
  is_subtask: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  user?: User;
}

export interface TaskDetail {
  _id?: string; // _id từ MongoDB
  project_id: string;
  title: string;
  description?: string;
  assignee?: string; // user id
  created_by?: string; // user id
  start_date?: Date;
  end_date?: Date;
  status?: number;
  priority: number;
  tags?: string[];
  attachments?: Array<{
    name: string;
    url: string;
  }>;
  estimated_hours?: number;
  actual_hours?: number;
  completed_at?: Date;
  parent_task_id?: string;
  is_subtask: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  userAssignee?: User;
  userCreated?: User;
}

export interface KanbanBoardInstance {
  fetchTasks: () => Promise<void>;
}

export interface Column {
  id: number;
  title: string;
  color?: string;
}

export interface KanbanData {
  [key: string]: TaskSearch[];
}

export interface User {
  _id: string,
  username: string,
  email: string,
  role: number,
}

export interface StatusOption {
  label: string;
  value: number;
}

export interface PriorityOption {
  label: string;
  value: number;
}