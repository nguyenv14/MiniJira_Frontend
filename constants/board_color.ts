export enum BoardColor {
  WHITE = 0,
  BLUE = 1,
  RED = 2,
  GREEN = 3,
  YELLOW = 4,
  PURPLE = 5,
  ORANGE = 6,
  GRAY = 7,
  NAVY = 8, // Thêm màu Navy
}

export function getColorCode(color: BoardColor): string {
  switch (color) {
    case BoardColor.WHITE:
      return '#FFFFFF'; // Trắng
    case BoardColor.BLUE:
      return '#2196F3'; // Xanh dương
    case BoardColor.RED:
      return '#F44336'; // Đỏ
    case BoardColor.GREEN:
      return '#4CAF50'; // Xanh lá
    case BoardColor.YELLOW:
      return '#FFEB3B'; // Vàng
    case BoardColor.PURPLE:
      return '#9C27B0'; // Tím
    case BoardColor.ORANGE:
      return '#FF9800'; // Cam
    case BoardColor.GRAY:
      return '#9E9E9E'; // Xám
    case BoardColor.NAVY:
      return '#003087'; // Xanh hải quân
    default:
      return '#000000'; // Đen (mặc định nếu giá trị không hợp lệ)
  }
}