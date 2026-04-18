<template>
  <div class="secret-container">
    <div class="secret-card">
      <div class="check-icon">✓</div>
      <h2>¡Login Exitoso!</h2>
      <p class="welcome">Bienvenido al sistema del gimnasio UNAL</p>

      <div class="secret-box">
        <p class="secret-label">Tu frase secreta:</p>
        <p class="secret-phrase">{{ secretPhrase }}</p>
      </div>

      <button @click="handleLogout" class="logout-btn">
        Cerrar Sesión
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SecretDisplay',
  props: {
    secretPhrase: {
      type: String,
      required: true
    }
  },
  methods: {
    handleLogout() {
      this.$emit('logout')
    }
  }
}
</script>

<style scoped>
.secret-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a7a4a, #27AE60);
}

.secret-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 420px;
  text-align: center;
}

.check-icon {
  font-size: 52px;
  color: #27AE60;
  margin-bottom: 12px;
}

h2 {
  color: #1a7a4a;
  font-size: 26px;
  margin-bottom: 6px;
}

.welcome {
  color: #888;
  font-size: 13px;
  margin-bottom: 28px;
}

.secret-box {
  background: #f0faf4;
  border: 2px dashed #27AE60;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 24px;
}

.secret-label {
  color: #555;
  font-size: 13px;
  margin-bottom: 8px;
  font-weight: 600;
}

.secret-phrase {
  color: #1a7a4a;
  font-size: 15px;
  font-weight: bold;
}

.logout-btn {
  padding: 12px 32px;
  background: white;
  color: #1a7a4a;
  border: 2px solid #1a7a4a;
  border-radius: 8px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #1a7a4a;
  color: white;
}
</style>