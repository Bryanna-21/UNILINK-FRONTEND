import Feed from "../pages/Feed";
import Profile from "../pages/Profile";
import Communities from "../pages/Communities";
import Events from "../pages/Events";

export const routes = [
  {
    path: "/",
    component: Feed
  },
  {
    path: "/profile",
    component: Profile
  },
  {
    path: "/communities",
    component: Communities
  },
  {
    path: "/events",
    component: Events
  }
];
