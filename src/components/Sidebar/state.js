import { ref } from 'vue'

export const mobileOpen = ref(false)

export function openMobileSidebar() {
  mobileOpen.value = true
}

export function closeMobileSidebar() {
  mobileOpen.value = false
}

export function toggleMobileSidebar() {
  mobileOpen.value = !mobileOpen.value
}
