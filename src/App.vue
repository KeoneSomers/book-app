<template>
	<Navbar v-if="user" />
	<Router-view :key="$route.fullPath" />
</template>

<script>
import getUser from "./composables/getUser";
import Navbar from "@/components/Navbar.vue";

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
