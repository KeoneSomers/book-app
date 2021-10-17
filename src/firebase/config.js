import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseApp = initializeApp({
	apiKey: "AIzaSyB33uX0rERjXmuqHW8YO7nTNPAo1BDxlp8",
	authDomain: "book-app-f893c.firebaseapp.com",
	projectId: "book-app-f893c",
	storageBucket: "book-app-f893c.appspot.com",
	messagingSenderId: "685221608565",
	appId: "1:685221608565:web:309cf1f7721c6c03eb4c3c",
});

const auth = getAuth();
const db = getFirestore();

export { auth, db };
