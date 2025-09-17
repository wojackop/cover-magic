<template>
  <footer class="max-w-7xl mx-auto w-full py-6 px-3 sm:px-8 text-center relative">
    <div class="flex flex-col items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <div class="flex items-center gap-6">
        <a
          :href="pkg.author.github"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center p-1.5 rounded-full transition-colors duration-200 text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:text-gray-500 dark:hover:text-gray-400 dark:hover:bg-gray-700 box-content"
        >
          <Icon icon="ri:github-line" class="w-5 h-5" />
        </a>
        <a
          :href="pkg.author.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center p-1.5 rounded-full transition-colors duration-200 text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:text-gray-500 dark:hover:text-gray-400 dark:hover:bg-gray-700 box-content"
        >
          <Icon icon="carbon:home" class="w-5 h-5" />
        </a>
        <a
          :href="`mailto:${pkg.author.email}`"
          class="inline-flex items-center justify-center p-1.5 rounded-full transition-colors duration-200 text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:text-gray-500 dark:hover:text-gray-400 dark:hover:bg-gray-700 box-content"
        >
          <Icon icon="carbon:email" class="w-5 h-5" />
        </a>
      </div>
      <div>
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
          class="font-semibold hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
        >
          陕ICP备2024040076号-2
        </a>
        |
        <a
          href="https://beian.mps.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
          class="font-semibold hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
        >
           陕公网安备61010302001194号
        </a>
      </div>
      <div>
        Copyright © {{ new Date().getFullYear() }}
        <a
          :href="pkg.author.url"
          target="_blank"
          rel="noopener noreferrer"
          class="font-semibold hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
        >
          AhHui
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

import pkg from '../../package.json';
</script>