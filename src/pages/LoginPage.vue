<template>
  <div class="login-page row no-wrap">

    <!-- LEFT (BRANDING) -->
    <div class="login-left column justify-between">

      <div>
        <!-- LOGO -->
        <div class="logo row items-center q-mb-lg">
          <div class="logo-icon">
            <q-icon name="grid_view" size="22px" color="white" />
          </div>
          <div>
            <div class="logo-title">Aksadigitex</div>
            <div class="logo-sub">WORKFORCE MANAGEMENT</div>
          </div>
        </div>

        <!-- HERO -->
        <div class="hero-text">
          <div class="text-h5 text-white">
            Manage Workforce Easily
          </div>

          <div class="text-grey-3 q-mt-sm">
            Monitor attendance, payroll, and performance
            in one powerful dashboard.
          </div>
        </div>
      </div>

      <div class="text-grey-5 text-caption">
        © {{ year }} Aksadigitex
      </div>

    </div>

    <!-- RIGHT (FORM) -->
    <div class="login-right flex flex-center">

      <q-card class="login-card">

        <div class="text-h6 text-weight-bold">
          Sign In
        </div>

        <div class="text-caption text-grey q-mb-md">
          Welcome back! Please login to continue
        </div>

        <!-- FORM -->
        <q-input v-model="email" label="Email" outlined dense class="q-mb-sm" />

        <q-input v-model="password" label="Password" type="password" outlined dense class="q-mb-md" />

        <q-btn label="Login" color="primary" class="full-width q-mb-sm" @click="login" />

        <div class="text-caption text-center text-grey">
          Forgot password?
        </div>

      </q-card>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref<string>('')
const password = ref<string>('')
// Year
const year = new Date().getFullYear()

const login = () => {
  // dummy login
  const validEmail = 'super_duper.admin@company.local'
  const validPassword = 'SuperDuperAdmin123!'

  if (email.value === validEmail && password.value === validPassword) {
    // Redirect to main page
    localStorage.setItem('isAuthenticated', 'true')
    void router.push('/')
  } else {
    // Show error (for demo, using alert)
    alert('Invalid email or password. Please try again.')

  }

}
</script>
