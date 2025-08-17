export enum ProjectType {
  INTERNAL = 1,
  EXTERNAL = 2,
  LABOR = 3,
  PRODUCT = 4
}

export function getProjectType(color: ProjectType): string {
  switch (color) {
    case ProjectType.INTERNAL:
      return 'Internal'; // Trắng
    case ProjectType.EXTERNAL:
      return 'External'; // Xanh dương
    case ProjectType.LABOR:
      return 'Labor'; // Đỏ
    case ProjectType.PRODUCT:
      return 'Product'; // Xanh lá
    default:
      return 'Others'; // Đen (mặc định nếu giá trị không hợp lệ)
  }
}

export enum ProjectCategory {
  WEB_DEVELOPMENT = 0,
  MOBILE_DEVELOPMENT = 1,
  DESIGN = 2,
  MARKETING = 3,
  CONSULTING = 4
}

// Industries
export enum Industry {
  TECHNOLOGY = 1,
  FINANCE = 2,
  HEALTHCARE = 3,
  EDUCATION = 4,
  ECOMMERCE = 5,
}

export enum TaskStatus {
  TODO = 1,
  IN_PROGRESS = 2,
  REVIEW = 3,
  DONE = 4,
  CANCELLED = 5,
}

export function getTaskStatus(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.TODO:
      return 'To Do'; // Trắng
    case TaskStatus.IN_PROGRESS:
      return 'In Progress'; // Xanh dương
    case TaskStatus.REVIEW:
      return 'Review'; // Vàng
    case TaskStatus.DONE:
      return 'Done'; // Xanh lá
    case TaskStatus.CANCELLED:
      return 'Cancelled'; // Đỏ
    default:
      return 'Unknown'; // Mặc định nếu không khớp
  }
}

export enum TaskPriority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  HIGHEST = 4,
}

export function getTaskPriority(priority: TaskPriority): string {
  switch (priority) {
    case TaskPriority.LOW:
      return 'Low'; // Xanh dương nhạt
    case TaskPriority.MEDIUM:
      return 'Medium'; // Vàng
    case TaskPriority.HIGH:
      return 'High'; // Cam
    case TaskPriority.HIGHEST:
      return 'Highest'; // Đỏ
    default:
      return 'Unknown'; // Mặc định nếu không khớp
  }
}