import { defineConfig } from 'vite';

// Site estático (HTML + CSS + JS vanilla). O Vite só existe para a Lovable
// conseguir publicar; na VPS os arquivos da raiz continuam sendo servidos direto.
// base relativa: funciona tanto na raiz (Lovable) quanto em /vendas/ (VPS).
export default defineConfig({
  base: './',
  server: { host: '::', port: 8080 },
});
