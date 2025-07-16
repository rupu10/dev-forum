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
import ManageUsers from "../Dashboard/ManageUsers/ManageUsers";
import MakeAnnouncement from "../Dashboard/MakeAnnouncement/MakeAnnouncement";
import Announcement from "../Dashboard/Announcement/Announcement";
import PostDetails from "../PostDetails/PostDetails";
import CommentList from "../Dashboard/CommentLists/CommentList";

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
        path: '/announcement',
        Component: Announcement
      },
      {
        path: '/membership',
        element: <PrivateRoutes><Membership></Membership></PrivateRoutes>
      },
      {
        path: '/posts/:postId',
        Component: PostDetails
      },
      {
  path: "/comments/:postId",
  Component: CommentList,
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
        path: 'makeAnnouncement',
        element: <AdminRoute><MakeAnnouncement></MakeAnnouncement></AdminRoute>
      }
    ]
  }
]);
