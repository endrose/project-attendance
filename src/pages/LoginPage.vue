<template>
  <div class="login-page">

    <!-- LEFT -->
    <div class="login-left">

      <div class="brand">
        <!-- LOGO -->
        <q-icon name="dashboard" class="brand-icon" />
        <div>
          <div class="brand-title">Aksadigitex</div>
          <div class="brand-sub">WORKFORCE MANAGEMENT</div>
        </div>
      </div>

      <div class="hero">
        <div class="hero-title">Manage Workforce Easily</div>
        <div class="hero-sub">
          Monitor attendance, payroll, and performance in one powerful dashboard.
        </div>
      </div>

      <div class="copyright">© 2026 Aksadigitex</div>

    </div>

    <!-- RIGHT -->
    <div class="login-right">

      <q-card class="login-card">

        <div class="text-h5 text-weight-bold">Sign In</div>
        <div class="text-grey-6 q-mb-lg">
          Welcome back! Please login to continue
        </div>

        <!--FORM  -->
        <q-form class="login-form full-width" @submit="handleLogin">

            <!-- EMAIL -->
        <q-input v-model="email" label="Email" outlined dense />

        <!-- PASSWORD -->
        <q-input v-model="password" label="Password" type="password" outlined dense class="q-mt-md" />

        <!-- REMEMBER ME -->
         <div class="login-options row items-center justify-between q-mt-md">
            <q-checkbox
              v-model="rememberMe"
              dense
              class="login-remember"
              color="light-blue"
              label="Remember me"
            />
          </div>
        <!-- LOGIN BUTTON -->
        <q-btn label="LOGIN" type="submit" class="login-btn full-width q-mt-lg" 
        
        />

        <!-- FACE LOGIN -->
        <q-btn icon="face" label="LOGIN WITH FACE" class="face-btn full-width q-mt-md" @click="startFaceAuth" unelevated />

        <div class="text-center q-mt-md text-grey-6 text-caption cursor-pointer">
          Forgot password?
        </div>
        <!-- FACE VIDEO -->
        <video ref="videoRef" autoplay muted class="face-video"></video>
        </q-form>
      </q-card>

    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as faceapi from 'face-api.js'
import { useAuthStore } from 'src/stores/auth'
import { getApiErrorDetail } from 'src/shared/api/httpErrors'
import { Notify } from 'quasar'
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)
const videoRef = ref<HTMLVideoElement | null>(null)

const rememberMe = ref(false);
const auth = useAuthStore()

  const STORAGE_REMEMBER = 'attendance_login_remember'
const STORAGE_EMAIL = 'attendace_login_saved_email';


onMounted(() => {
  if(typeof localStorage === 'undefined') return
  if (localStorage.getItem(STORAGE_REMEMBER) === 'true') {
    rememberMe.value = true
    const saved =  email.value = localStorage.getItem(STORAGE_EMAIL) || ''
    if (saved)email.value = saved
  }
})

function persistRememberPreference() {
  if (typeof localStorage === 'undefined') return;
  if (rememberMe.value) {
    localStorage.setItem(STORAGE_REMEMBER, '1');
    localStorage.setItem(STORAGE_EMAIL, email.value.trim());
  } else {
    localStorage.removeItem(STORAGE_REMEMBER);
    localStorage.removeItem(STORAGE_EMAIL);
  }
}


const handleLogin = async () => {
//  loading
loading.value = true
try {
if (!email.value || !password.value) {
  Notify.create({
    type: 'warning',
    message: 'Email dan password wajib diisi'
  })
  return
}
  await auth.login(email.value.trim(), password.value, rememberMe.value);
    persistRememberPreference();
    const redirect =
      typeof route.query.redirect === 'string' && route.query.redirect.length > 0
        ? route.query.redirect
        : '/';
    await router.replace(redirect);
  
} catch (e: unknown) {
    const detail = getApiErrorDetail(e) ?? '';
    const normalized = detail.toLowerCase();
    const isInactiveUser =
      normalized.includes('inactive') ||
      normalized.includes('deactivate') ||
      normalized.includes('disabled') ||
      normalized.includes('not active') ||
      normalized.includes('tidak aktif') ||
      normalized.includes('dinonaktifkan');

    Notify.create({
      type: 'negative',
      group: false,
      message: isInactiveUser
        ? 'Akun Anda saat ini tidak aktif. Silakan hubungi Admin untuk bantuan aktivasi.'
        : detail || 'Login gagal. Periksa email dan password.',
    });
  } finally {
    loading.value = false;
  }

}

// 🔥 nanti kita isi face recognition


const startFaceAuth = async () => {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models')

  const stream = await navigator.mediaDevices.getUserMedia({
    video: true
  })

  if (!videoRef.value) return

  videoRef.value.srcObject = stream

  videoRef.value.onloadedmetadata = () => {
    void videoRef.value?.play()
  }

  videoRef.value.addEventListener('play', () => {
    const interval = setInterval(() => {
      void (async () => {
        if (!videoRef.value) return

        const detections = await faceapi.detectAllFaces(
          videoRef.value,
          new faceapi.TinyFaceDetectorOptions()
        )

        if (detections.length > 0) {
          clearInterval(interval)

          // STOP VIDEO STREAM
          const stream = videoRef.value?.srcObject as MediaStream
          stream?.getTracks().forEach(track => track.stop())

          if (videoRef.value) {
            videoRef.value.srcObject = null
          }

          localStorage.setItem('isAuth', 'true')
          void router.push('/')
        }
      })()
    }, 1000)
  }, { once: true })
}

</script>

<style scope>

.login-card :deep(.login-remember .q-checkbox__label) {
  color: #fff;
  font-size: 0.875rem;
}
  .login-options {
  gap: 0.75rem;
}
</style>