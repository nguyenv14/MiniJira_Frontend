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