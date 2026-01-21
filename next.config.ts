import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 移除了 output: "export" 以支持动态 API 路由
  // 如果需要静态导出，请移除 /api 路由或使用其他方案
};

export default nextConfig;
