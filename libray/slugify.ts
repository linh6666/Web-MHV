export function slugify(str: string): string {
  return str
    .normalize("NFD") // Chuẩn hóa chuỗi để tách dấu ra khỏi ký tự
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu (accents)
    .toLowerCase() // Chuyển về chữ thường
    .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/[^a-z0-9\-]/g, "") // Loại bỏ ký tự không phải chữ cái, số, hoặc gạch ngang
    .replace(/\-+/g, "-") // Loại bỏ gạch ngang thừa nếu có
    .replace(/^-+|-+$/g, ""); // Loại bỏ gạch ngang ở đầu/cuối chuỗi
}