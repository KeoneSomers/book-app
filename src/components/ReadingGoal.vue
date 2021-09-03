<template>
	<div
		class="shadow-lg rounded-2xl w-100 p-4 bg-white relative overflow-hidden"
	>
		<p class="text-gray-800 text-lg font-medium mb-2">
			🎯 Yearly Goal
		</p>
		<p v-if="daysLeftInYear" class="text-gray-400 text-xs">
			{{ daysLeftInYear }} days left
		</p>
		<div class="flex items-center justify-between my-2">
			<p class="text-gray-300 text-sm">
				7 / 10 books read
			</p>
		</div>
		<div class="w-full h-2 bg-yellow-200 rounded-full">
			<div
				class="w-2/3 h-full text-center text-xs text-white bg-yellow-600 rounded-full"
			></div>
		</div>
	</div>
</template>

<script>
import { onMounted, ref } from "@vue/runtime-core";
export default {
	setup() {
		const daysLeftInYear = ref(0);

		onMounted(() => {
			var currentDate = new Date();
			let currentYear = new Date().getFullYear() % 4 == 0 ? 366 : 365;
			let dayOfYear = Math.floor(
				(currentDate - new Date(currentDate.getFullYear(), 0, 0)) /
					(1000 * 60 * 60 * 24)
			);

			daysLeftInYear.value = currentYear - dayOfYear;
		});

		return {
			daysLeftInYear,
		};
	},
};
</script>

<style></style>
