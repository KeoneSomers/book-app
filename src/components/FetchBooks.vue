<template>
	<div class="flex flex-col items-center justify-center w-full py-10">
		<!-- search bar -->

		<div class="flex w-full pb-5 justify-center">
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
		</div>

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
					<h4 class="text-xl font-semibold text-left">
						{{ book.volumeInfo.title }}
					</h4>
					<p class="text-sm text-left max-h-10 overflow-hidden">
						Some text
					</p>
					<div class="flex flex-row space-x-1">
						<router-link
							class="p-2 leading-none rounded font-medium mt-3 bg-gray-200 text-xs uppercase"
							:to="'/book-details/' + book.id"
							>Details</router-link
						>
						<button
							@click="addBookToCollection"
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
	<p v-if="error"></p>
</template>

<script>
import { ref, onMounted } from "vue";
export default {
	name: "Posts",
	props: {},
	setup() {
		const data = ref(null);
		const loading = ref(true);
		const error = ref(null);
		const searchQuery = ref("The hobbit");

		const addBookToCollection = () => {
			// add a book to the collection (later this will be add to "My List", "Read Later", "Finished")

			// id
			// book id
			// user id
			// isFinished
			// isReadLater
			// isReading

			console.log("add book to collection");
		};

		function fetchData() {
			loading.value = true;
			// I prefer to use fetch
			// you can use use axios as an alternative
			return fetch(
				"https://www.googleapis.com/books/v1/volumes?q=" +
					searchQuery.value +
					"&key=AIzaSyCnxO8EeJcBwjG7aFjSw3BeA09SPNBQUD0",
				{
					method: "get",
					headers: {
						"content-type": "application/json",
					},
				}
			)
				.then((res) => {
					// a non-200 response code
					if (!res.ok) {
						// create error instance with HTTP status text
						const error = new Error(res.statusText);
						console.log(error.message);
						error.json = res.json();
						throw error;
					}

					return res.json();
				})
				.then((json) => {
					// set the response data
					data.value = json.items;
					console.log(json);
				})
				.catch((err) => {
					error.value = err;
					console.log(err);
					// In case a custom JSON error response was provided
					if (err.json) {
						return err.json.then((json) => {
							// set the JSON response message
							error.value.message = json.message;
						});
					}
				})
				.then(() => {
					loading.value = false;
				});
		}

		onMounted(() => {
			fetchData();
		});

		return {
			data,
			loading,
			error,
			searchQuery,
			fetchData,
			addBookToCollection,
		};
	},
};
</script>
