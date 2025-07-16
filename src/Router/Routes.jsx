import { createBrowserRouter } from "react-router";
import RootLayOut from "../layOuts/RootLayOut";
import Home from "../pages/Home/Home/Home";
import JoinUs from "../Authentication/JoinUs";
import Register from "../Authentication/Register";
import DashboardLayOut from "../layOuts/DashboardLayout";
import Profile from "../Dashboard/Pofile/Profile";
import AddPost from "../Dashboard/AddPost/AddPost";
import PrivateRoutes from "./PrivateRoutes";
import MyPosts from "../Dashboard/MyPosts/MyPosts";
import Membership from "../pages/Membership/Membership";
import AdminRoute from "./AdminRoutes";
import Reports from "../Dashboard/Reports/Reports";
import Announcement from "../Dashboard/Announcement/Announcement";
import ManageUsers from "../Dashboard/ManageUsers/ManageUsers";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayOut,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/join",
        Component: JoinUs,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: '/membership',
        element: <PrivateRoutes><Membership></Membership></PrivateRoutes>
      }
    ],
  },
  {
    path: '/dashboard',
    element: <PrivateRoutes><DashboardLayOut></DashboardLayOut></PrivateRoutes>,
    children: [
      {
        path: 'profile',
        Component: Profile
      },
      {
        path: 'addPost',
        Component: AddPost
      },
      {
        path: 'myPost',
        Component: MyPosts
      },
      // admin routes
      {
        path: 'adminProfile',
        element: <AdminRoute><AdminRoute></AdminRoute></AdminRoute>
      },
      {
        path: 'manageUsers',
        element: <AdminRoute><ManageUsers></ManageUsers></AdminRoute>
      },
      {
        path:'reports',
        element: <AdminRoute><Reports></Reports></AdminRoute>
      },
      {
        path: 'announcement',
        element: <AdminRoute><Announcement></Announcement></AdminRoute>
      }
    ]
  }
]);
