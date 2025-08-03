import js from "@eslint/js";
import vueParser from "vue-eslint-parser";
import vuePlugin from "eslint-plugin-vue";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import";
import globals from "globals";

export default [
  // 1. 基本 JavaScript 规则
  js.configs.recommended,

  // 2. Vue 规则配置
  {
    files: ["**/*.vue", "**/*.tsx"],
    languageOptions: {
      globals: {
        ...globals.browser, // 浏览器全局变量
        ...globals.node, // 如果需要 Node.js 全局变量
      },
      parser: vueParser,
      parserOptions: {
        parser: {
          js: "espree",
          ts: tsParser, // 如果使用 TypeScript
          jsx: "espree",
        },
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      vue: vuePlugin,
      import: importPlugin,
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...vuePlugin.configs["recommended"].rules,
      "vue/multi-word-component-names": "off", // 允许单单词组件名
      // 基础排序规则
      "import/order": [
        "warn",
        {
          groups: [
            "builtin", // Node.js 内置模块 (如 fs, path)
            "external", // 第三方依赖 (如 'vue', 'lodash')
            "internal", // 项目内部别名路径 (如 '@/components')
            "parent", // 父级目录导入 (如 '../utils')
            "sibling", // 同级目录导入 (如 './Header')
            "index", // 当前目录的 index 文件 (如 './index')
            "object", // JS 对象导入 (如 'styles.css')
            "type", // TypeScript 类型导入 (如 'import type ...')
          ],
          "newlines-between": "always", // 分组之间用空行分隔
          alphabetize: {
            order: "asc", // 按字母顺序排序 (asc|desc)
            caseInsensitive: true, // 忽略大小写
          },
        },
      ],

      // 可选：强制统一使用某种导入方式
      "import/prefer-default-export": "off", // 允许非 default 导出
      "import/no-duplicates": "error", // 禁止重复导入

      '@typescript-eslint/no-unused-vars': 'warn', // 改为警告级别
    },
  },

  // 3. TypeScript 规则（可选）
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
      ecmaVersion: "latest",
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'warn', // 改为警告级别
    },
  },
];
