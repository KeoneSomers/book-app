<template>
	<form @submit.prevent="handleSubmit">
		<h3>Sign up</h3>
		<input type="text" placeholder="Display name" v-model="displayName" />
		<input type="email" placeholder="Email" v-model="email" />
		<input type="password" placeholder="Password" v-model="password" />
		<div v-if="error" class="error">{{ error }}</div>
		<button v-if="!isPending">Sign up</button>
		<button v-else disabled>Loading</button>
	</form>
</template>

<script setup>
import useSignup from "@/composables/useSignup";
import { ref } from "vue";
import { useRouter } from "vue-router";

// variables
const { error, signup, isPending } = useSignup();
const email = ref("");
const password = ref("");
const displayName = ref("");
const router = useRouter();

// functions
const handleSubmit = async () => {
	const res = await signup(email.value, password.value, displayName.value);
	if (!error.value) {
		router.push({ name: "Home" });
	}
};
</script>
