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

const storedCollapsed = typeof localStorage !== 'undefined' && localStorage.getItem('fitbook:sidebar-collapsed') === '1'

export const collapsed = ref(storedCollapsed)

export function toggleCollapsed() {

  if (typeof window !== 'undefined' && window.innerWidth <= 860) {
    toggleMobileSidebar()
    return
  }

  collapsed.value = !collapsed.value
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('fitbook:sidebar-collapsed', collapsed.value ? '1' : '0')
  }
}
