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
import {
	collection,
	onSnapshot,
	query,
	where,
	getDocs,
} from "firebase/firestore";

export default {
	setup() {
		const data = ref(null);
		const loading = ref(true);
		const fetchError = ref(null);
		const { user } = getUser();

		onMounted(() => {
			// getAllBookRecords();
			getUsersBookRecords();
		});

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// GET Collection - ALL book records
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////
		async function getAllBookRecords() {
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

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// GET - user's book records
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////
		async function getUsersBookRecords() {
			let results = [];

			const q = query(
				collection(db, "usersBooksRecords"),
				where("userId", "==", user.value.uid)
			);

			const querySnapshot = await getDocs(q);
			querySnapshot.forEach((doc) => {
				console.log(doc.id, " => ", doc.data());
				results.push({ ...doc.data(), id: doc.id });
			});

			data.value = results;
		}

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Get Single Doc
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Add
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Delete
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Update
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////

		return {
			data,
			loading,
			fetchError,
			user,
		};
	},
};
</script>
