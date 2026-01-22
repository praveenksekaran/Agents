import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // This creates a minimal 'server.js' for production
  env: {
    Agent_Query_URL: "https://.../reasoningEngines/3947806395134377984"
  },
  outputFileTracingIncludes: {
    '/*': ['./node_modules/konva/**/*', './node_modules/react-konva/**/*']
  }
};

export default nextConfig;
