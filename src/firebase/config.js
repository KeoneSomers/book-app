import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyB33uX0rERjXmuqHW8YO7nTNPAo1BDxlp8",
	authDomain: "book-app-f893c.firebaseapp.com",
	projectId: "book-app-f893c",
	storageBucket: "book-app-f893c.appspot.com",
	messagingSenderId: "685221608565",
	appId: "1:685221608565:web:309cf1f7721c6c03eb4c3c",
};

// init firebase
firebase.initializeApp(firebaseConfig);

// init services
const projectAuth = firebase.auth();
const projectFirestore = firebase.firestore();

// timestamp
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { projectAuth, projectFirestore, timestamp };
