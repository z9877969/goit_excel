import fs from 'fs';
import path from 'path';
import { defineConfig, normalizePath } from 'vite';
import { glob } from 'glob';
import FullReload from 'vite-plugin-full-reload';
import SortCss from 'postcss-sort-media-queries';

function htmlInjectFixed() {
  const tagName = 'load';
  const sourceAttr = 'src';
  const tagMatcher = new RegExp(
    `<${tagName}((?:\\s{1,}[a-z0-9_-]+="[^"]*")+)\\s*/>`,
    'gsi'
  );
  const attrMatcher = /([a-z0-9_-]+)="([^"]*)"/g;

  async function renderSnippets(code, codePath, root) {
    let result = code;
    for (const match of result.matchAll(tagMatcher)) {
      const [tag, attrsRaw] = match;
      const attrs = new Map();
      for (const [, name, value] of attrsRaw.trim().matchAll(attrMatcher)) {
        attrs.set(name, value);
      }
      const url = attrs.get(sourceAttr);
      if (typeof url !== 'string') {
        throw new Error(
          `injectHTML: Source attribute '${sourceAttr}' missing in\n${tag}`
        );
      }

      const baseDir = path.dirname(path.join(root, codePath));
      let filePath = url.startsWith('.')
        ? path.join(baseDir, url)
        : path.join(root, url.startsWith('/') ? url.slice(1) : url);

      if (!fs.existsSync(filePath) && url.startsWith('./partials/')) {
        const altFilePath = path.join(root, url.slice(2));
        if (fs.existsSync(altFilePath)) {
          filePath = altFilePath;
        }
      }

      if (!filePath.endsWith('.html') && !filePath.endsWith('.htm')) {
        const indexFile = ['html', 'htm']
          .map(ext => path.join(filePath, `index.${ext}`))
          .find(fs.existsSync);
        if (indexFile) {
          filePath = indexFile;
        }
      }

      filePath = normalizePath(filePath);
      let included = null;
      try {
        included = fs.readFileSync(filePath, 'utf8');
      } catch (error) {
        throw new Error(`injectHTML: ${error.message}`);
      }

      const nestedCodePath = normalizePath(path.relative(root, filePath));
      const out = await renderSnippets(included, nestedCodePath, root);
      result = result.replace(tag, out);
    }

    return result;
  }

  return {
    name: 'html-inject-fixed',
    transformIndexHtml: {
      order: 'pre',
      async handler(html, ctx) {
        const root = path.resolve(__dirname, 'src');
        const codePath = normalizePath(
          path.relative(root, path.join(root, ctx.path))
        );
        return renderSnippets(html, codePath, root);
      },
    },
  };
}

export default defineConfig(({ command }) => {
  return {
    server: {
      host: true, // дозволяє доступ за локальною IP-адресою
      port: 5173, // можна вказати будь-який порт
    },
    define: {
      [command === 'serve' ? 'global' : '_global']: {},
    },
    root: path.resolve(__dirname, 'src'),
    build: {
      sourcemap: true,
      rollupOptions: {
        input: glob.sync(path.resolve(__dirname, './src/*.html')),
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          entryFileNames: chunkInfo => {
            if (chunkInfo.name === 'commonHelpers') {
              return 'commonHelpers.js';
            }
            return '[name].js';
          },
          assetFileNames: assetInfo => {
            if (assetInfo.name && assetInfo.name.endsWith('.html')) {
              return '[name].[ext]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
      outDir: '../dist',
      emptyOutDir: true,
    },
    plugins: [
      htmlInjectFixed(),
      FullReload(['./src/**/**.html']),
      SortCss({
        sort: 'mobile-first',
      }),
    ],
  };
});
