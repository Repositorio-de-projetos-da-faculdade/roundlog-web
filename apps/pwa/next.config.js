/** @type {import('next').NextConfig} */
// next-pwa reativado com customWorker.
// - Em dev (NODE_ENV=development): PWA desabilitado, SW vem de public/sw.js (estático).
// - Em prod (build/start): next-pwa compila /sw.js juntando workbox (cache) + worker/index.js (push).
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  // customWorker: pasta cujo conteúdo é mergeado no SW gerado (push handlers).
  customWorkerDir: "worker",
});

const nextConfig = {
  reactStrictMode: true,
};

module.exports = withPWA(nextConfig);
