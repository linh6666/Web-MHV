
"use client";

import React, { useState } from "react";
import {
  EuiButton,
  EuiFieldSearch,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
} from "@elastic/eui";

interface AppSearchProps {
  // language?: "vi" | "en";
  // value: string;
  // onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // onSearch?: (value: string) => void;
}

const AppSearch: React.FC<AppSearchProps> = ({
  // language = "vi",
  // value,
  // onChange,
  // onSearch,
}) => {
  // const [innerValue, setInnerValue] = useState(value);

  // const handleSearch = () => {
  //   if (onSearch) {
  //     onSearch(innerValue); // 👉 chỉ search khi nhấn nút
  //   }
  // };

  return (
    <EuiFlexGroup>
      <EuiFormRow style={{ maxWidth: "100%", height: "60px" }}>
        <EuiFlexGroup alignItems="flexEnd">
          <EuiFlexItem grow>
            <EuiFieldSearch
              placeholder="Tìm kiếm..."
              // placeholder={
              //   language === "vi" ? "Nhập từ khóa..." : "Enter keywords..."
              // }
              // aria-label={language === "vi" ? "Trường tìm kiếm" : "Search field"}
              // fullWidth
              // value={value}
              // onChange={(e) => {
              //   setInnerValue(e.target.value);
              //   onChange(e); // cập nhật input nhưng chưa search
              // }}
              // // ❌ Bỏ onSearch ở đây, chỉ search khi nhấn nút
              // onKeyDown={(e) => {
              //   if (e.key === "Enter") handleSearch(); // search khi nhấn Enter
              // }}
            />
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <EuiButton
              iconType="lensApp"
              style={{
                border: "none",
                boxShadow: "none",
                backgroundColor: "rgb(64, 108, 136)",
                color: "#fff",
              }}
              // onClick={handleSearch} 
            >
              {/* {language === "vi" ? "Tìm kiếm" : "Search"} */}
              Tìm kiếm
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFormRow>
    </EuiFlexGroup>
  );
};

export default AppSearch;