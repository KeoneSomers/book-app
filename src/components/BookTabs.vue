<template>
	<hr class="mt-6" />

	<!-- super cool bookshelf -->
	<div v-for="shelf in bookcase" :key="shelf.Id">
		<h3 class="mb-5 mt-10 font-bold">{{ shelf.label }}</h3>
		<div class="relative">
			<span
				class="absolute right-0 top-30 border-width-2px font-bold border-light-50 bg-dark-200 text-light-50 -mr-5 w-10 h-10 z-50 rounded-full text-center"
				>></span
			>
			<div class="bg-light-200 w-full p-5 flex rounded overflow-x-auto">
				<div class="flex flex-nowrap space-x-5">
					<div
						v-for="book in shelf.books"
						:key="book.id"
						class="relative rounded group w-40 h-60 bg-dark-400 hover:cursor-pointer overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out"
					>
						<img
							v-if="bookData.find((x) => x.id == book.bookId)"
							class="w-full group-hover:opacity-50 transition"
							:src="
								bookData.find((x) => x.id == book.bookId).volumeInfo.imageLinks
									.thumbnail
							"
							:title="
								bookData.find((x) => x.id == book.bookId).volumeInfo.title
							"
							:alt="bookData.find((x) => x.id == book.bookId).volumeInfo.title"
						/>
						<span
							@click="removeBook(book)"
							title="Remove Book"
							class="absolute top-2 right-2 p-1 w-9 text-center font-bold border-light-50 text-light-50 border-width-2px rounded-full bg-dark-200 opacity-0 group-hover:opacity-100"
						>
							X
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
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
		const bookcase = ref([
			{
				id: "1",
				label: "My Library",
				icon: "",
				books: [],
			},
			{
				id: "2",
				label: "Wishlist",
				icon: "",
				books: [],
			},
			{
				id: "3",
				label: "To Be Read",
				icon: "",
				books: [],
			},
			{
				id: "4",
				label: "Finished Reading",
				icon: "",
				books: [],
			},
		]);

		const bookData = ref([]);
		const loading = ref(true);
		const fetchError = ref(null);
		const { user } = getUser();

		onMounted(() => {
			getMyLibraryBooks();
		});

		async function getMyLibraryBooks() {
			const q = query(
				collection(db, "usersBooksRecords"),
				where("userId", "==", user.value.uid),
				where("isWishlisted", "!=", true)
			);

			const querySnapshot = await getDocs(q);
			querySnapshot.forEach((doc) => {
				bookcase.value[0].books.push({
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
						// only do this if book data is not already in the array
						bookData.value.push(response.data);
					})
					.catch(function(error) {
						console.log(error);
					});
			});
		}

		const removeBook = async (item) => {
			// remove from db
			await deleteDoc(doc(db, "usersBooksRecords", item.id));

			// remove from local array
			const index = bookcase.value[0].books.indexOf(item);
			if (index > -1) {
				bookcase.value[0].books.splice(index, 1);
			}
		};

		return {
			bookcase,
			bookData,
			loading,
			fetchError,
			user,
			removeBook,
		};
	},
};
</script>
