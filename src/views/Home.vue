<template>
	<div
		v-if="user"
		class="px-4 py-5 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8"
	>
		<h1
			v-if="user.displayName && timeOfDay"
			class="text-3xl mt-5"
			style="font-family: 'Kaisei HarunoUmi', serif;"
		>
			{{ timeOfDay }}, {{ user.displayName }}
		</h1>
		<hr class="my-6" />
		<div class="flex flex-row md:space-x-5">
			<CurrentlyReading />
			<ReadingGoal />
		</div>

		<BookTabs />
	</div>
</template>

<script>
// @ is an alias to /src
import getUser from "../composables/getUser";
import HelloWorld from "@/components/HelloWorld.vue";
import CurrentlyReading from "@/components/CurrentlyReading.vue";
import ReadingGoal from "@/components/ReadingGoal.vue";
import BookTabs from "@/components/BookTabs.vue";
import { ref } from "@vue/reactivity";

export default {
	name: "Home",
	components: {
		HelloWorld,
		CurrentlyReading,
		ReadingGoal,
		BookTabs,
	},
	setup() {
		const { user } = getUser();
		const timeOfDay = ref(
			new Date().getHours() > 12 ? "Good evening" : "Good morning"
		);

		return {
			user,
			timeOfDay,
		};
	},
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Kaisei+HarunoUmi&display=swap");
</style>
