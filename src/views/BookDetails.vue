<template>
	<div v-if="!loading">
		<h1 class="">Book Details</h1>
		<img
			class="rounded"
			v-if="data.volumeInfo.imageLinks"
			:src="data.volumeInfo.imageLinks.smallThumbnail"
			alt="book-cover"
		/>
		<img
			v-else
			class="rounded"
			src="../assets/placeholder-cover.jpg"
			alt="book-cover"
		/>
		<ul v-if="data">
			<li>Title: {{ data.volumeInfo.title }}</li>
			<li>Description: <span v-html="data.volumeInfo.description"></span></li>
		</ul>
	</div>
	<div v-else>
		<p>Loading...</p>
	</div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

export default {
	setup() {
		const route = useRoute();
		const data = ref(null);
		const loading = ref(true);
		const error = ref(null);

		onMounted(() => {
			loading.value = true;
			return fetch(
				"https://www.googleapis.com/books/v1/volumes/" +
					route.params.id +
					"?key=AIzaSyB33uX0rERjXmuqHW8YO7nTNPAo1BDxlp8",
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
					data.value = json;
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
		});

		return {
			data,
			loading,
			error,
		};
	},
};
</script>
