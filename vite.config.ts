import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { defineConfig, loadEnv, UserConfig, UserConfigExport } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import tsconfigPaths from "vite-tsconfig-paths";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

export default (config: UserConfig): UserConfigExport => {
  const mode = config.mode as string;

  // 加载环境变量
    const env = loadEnv(mode, process.cwd());

    console.log('========== Vite构建配置test ==========');
    console.log('当前模式:', mode);
    console.log('API地址:', env.VITE_APP_API);
    console.log('标题:', env.VITE_APP_TITLE);
    console.log('==================================');

  return defineConfig({
    base: "./",
    plugins: [
      vue(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            apiURL: loadEnv(mode, process.cwd()).VITE_APP_API,
            title: ""
          },
          tags: [
            {
              injectTo: 'body-prepend',
              tag: 'div',
              attrs: {
                id: 'tag'
              }
            }
          ]
        }
      }),
      tsconfigPaths(),
      createSvgIconsPlugin({
        iconDirs: [resolve(__dirname, "src/assets/icons/svg")],
        symbolId: "icon-[dir]-[name]"
      })
    ],
    build: {
      chunkSizeWarningLimit: 1024,
      commonjsOptions: {
        include: /node_modules|lib/
      },
      rollupOptions: {
        output: {
          manualChunks: {
            quill: ["quill"],
            lodash: ["lodash"],
            vlib: ["vue", "vue-router", "element-plus"]
          }
        }
      }
    },
    resolve: {
      alias: {
        // 配置别名
        "@": resolve(__dirname, "./src")
      }
    },
    server: {
      open: false, // 自动启动浏览器
      host: "0.0.0.0", // localhost
      port: 8001, // 端口号
      hmr: { overlay: false }
    }
  });
};
