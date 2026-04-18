<template>
  <div>
    <LoginForm @login-success="handleLoginSuccess" />
  </div>
</template>

<script>
import LoginForm from '../components/LoginForm.vue'

export default {
  name: 'LoginView',
  components: {
    LoginForm
  },
  methods: {
    handleLoginSuccess(secretPhrase) {
      this.$router.push(`/secret/${encodeURIComponent(secretPhrase)}`)
    }
  }
}
</script>