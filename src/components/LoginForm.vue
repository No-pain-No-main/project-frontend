<template>
  <div class="login-container">
    <form @submit.prevent="handleSubmit" class="login-form">
      <h2>no pain no main()</h2>
      <p class="subtitle">Sistema de Gestión del Gimnasio UNAL</p>

      <div class="input-group">
        <label>Correo institucional</label>
        <input
          v-model="correo"
          type="email"
          placeholder="usuario@unal.edu.co"
          required
        />
      </div>

      <div class="input-group">
        <label>Contraseña</label>
        <input
          v-model="password"
          type="password"
          placeholder="Ingresa tu contraseña"
          required
        />
      </div>

      <div v-if="errorMessage" class="error-box">
        {{ errorMessage }}
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Ingresando...' : 'Ingresar' }}
      </button>
    </form>
  </div>
</template>

<script>
import authService from '../services/authService'

export default {
  name: 'LoginForm',
  data() {
    return {
      correo: '',
      password: '',
      loading: false,
      errorMessage: ''
    }
  },
  methods: {
    async handleSubmit() {
      this.loading = true
      this.errorMessage = ''
      try {
        const result = await authService.login(this.correo, this.password)
        if (result.success) {
          this.$emit('login-success', result.secret_phrase)
        } else {
          this.errorMessage = result.message
        }
      } catch (e) {
        this.errorMessage = 'Error inesperado. Intenta de nuevo.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1F4E79, #2E75B6);
}

.login-form {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  color: #1F4E79;
  margin-bottom: 4px;
  font-size: 24px;
}

.subtitle {
  text-align: center;
  color: #888;
  font-size: 13px;
  margin-bottom: 28px;
}

.input-group {
  margin-bottom: 18px;
}

label {
  display: block;
  color: #333;
  font-size: 14px;
  margin-bottom: 6px;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 12px;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #2E75B6;
}

button {
  width: 100%;
  padding: 13px;
  background: linear-gradient(135deg, #1F4E79, #2E75B6);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 8px;
  transition: transform 0.2s;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-box {
  background: #ffeaea;
  color: #c0392b;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 12px;
  border-left: 4px solid #c0392b;
}
</style>