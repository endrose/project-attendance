<template>
  <div class="login-page">

    <!-- LEFT -->
    <div class="login-left">

      <div class="brand">
        <q-icon name="grid_view" size="28px" />
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
        <div class="text-grey-6 q-mb-md">
          Welcome back! Please login to continue
        </div>

        <!-- EMAIL -->
        <q-input v-model="email" label="Email" outlined dense />

        <!-- PASSWORD -->
        <q-input v-model="password" label="Password" type="password" outlined dense class="q-mt-md" />

        <!-- LOGIN BUTTON -->
        <q-btn label="LOGIN" class="login-btn full-width q-mt-lg" @click="login" />

        <!-- FACE LOGIN -->
        <q-btn outline icon="face" label="Login with Face" class="full-width q-mt-sm" @click="startFaceAuth" />

                <div class="text-center q-mt-sm text-grey">
                  Forgot password?
                </div>

                <!-- FACE VIDEO -->
        <video ref="videoRef" autoplay muted class="face-video"></video>

      </q-card>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as faceapi from 'face-api.js'

const email = ref('')
const password = ref('')
const router = useRouter()
const videoRef = ref<HTMLVideoElement | null>(null)


const login = () => {
  if (
    email.value === 'super_duper.admin@company.local' &&
    password.value === 'SuperDuperAdmin123!'
  ) {
    localStorage.setItem('isAuth', 'true')
    void router.push('/')
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

        console.log('faces:', detections)

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
