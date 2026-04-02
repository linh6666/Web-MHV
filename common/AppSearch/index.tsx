"use client";

import React, { useState, useEffect } from "react";
import {
  EuiButton,
  EuiFieldSearch,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
} from "@elastic/eui";

interface AppSearchProps {
  value?: string;
  onSearch: (value: string) => void;
}

const AppSearch: React.FC<AppSearchProps> = ({
  value = "",
  onSearch,
}) => {
  const [innerValue, setInnerValue] = useState(value);

  // sync khi parent đổi value
  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  const handleSearch = () => {
    onSearch(innerValue.trim());
  };

  return (
    <EuiFlexGroup>
      <EuiFormRow style={{ maxWidth: "100%", height: "60px" }}>
        <EuiFlexGroup alignItems="flexEnd">
          <EuiFlexItem grow>
            <EuiFieldSearch
              placeholder="Tìm kiếm..."
              fullWidth
              value={innerValue}
              onChange={(e) => setInnerValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <EuiButton
              iconType="search"
              style={{
                border: "none",
                boxShadow: "none",
                backgroundColor: "rgb(64, 108, 136)",
                color: "#fff",
              }}
              onClick={handleSearch}
            >
              Tìm kiếm
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFormRow>
    </EuiFlexGroup>
  );
};

export default AppSearch;
