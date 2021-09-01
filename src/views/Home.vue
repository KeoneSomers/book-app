<template>
	<div class="home">
		<!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
		<!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
		<FetchBooks />
	</div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import FetchBooks from "@/components/FetchBooks.vue";

export default {
	name: "Home",
	components: {
		HelloWorld,
		FetchBooks,
	},
};
</script>
