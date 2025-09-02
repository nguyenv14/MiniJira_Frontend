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
  project?: {
    name: string
  };
  checklists: TaskChecklist[];
  comments: TaskComment[];
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


export interface TaskDetailDashboard {
  _id: string;
  project_id: string;
  title: string;
  description: string;
  assignee: string;
  created_by: string;
  start_date: string;
  end_date: string;
  status: number;
  priority: number;
  tags: string[];
  attachments: string[];
  estimated_hours: number | null;
  parent_task_id: string;
  is_subtask: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  userAssignee: {
    _id: string;
    username: string;
  };
  userCreated: {
    _id: string;
    username: string;
  };
  id: string;
  project?: {
    name: string;
  };
}

export interface Statistics {
  total: number;
  overdue: number;
  completed: number;
  normal: number;
}

export interface TaskByDate {
  date: string;
  count: number;
}

export interface DashboardData {
  tasks: TaskDetail[];
  statistics: Statistics;
  tasksByDate: TaskByDate[];
}

export interface ProjectDropdown {
  id: string,
  name: string
}

export interface TaskChecklist {
  _id: string,
  task_id: string,
  title: string,
  completed: boolean
}

export interface TaskComment {
  _id: string;
  task_id: string;
  user: {
    _id: string;
    username: string;
  };
  content: string;
  createdAt: Date;
}