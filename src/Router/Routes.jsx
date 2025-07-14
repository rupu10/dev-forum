import {
  createBrowserRouter
} from "react-router";
import RootLayOut from "../layOuts/RootLayOut";
import Home from "../pages/Home/Home/Home";
import JoinUs from "../Authentication/JoinUs";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayOut,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: '/join',
        Component: JoinUs
      }
    ]
  },
]);