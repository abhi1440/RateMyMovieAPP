import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import store from "./redux/store.js";
import { Provider } from "react-redux";
import {
  Route,
  RouterProvider,
  createRoutesFromElements,
  createBrowserRouter
} from "react-router-dom";

// Auth
import AdminRoute from "./pages/Admin/AdminRoute.jsx";
import GenreList from "./pages/Admin/GenreList.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import PrivateRoute from "./pages/Auth/PrivateRoute.jsx";

// Main pages
import Home from "./pages/Home.jsx";
import Profile from "./pages/User/Profile.jsx";
import AdminMoviesList from "./pages/Admin/AdminMoviesList.jsx";
import UpdateMovie from "./pages/Admin/UpdateMovie.jsx";
import CreateMovie from "./pages/Admin/CreateMovie.jsx";
import AllMovies from "./pages/Movies/AllMovies.jsx";
import MovieDetails from "./pages/Movies/MovieDetails.jsx";
import AllComments from "./pages/Admin/AllComments.jsx";
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="movies" element={<AllMovies />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="movies/:id" element={<MovieDetails />} />

      <Route element={<PrivateRoute />}>
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="admin/movies/genre" element={<GenreList />} />
        <Route path="admin/movies/create" element={<CreateMovie />} />
        <Route path="admin/movies-list" element={<AdminMoviesList />} />
        <Route path="admin/movies/update/:id" element={<UpdateMovie />} />
        <Route path="admin/movies/dashboard" element={<AdminDashboard />} />
        <Route path="admin/movies/comments" element={<AllComments />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
