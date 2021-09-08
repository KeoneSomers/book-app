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

	<button @click="getData()">Get Data</button>

	<button @click="addData()">Post Data</button>

	<div v-if="data" class="bg-blue">{{ data }}</div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";

export default {
	setup() {
		const data = ref(null);
		const loading = ref(true);
		const fetchError = ref(null);

		async function getData() {
			var result = await axios({
				method: "POST",
				url: "https://book-app-db-api.herokuapp.com/graphql",
				data: {
					query: `
                            {
								allUserBooks {
									userId
								}
							}
                        `,
				},
			});
			data.value = result.data.data.allUserBooks;
		}

		async function addData() {
			var result = await axios({
				method: "POST",
				url: "https://book-app-db-api.herokuapp.com/graphql",
				data: {
					query: `
                            mutation 
								createUserBook(
									data: {
										bookId: "my book",
										userId: "test user"
										}
									){
									userId
								}
							
                        `,
				},
			});
			console.log(result);
		}

		return {
			data,
			loading,
			fetchError,
			getData,
			addData,
		};
	},
};
</script>

<style></style>
