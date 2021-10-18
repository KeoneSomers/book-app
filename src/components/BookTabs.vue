<template>
	<hr class="mt-6" />

	<!-- super cool bookshelf -->
	<h3 class="mb-5 mt-10 font-bold">My Reading List</h3>
	<div
		class="bg-light-200 w-full p-5 flex flex-row md:space-x-5 rounded overflow-x-auto"
	>
		<div
			v-for="item in data"
			:key="item.id"
			class="w-40 h-60 bg-dark-200 hover:cursor-pointer overflow-hidden"
		>
			<img
				class="w-full"
				src="https://www.amazon.co.uk/images/I/51-nXsSRfZL._SY291_BO1,204,203,200_QL40_ML2_.jpg"
				alt="Title"
			/>
		</div>
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
			console.log(data.value);
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
