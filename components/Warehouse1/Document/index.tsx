"use client";

import React from "react";
import { Box, Paper, Text, Group } from "@mantine/core";

export default function Document() {
  return (
    <Box 
      style={{ 
        width: "100%",
        height: "auto",
        minHeight: "fit-content",
        background: "radial-gradient(circle at center, #ffffff 0%, #f1f3f5 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 0 0 0", // Chỉ để padding phía trên, phía dưới bằng 0
        margin: 0,
        animation: "fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
      }}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}
      </style>

      <Paper 
        radius="lg" 
        style={{ 
          width: "100%", 
          maxWidth: "750px", 
          height: "500px", 
          overflow: "hidden",
          backgroundColor: "white",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25), 0 0 1px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Modern Window Header */}
        <Group 
          px="md" 
          py="xs" 
          justify="space-between" 
          style={{ 
            backgroundColor: "#fafafa", 
            borderBottom: "1px solid #f0f0f0" 
          }}
        >
          <Group gap={8}>
            <Box style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f57", opacity: 0.8 }} />
            <Box style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ffbd2e", opacity: 0.8 }} />
            <Box style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#28c940", opacity: 0.8 }} />
          </Group>
          <Text size="xs" fw={600} c="dimmed" style={{ letterSpacing: "0.5px", textTransform: "uppercase" }}>
            Document Preview
          </Text>
          <Box style={{ width: 45 }} />
        </Group>

        <Box style={{ flex: 1, position: "relative", backgroundColor: "#fdfdfd" }}>
          <iframe
            src="https://drive.google.com/file/d/14SWx-24SM1xbbbGYVP8SD1jnA_AvLnx6/preview"
            width="100%"
            height="100%"
            style={{ border: "none" }}
            title="PDF Viewer"
          />
        </Box>
      </Paper>
    </Box>
  );
}






