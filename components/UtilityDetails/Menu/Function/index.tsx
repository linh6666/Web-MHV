"use client";

import { Button, Group, Text } from "@mantine/core";
import React from "react";

interface SunProps {
  activeMode: "single" | "multi" | null; // Cho phép null để toggle off
  setActiveMode: (mode: "single" | "multi" | null) => void; // Cho phép null
  onMultiModeClick?: () => void;
}

export default function Sun({ activeMode, setActiveMode, onMultiModeClick }: SunProps) {
  const getButtonStyle = (isActive: boolean) => ({
    width: 83,
    height: 28,
    padding: 0,
    borderRadius: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: isActive
      ? "linear-gradient(to top, #FFE09A,#FFF1D2)"
      : "#FFFAEE",
    border: "1.5px solid #752E0B",
    color: "#752E0B",
    fontWeight: 600,
    fontSize: "10px",
    letterSpacing: "0.5px",
    transition: "all 0.25s ease",
    boxShadow: isActive ? "inset 0 0 6px rgba(117, 46, 11, 0.2)" : "none",
    cursor: "pointer",
  });

  const handleClick = (mode: "single" | "multi") => {
    if (activeMode === mode) {
      // Toggle off nếu nhấn lại nút đang active
      setActiveMode(null);
    } else {
      setActiveMode(mode);
      if (mode === "multi" && onMultiModeClick) {
        onMultiModeClick();
      }
    }
  };

  return (
    <Group gap="md">
      <Button
        variant="filled"
        style={getButtonStyle(activeMode === "single")}
        onClick={() => handleClick("single")}
      >
        <Text style={{ fontSize: "10px" }}>SINGLE MODE</Text>
      </Button>

      <Button
        variant="filled"
        style={getButtonStyle(activeMode === "multi")}
        onClick={() => handleClick("multi")}
      >
        <Text style={{ fontSize: "10px" }}>MULTI MODE</Text>
      </Button>
    </Group>
  );
}
