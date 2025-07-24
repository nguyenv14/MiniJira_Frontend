<template>
  <div class="dashboard-layout flex h-screen p-4">
    <!-- Menubar bên trái -->
    <div
      v-if="!isMobile && menuBarVisible"
      class="menubar w-20 p-4 flex flex-col rounded-2xl bg-white shadow-md mr-3"
    >
      <h2 class="text-lg font-bold mb-6">MiniJira</h2>
      <nav>
        <NuxtLink
          v-for="item in menuItems"
          :key="item.label"
          :to="item.to"
          class="mb-2 w-48 flex items-center gap-2 p-3 rounded-lg hover:bg-blue-100 transition"
          :class="{
            'bg-blue-200 font-bold text-blue-900': $route.path === item.to,
          }"
          @click="popupMenuVisible = false"
        >
          <i :class="item.icon + ' text-xl'" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>
    </div>

    <!-- Menubar nhỏ chỉ icon -->
    <div
      v-else-if="!isMobile"
      class="iconbar flex flex-col items-center rounded-2xl bg-white shadow-md mr-4 py-4 w-16"
    >
      <span class="font-bold mb-6">MJ</span>
      <NuxtLink
        v-for="item in menuItems"
        :key="item.label"
        :to="item.to"
        class="mb-2 flex flex-col items-center hover:bg-blue-100 transition p-3 rounded-lg cursor-pointer"
        :title="item.label"
        :class="{
          'bg-blue-200 font-bold text-blue-900': $route.path === item.to,
        }"
        @click="popupMenuVisible = false"
      >
        <i :class="item.icon + ' text-xl'" />
      </NuxtLink>
    </div>

    <!-- Popup menubar cho mobile -->
    <transition name="slide">
      <div v-if="popupMenuVisible && isMobile" class="fixed inset-0 z-50 flex">
        <div
          class="menubar w-64 p-4 flex flex-col rounded-r-2xl bg-white shadow-xl h-full animate-slide-in relative"
        >
          <h2 class="text-lg font-bold mb-6">MiniJira</h2>
          <nav>
            <NuxtLink
              v-for="item in menuItems"
              :key="item.label"
              :to="item.to"
              class="mb-4 flex items-center gap-2 p-2 rounded-lg hover:bg-blue-100 transition"
              :class="{
                'bg-blue-200 font-bold text-blue-900': $route.path === item.to,
              }"
              @click="popupMenuVisible = false"
            >
              <i :class="item.icon + ' text-xl'" />
              <span>{{ item.label }}</span>
            </NuxtLink>
          </nav>
          <button
            class="absolute top-4 right-4 text-gray-500"
            @click="popupMenuVisible = false"
          >
            <i class="pi pi-times text-xl" />
          </button>
        </div>
        <div class="flex-1" @click="popupMenuVisible = false" />
      </div>
    </transition>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Status Bar -->
      <div
        class="status-bar flex items-center justify-between rounded-2xl bg-white shadow-md px-6 py-3 mb-4"
      >
        <div class="flex items-center gap-4">
          <!-- Một nút duy nhất để toggle menubar trên mọi thiết bị -->
          <Button
            aria-label="Toggle menu"
            class="p-button-text p-button-rounded p-button-secondary mr-4"
            icon="pi pi-bars"
            @click="toggleMenu"
          />
        </div>
        <div>
          <Button
            class="p-button-text p-button-rounded p-button-secondary"
            @click="popupMenuVisible = !popupMenuVisible"
          >
            <i class="pi pi-user" />
            <span class="ml-2">{{ userName }}</span>
          </Button>
        </div>
      </div>
      <!-- Content Bar -->
      <div class="contentbar rounded-2xl bg-white shadow-md p-6 overflow-auto flex-1">
        <nuxt-page />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const menuBarVisible = ref(true);
const popupMenuVisible = ref(false);
const windowWidth = ref(0); // Khởi tạo mặc định

if (typeof window !== "undefined") {
  windowWidth.value = window.innerWidth;
}

function handleResize() {
  if (typeof window !== "undefined") {
    windowWidth.value = window.innerWidth;
    if (windowWidth.value < 640) menuBarVisible.value = false;
  }
}
const userName = computed(() => authStore.userInfo?.username ?? "Guest");

onMounted(async () => {
  if (typeof window !== "undefined") {
    window.addEventListener("resize", handleResize);
    handleResize();
  }
  authStore.fetchAndSaveProfile();
  authStore.loadFromStorage();
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", handleResize);
  }
});

const isMobile = computed(() => windowWidth.value < 768);

const menuItems = [
  { label: "Dashboard", icon: "pi pi-clipboard", to: "/" },
  { label: "Projects", icon: "pi pi-briefcase", to: "/projects" },
  { label: "Teams", icon: "pi pi-users", to: "/teams" },
  { label: "Settings", icon: "pi pi-cog", to: "/settings" },
  { label: "Notifications", icon: "pi pi-bell", to: "/notifications" },
  { label: "Profile", icon: "pi pi-user", to: "/profile" },
];

function toggleMenu() {
  if (isMobile.value) {
    popupMenuVisible.value = !popupMenuVisible.value;
  } else {
    menuBarVisible.value = !menuBarVisible.value;
  }
}
</script>

<style scoped>
.dashboard-layout {
  background: var(--color-primary-50);
}

.menubar {
  min-width: 220px;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
}
.iconbar {
  width: 64px;
  min-width: 64px;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
}
.status-bar {
  min-height: 56px;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
}
.contentbar {
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
