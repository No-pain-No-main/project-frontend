import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faArrowRightToBracket,
  faCalendarCheck,
  faChartLine,
  faChevronRight,
  faClipboardCheck,
  faDumbbell,
  faHouse,
  faMagnifyingGlass,
  faShieldHalved,
  faUserGraduate,
  faUsersGear,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App.vue'
import router from './router'
import './styles/main.css'

library.add(
  faArrowRightToBracket,
  faCalendarCheck,
  faChartLine,
  faChevronRight,
  faClipboardCheck,
  faDumbbell,
  faHouse,
  faMagnifyingGlass,
  faShieldHalved,
  faUserGraduate,
  faUsersGear,
)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
