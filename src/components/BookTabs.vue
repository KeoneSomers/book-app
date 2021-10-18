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
			class="relative rounded group w-40 h-60 bg-dark-400 hover:cursor-pointer overflow-hidden"
		>
			<img
				v-if="bookData.find((x) => x.id == item.bookId)"
				class="w-full group-hover:opacity-50 transition"
				:src="
					bookData.find((x) => x.id == item.bookId).volumeInfo.imageLinks
						.smallThumbnail
				"
				alt="Title"
			/>
			<span
				title="Remove Book"
				class="absolute top-2 right-2 p-1 w-9 text-center font-bold border-light-50 text-light-50 border-width-2px rounded-full bg-dark-200 opacity-0 group-hover:opacity-100"
			>
				X
			</span>
		</div>
	</div>

	<!-- prettier-ignore -->
	<pre class="bg-light-200 mt-10 p-10 rounded-lg">
<code>{{ data }}</code>
</pre
	>
	<pre class="bg-light-200 mt-10 p-10 rounded-lg overflow-x-scroll">
<code>{{ bookData }}</code>
</pre>
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
		const data = ref([]);
		const bookData = ref([]);
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
			const q = query(
				collection(db, "usersBooksRecords"),
				where("userId", "==", user.value.uid)
			);

			const querySnapshot = await getDocs(q);
			querySnapshot.forEach((doc) => {
				data.value.push({
					...doc.data(),
					id: doc.id,
				});

				// GetBookByBookId
				const axios = require("axios");
				const googleBooksAPIKey = "AIzaSyCnxO8EeJcBwjG7aFjSw3BeA09SPNBQUD0";

				axios
					.get(
						"https://www.googleapis.com/books/v1/volumes/" +
							doc.data().bookId +
							"?key=" +
							googleBooksAPIKey
					)
					.then(function(response) {
						bookData.value.push(response.data);
					})
					.catch(function(error) {
						console.log(error);
					});
			});
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
			bookData,
			loading,
			fetchError,
			user,
		};
	},
};
</script>
