import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone'

};

// standalone mode is used to bundle the application into a single output directory,
// which can be deployed easily. This is particularly useful for serverless deployments or when you want 
// to minimize the number of files in your deployment package.
// also its take just used packages and files that are necessary for the application to run, 
// which can help reduce the size of the deployment package and improve performance.

export default nextConfig;
