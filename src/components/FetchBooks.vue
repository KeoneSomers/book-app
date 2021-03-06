<template>
	<div class="flex flex-col items-center justify-center w-full py-10">
		<!-- search bar -->

		<!-- <div class="flex w-full pb-5 justify-center">
			<div>
				<input
					v-model="searchQuery"
					@keyup.enter="fetchData()"
					spellcheck="false"
					type="text"
					class=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-max-100 py-2 mb-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
					placeholder="Find book by title"
				/>
			</div>
		</div> -->

		<div
			v-if="!loading && data && data.length"
			class="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 xl:max-w-6xl max-w-4xl"
		>
			<div
				v-for="book in data"
				:key="book.id"
				class="flex shadow rounded bg-white overflow-hidden m-2"
			>
				<div>
					<img
						class="rounded w-md:h-auto min-w-30 max-w-30"
						v-if="book.volumeInfo.imageLinks"
						:src="book.volumeInfo.imageLinks.smallThumbnail"
						alt="book-cover"
					/>
					<img
						v-else
						class="rounded w-md:h-auto min-w-30 max-w-30"
						src="../assets/placeholder-cover.jpg"
						alt="book-cover"
					/>
				</div>
				<div class="flex flex-col items-start ml-4">
					<router-link class="underline" :to="'/book-details/' + book.id"
						><h4 class="text-xl font-semibold text-left">
							{{ book.volumeInfo.title }}
						</h4></router-link
					>
					<p
						v-if="book.volumeInfo.authors"
						class="text-sm text-left max-h-10 overflow-hidden"
					>
						By {{ book.volumeInfo.authors[0] }}
					</p>
					<div class="flex flex-row space-x-1">
						<button
							@click="addBookToCollection(book)"
							class="p-2 leading-none rounded font-medium mt-3 bg-yellow-200 text-xs uppercase"
						>
							Add to collection
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<p v-if="loading">
		Still loading..
	</p>
	<p v-if="fetchError">{{ fetchError }}</p>
</template>

<script>
import { ref, onMounted, onUpdated, watch } from "vue";
import getUser from "../composables/getUser";
import axios from "axios";
import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { useRoute } from "vue-router";

export default {
	name: "Posts",
	props: {},
	setup() {
		const route = useRoute();
		const data = ref(null);
		const booksAlreadyInCollection = ref([]);

		const loading = ref(true);
		const fetchError = ref(null);
		const searchQuery = ref(null);
		const { user } = getUser();

		const addBookToCollection = async (book) => {
			await addDoc(collection(db, "usersBooksRecords"), {
				bookId: book.id,
				userId: user.value.uid,
				isFinished: false,
				isReadLater: false,
				isReading: false,
				isWishlisted: false,
			});
		};

		function fetchData() {
			loading.value = true;

			return axios
				.get(
					"https://www.googleapis.com/books/v1/volumes?q=" +
						route.params.query +
						"&key=AIzaSyB33uX0rERjXmuqHW8YO7nTNPAo1BDxlp8"
				)
				.then(function(response) {
					// handle success
					data.value = response.data.items;
				})
				.catch(function(err) {
					// handle error
					fetchError.value = err.message;
				})
				.then(function() {
					// always executed
					loading.value = false;
				});
		}

		onMounted(() => {
			fetchData();
		});

		return {
			data,
			loading,
			fetchError,
			searchQuery,
			fetchData,
			addBookToCollection,
		};
	},
};
</script>
