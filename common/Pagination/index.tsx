import { Pagination } from "antd";
import React, { useState } from "react";

export default function DemoPagination() {
  const [current, setCurrent] = useState(1);
  const totalItems = 50;
  const pageSize = 10;

  return (
    <Pagination
      current={current}
      pageSize={pageSize}
      total={totalItems}
      onChange={(page) => setCurrent(page)}
      showSizeChanger={false} // ẩn chọn số item mỗi trang nếu muốn giống hình
      showQuickJumper={false} // ẩn ô nhập số trang nếu muốn
    />
  );
}
