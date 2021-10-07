import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/chat", component: "chat-page" },
]);
