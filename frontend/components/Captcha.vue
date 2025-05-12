<template>
    <div v-if="!completed" ref="w-full">
        <button @click="verifyRecaptcha"
            class="action mt-4 w-full bg-blue-600 text-white rounded-lg py-2 font-medium px-6" :disabled="isLoading">
            {{ isLoading ? 'Verifying...' : 'Verify' }}
        </button>
        <p v-if="error" class="mt-2 text-red-500 text-sm">{{ error }}</p>
    </div>
    <div v-else>
        <component :is="success" />
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import success from '@/assets/icons/modal/success.vue';
import axiosService from '@/services/axiosService';
const emit = defineEmits(['verified', 'error']);
const isLoading = ref(false);
const error = ref('');
const completed = ref(false);
const SITE_KEY = process.env.VUE_APP_RECAPTCHA_SITE_KEY;

const loadRecaptcha = () => {
    return new Promise((resolve) => {
        if (window.grecaptcha?.enterprise) {
            resolve(window.grecaptcha.enterprise);
            return;
        }
        window.onRecaptchaLoaded = () => {
            resolve(window.grecaptcha.enterprise);
        };
    });
};

onMounted(() => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${SITE_KEY}&onload=onRecaptchaLoaded`;
    document.head.appendChild(script);
});

const verifyRecaptcha = async () => {
    try {
        isLoading.value = true;
        error.value = '';

        const recaptcha = await loadRecaptcha();
        const token = await recaptcha.execute(SITE_KEY, { action: 'verify' });
        await axiosService
            .get(`${process.env.API_URL}verify-captcha?g-recaptcha-response=${token}`)
            .then(({ data }) => {
                if (!!data.success) {
                    completed.value = true;
                    setTimeout(() => {
                        emit('verified', token);
                    }, 5000);
                } else {
                    error.value = 'Verification failed. Please try again.';
                }
            })
            .catch((e) => {
                throw e;
            });

    } catch (err) {
        console.error('reCAPTCHA error:', err);
        error.value = 'Verification failed. Please try again.';
        emit('error', err);
    } finally {
        isLoading.value = false;
    }
};
</script>
