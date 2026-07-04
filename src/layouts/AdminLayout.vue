<template>

  <div class="app-shell">
    <Sidebar />

    <div class="app-main">
      <Navbar />

      <main class="page-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue'
import Sidebar from '../components/Sidebar/Sidebar.vue'
</script>
