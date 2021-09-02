import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { projectAuth } from "./firebase/config";
import "windi.css";

// only render the app once we have the auth state back from firebase
// (and if the app has not already been set)
// doing this allows the user to stay logged in even if they refresh the page
let app;
projectAuth.onAuthStateChanged(() => {
	if (!app) {
		app = createApp(App)
			.use(router)
			.mount("#app");
	}
});
