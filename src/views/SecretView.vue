<template>
  <div>
    <SecretDisplay
      :secretPhrase="secretPhrase"
      @logout="handleLogout"
    />
  </div>
</template>

<script>
import SecretDisplay from '../components/SecretDisplay.vue'

export default {
  name: 'SecretView',
  components: {
    SecretDisplay
  },
  data() {
    return {
      secretPhrase: ''
    }
  },
  created() {
    const phrase = this.$route.params.secretPhrase
    if (!phrase) {
      this.$router.push('/')
    } else {
      this.secretPhrase = decodeURIComponent(phrase)
    }
  },
  methods: {
    handleLogout() {
      this.$router.push('/')
    }
  }
}
</script>