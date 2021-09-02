<template>
	<navbar />
	<router-view />
</template>

<script>
import Navbar from "@/components/Navbar.vue";

export default {
	name: "App",
	components: {
		Navbar,
	},
	setup() {},
};
</script>

<style>
#nav a.router-link-exact-active {
	color: #42b983;
}
</style>
