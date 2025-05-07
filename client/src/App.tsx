import {
  createBrowserRouter,
  createRoutesFromChildren,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";

import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Registration from "./components/RegistrationForm/RegistrationForm";
import ProtectedRoute from "./utils/ProtectedRoute";
import Profile from "./pages/Profile/Profile";
import NotFound from "./pages/NotFound";
import Cart from "./components/Cart/Cart";
import OneCardProduct from "./components/OneCardProduct/OneCardProduct";
import Favorites from "./pages/Favorites";
import ProfileLayout from "./layouts/ProfileLayout";
import { Payments } from "@mui/icons-material";
import Promocodes from "./pages/Profile/Promocodes";
import Reviews from "./pages/Profile/Reviews";
import Orders from "./pages/Profile/Orders";
import Data from "./pages/Profile/Data";
import Admin from "./components/Admin/Admin";
import Index from "./pages/Index";
import Sales from "./pages/Profile/Sales";
import { useAppSelector } from "./components/redux/hook";

function App() {
  const { user } = useAppSelector((store) => store.UserSlice);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Index />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="register" element={<Registration />} />
        <Route path="cart" element={<Cart />} />
        <Route path="product/:id" element={<OneCardProduct />} />
        <Route path="favorites" element={<Favorites />} />
        <Route
          path="profile"
          element={<ProtectedRoute authUser={user?.role} redirectTo="/admin" />}
        >
          <Route element={<ProfileLayout />}>
            <Route index element={<Orders />} />
            <Route path="orders" element={<Orders />} />
            <Route path="payments" element={<Payments />} />
            <Route path="promo" element={<Promocodes />} />
            <Route path="sale" element={<Sales />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="data" element={<Data />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
