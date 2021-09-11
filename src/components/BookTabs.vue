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
				>Explore tab</router-link
			>
			to find books<br />
			and keep track of them to your collection!
		</p>
	</div>

	<pre v-if="data" class="bg-light-600 mt-5 px-5 rounded-xl">
		<code>
{{ data }}
		</code>
	</pre>
</template>

<script>
import { ref, onMounted } from "vue";
import getUser from "../composables/getUser";
import axios from "axios";

export default {
	setup() {
		const data = ref(null);
		const loading = ref(true);
		const fetchError = ref(null);
		const { user } = getUser();

		async function getData() {
			console.log(user.value.uid);
			var result = await axios({
				method: "POST",
				url: "https://book-app-db-api.herokuapp.com/graphql",
				data: {
					query: `
                            {
								getUserBooks(userId: "${user.value.uid}")
								{
									id,
									userId,
									bookId
									isReadLater,
									isReading
								}
							}
                        `,
				},
			});
			console.log(user.value.uid);
			data.value = result.data.data.getUserBooks;
		}

		onMounted(() => {
			getData();
		});

		return {
			data,
			loading,
			fetchError,
			getData,
			user,
		};
	},
};
</script>

<style></style>
