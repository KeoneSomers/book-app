import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Welcome from "../views/Welcome.vue";
import Login from "../views/auth/Login.vue";
import Signup from "../views/auth/Signup.vue";
import BookDetails from "../views/BookDetails.vue";
import Explore from "../views/Explore.vue";
import { projectAuth } from "../firebase/config";

// auth guard function
const requireAuth = (to, from, next) => {
	// get current user
	let user = projectAuth.currentUser;

	if (!user) {
		// if we don't have a user, redirect them to login
		next({ name: "Welcome" });
	} else {
		// if user is logged in, continue to route
		next();
	}
};

const requireNoAuth = (to, from, next) => {
	// get current user
	let user = projectAuth.currentUser;
	if (user) {
		// if we have a user, redirect them to the personal page
		next({ name: "Home" });
	} else {
		// if user is not logged in, continue to route
		next();
	}
};

const routes = [
	{
		path: "/welcome",
		name: "Welcome",
		component: Welcome,
		beforeEnter: requireNoAuth,
	},
	{
		path: "/login",
		name: "Login",
		component: Login,
		beforeEnter: requireNoAuth,
	},
	{
		path: "/signup",
		name: "Signup",
		component: Signup,
		beforeEnter: requireNoAuth,
	},
	{
		path: "/",
		name: "Home",
		component: Home,
		beforeEnter: requireAuth,
	},
	{
		path: "/explore",
		name: "Explore",
		component: Explore,
		beforeEnter: requireAuth,
	},
	{
		path: "/book-details/:id",
		name: "BookDetails",
		component: BookDetails,
		beforeEnter: requireAuth,
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;
