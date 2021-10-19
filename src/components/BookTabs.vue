<template>
	<hr class="mt-6" />

	<!-- Currently Reading -->
	<!-- finished -->
	<!-- TBR -->
	<!-- Wishlist -->

	<!-- super cool bookshelf -->
	<h3 class="mb-5 mt-10 font-bold">My Library</h3>
	<div class="relative">
		<span
			class="absolute right-0 top-30 border-width-2px font-bold border-light-50 bg-dark-200 text-light-50 -mr-5 w-10 h-10 z-50 rounded-full text-center"
			>></span
		>
		<div class="bg-light-200 w-full p-5 flex rounded overflow-x-auto">
			<div class="flex flex-nowrap space-x-5">
				<div
					v-for="item in data"
					:key="item.id"
					class="relative rounded group w-40 h-60 bg-dark-400 hover:cursor-pointer overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out"
				>
					<img
						v-if="bookData.find((x) => x.id == item.bookId)"
						class="w-full group-hover:opacity-50 transition"
						:src="
							bookData.find((x) => x.id == item.bookId).volumeInfo.imageLinks
								.thumbnail
						"
						:title="bookData.find((x) => x.id == item.bookId).volumeInfo.title"
						:alt="bookData.find((x) => x.id == item.bookId).volumeInfo.title"
					/>
					<span
						@click="removeBook(item)"
						title="Remove Book"
						class="absolute top-2 right-2 p-1 w-9 text-center font-bold border-light-50 text-light-50 border-width-2px rounded-full bg-dark-200 opacity-0 group-hover:opacity-100"
					>
						X
					</span>
				</div>
			</div>
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
	doc,
	deleteDoc,
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
		// Delete
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////
		const removeBook = async (item) => {
			// remove from db
			await deleteDoc(doc(db, "usersBooksRecords", item.id));

			// remove from local array
			const index = data.value.indexOf(item);
			if (index > -1) {
				data.value.splice(index, 1);
			}
		};

		return {
			data,
			bookData,
			loading,
			fetchError,
			user,
			removeBook,
		};
	},
};
</script>
