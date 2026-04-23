<script setup>
import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";
import { watch } from "vue";

const { Layout } = DefaultTheme;
const { theme, frontmatter } = useData();

// Sync banner state to a global class for CSS layout adjustments
// We only enable it if the current page is NOT the homepage
if (typeof window !== "undefined") {
  watch(
    () => [theme.value.banner?.enabled, frontmatter.value.layout],
    ([enabled, layout]) => {
      if (enabled && layout !== "home") {
        document.documentElement.classList.add("has-banner");
      } else {
        document.documentElement.classList.remove("has-banner");
      }
    },
    { immediate: true },
  );
}
</script>

<template>
  <Layout>
    <template #layout-top>
      <div
        v-if="theme.banner?.enabled && frontmatter.layout !== 'home'"
        class="wip-strip"
      >
        {{ theme.banner.text || '🚧 This documentation is a Work In Progress!' }}
      </div>
    </template>
  </Layout>
</template>
