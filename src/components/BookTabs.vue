<template>
	<div class="flex flex-row justify-center space-x-5 p-10">
		<button class="bg-dark-600 text-light-500 px-5 py-2 rounded-lg">
			Your Collection
		</button>
		<button class="bg-light-300 px-5 py-2 rounded-lg">Read Later</button>
		<button class="bg-light-300 px-5 py-2 rounded-lg">Finished</button>
	</div>

	<div
		class="flex flex-row justify-center py-40 px-5 border-dashed border-4 border-light-500 rounded-2xl"
	>
		<p class="text-center">
			Visit the
			<router-link class="text-blue-600 underline font-bold" to="/explore"
				>Explore tab Test</router-link
			>
			to find books<br />
			and keep track of them to your collection!
		</p>
	</div>

	<!-- prettier-ignore -->
	<pre class="bg-light-200 mt-10 p-10 rounded-lg">
<code>{{ data }}</code>
</pre
	>
</template>

<script>
import { ref, onMounted, watchEffect } from "vue";
import getUser from "../composables/getUser";
import { db } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";

export default {
	setup() {
		const data = ref(null);
		const loading = ref(true);
		const fetchError = ref(null);
		const { user } = getUser();

		onMounted(() => {
			getUserBookRecords();
		});

		// GET Collection - user's book records [TODO: only get back results with users uid and add pagination]
		async function getUserBookRecords() {
			let results = [];
			const unsub = onSnapshot(
				collection(db, "usersBooksRecords"),
				(snapshot) => {
					snapshot.docs.forEach((doc) => {
						results.push({ ...doc.data(), id: doc.id });
					});

					data.value = results;
				},
				(error) => {
					console.log("Error: ", error);
				}
			);

			// Clean up magic
			watchEffect((onInvalidate) => {
				onInvalidate(() => unsub());
			});
		}

		// Get Single Doc

		// Add

		// Delete

		// Update

		return {
			data,
			loading,
			fetchError,
			user,
		};
	},
};
</script>
