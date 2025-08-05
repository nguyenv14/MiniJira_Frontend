export enum TaskStatus {
  TODO = 1,
  IN_PROGRESS = 2,
  REVIEW = 3,
  DONE = 4
}

export enum TaskPriority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3
}

// utils/project.enums.ts

// Project Type
export enum ProjectType {
  INTERNAL = 1,
  EXTERNAL = 2,
  LABOR = 3,
  PRODUCT = 4
}

// Categories
export enum ProjectCategory {
  WEB_DEVELOPMENT = 1,
  MOBILE_DEVELOPMENT = 2,
  DESIGN = 3,
  MARKETING = 4,
  CONSULTING = 5
}

export function getProjectCategoryDescription(category: ProjectCategory): string {
  switch (category) {
    case ProjectCategory.WEB_DEVELOPMENT:
      return 'Web Development';
    case ProjectCategory.MOBILE_DEVELOPMENT:
      return 'Mobile Development';
    case ProjectCategory.DESIGN:
      return 'Design';
    case ProjectCategory.MARKETING:
      return 'Marketing';
    case ProjectCategory.CONSULTING:
      return 'Consulting';
    default:
      return 'Others';
  }
}

// Industries
export enum Industry {
  TECHNOLOGY = 1,
  FINANCE = 2,
  HEALTHCARE = 3,
  EDUCATION = 4,
  ECOMMERCE = 5,
}

export function getIndustryDescription(industry: Industry): string {
  switch (industry) {
    case Industry.TECHNOLOGY:
      return 'Technology';
    case Industry.FINANCE:
      return 'Finance';
    case Industry.HEALTHCARE:
      return 'Healthcare';
    case Industry.EDUCATION:
      return 'Education';
    case Industry.ECOMMERCE:
      return 'E-commerce';
    default:
      return 'Others';
  }
}

// ROle in projects
export enum RoleInProject {
  ADMIN = 1, // Can change status all and create update delete task
  LEADER = 2, // Can change status and review -> done and create update task
  MEMBER = 3 // can change status todo -> inprogress -> review
}

export enum BoardColor {
  WHITE = 0,
  BLUE = 1,
  RED = 2,
  GREEN = 3,
  YELLOW = 4,
  PURPLE = 5,
  ORANGE = 6,
  GRAY = 7,
  NAVY = 8,
}