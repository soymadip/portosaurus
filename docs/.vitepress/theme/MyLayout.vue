<script setup>
import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";
import { watch, onMounted, onUnmounted, ref } from "vue";

const { Layout } = DefaultTheme;
const { theme, frontmatter } = useData();

const isNavHidden = ref(false);
let lastScrollY = 0;

const handleScroll = () => {
  const currentScrollY = window.scrollY;
  const delta = currentScrollY - lastScrollY;

  // We use a threshold of 100px to avoid flickering at the top
  // and we check the scroll direction.
  if (currentScrollY > 100) {
    if (delta > 0) {
      // Scrolling down
      isNavHidden.value = true;
    } else if (delta < -15) {
      // Scrolling up - only show if scrolled up at least 15px
      isNavHidden.value = false;
    }
  } else {
    isNavHidden.value = false;
  }

  if (typeof document !== "undefined") {
    if (isNavHidden.value) {
      document.documentElement.classList.add("nav-hidden");
    } else {
      document.documentElement.classList.remove("nav-hidden");
    }
  }

  lastScrollY = currentScrollY;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

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
        {{ theme.banner.text }}
      </div>
    </template>
  </Layout>
</template>
