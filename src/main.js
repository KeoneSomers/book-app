import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { auth } from "./firebase/config";
import "windi.css";

// only render the app once we have the auth state back from firebase
// (and if the app has not already been set)
// doing this allows the user to stay logged in even if they refresh the page
let app;
auth.onAuthStateChanged(() => {
	if (!app) {
		app = createApp(App)
			.use(router)
			.mount("#app");
	}
});
