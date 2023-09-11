import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./error-page";
import AboutUtsav from "./Pages/About/AboutUtsav";
import AboutSanjay from "./Pages/About/AboutSanjay";
import AboutParthiv from "./Pages/About/AboutParthiv";
import AboutBilal from "./Pages/About/AboutBilal";
import AboutKristijan from "./Pages/About/AboutKristijan";
import AboutOmer from "./Pages/About/AboutOmer";
import About from "./Pages/Home/About";
// pages includes
import Home from "./Pages/Home";
import Details from "./Pages/Details";
import Layout from "./Components/Layouts/Layout";
import RestaurantListing from "./Components/RestaurantListing/Filter";
import Reservation from "./Pages/Details/Reservation";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import RestaurantApproval from "./Pages/RestaurantApprovals/RestaurantApproval";
import UserProfile from "./Pages/User-Profile";

const routes = [
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/user-profile",
    element: <UserProfile />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/RestaurantApproval",
    element: <RestaurantApproval />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/reservation",
    element: <Reservation />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/details/:id",
    element: <Details />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/about",
    element: <About />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/restaurantlisting",
    element: <RestaurantListing />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/contributors/utsav-shrestha",
    element: <AboutUtsav />,
  },
  {
    path: "/contributors/sanjay-george",
    element: <AboutSanjay />,
  },
  {
    path: "/contributors/kikolazeski",
    element: <AboutKristijan />,
  },
  {
    path: "/contributors/parthiv-jani",
    element: <AboutParthiv />,
  },
  {
    path: "/contributors/muhammad-bilal",
    element: <AboutBilal />,
  },
  {
    path: "/contributors/omer-zogubi",
    element: <AboutOmer />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <ErrorPage />,
  },
];

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        {routes.map((route, i) => {
          return (
            <Route
              key={i}
              index={route.path === "/"}
              path={route.path}
              element={route.element}
              errorElement={route.errorElement}
            />
          );
        })}
      </Route>
    )
  );

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
