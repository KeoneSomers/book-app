<template>
	<navbar v-if="user" />
	<router-view />
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import getUser from "./composables/getUser";

export default {
	name: "App",
	components: {
		Navbar,
	},
	setup() {
		const { user } = getUser();

		return { user };
	},
};
</script>

<style></style>
