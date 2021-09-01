<template>
	<h1>Vue 3 and Fetch Example</h1>

	<div class="flex items-center justify-center w-screen p-10">
		<!-- Resice the preview panel to check the responsiveness -->

		<!-- Component Start -->
		<div
			v-if="!loading && data && data.length"
			class="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 xl:max-w-6xl max-w-4xl"
		>
			<!-- Tile 1 -->
			<div
				v-for="book in data"
				:key="book.id"
				class="flex bg-gray-200 rounded-lg p-4 m-2"
			>
				<div class="bg-gray-400 rounded-lg">
					<img
						v-if="book.volumeInfo.imageLinks"
						:src="book.volumeInfo.imageLinks.smallThumbnail"
						alt="book-cover"
					/>
					<img v-else src="../assets/placeholder-cover.jpg" alt="book-cover" />
				</div>
				<div class="flex flex-col items-start ml-4">
					<h4 class="text-xl font-semibold text-left">
						{{ book.volumeInfo.title }}
					</h4>
					<p class="text-sm text-left max-h-10 overflow-hidden">
						Some text
					</p>
					<a
						class="p-2 leading-none rounded font-medium mt-3 bg-gray-400 text-xs uppercase"
						href="#"
						>Click Here</a
					>
				</div>
			</div>
		</div>
		<!-- Component End  -->
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

		function fetchData() {
			loading.value = true;
			// I prefer to use fetch
			// you can use use axios as an alternative
			return fetch(
				"https://www.googleapis.com/books/v1/volumes?q=flowers+inauthor:keyes&key=AIzaSyCnxO8EeJcBwjG7aFjSw3BeA09SPNBQUD0",
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
		};
	},
};
</script>
