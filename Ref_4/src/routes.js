import React from "react";
import { getFromLocalStorage } from "./utils/LocalStorageUtills";

const DashboardProtected = ({ children }) => {
  const admin = getFromLocalStorage("useruid");
  return admin ? children : <Navigate to="/login" />;
};
const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
// const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
// const Typography = React.lazy(() => import('./views/theme/typography/Typography'))
const AddProduct = React.lazy(() => import("./views/restaurant/products/Addproduct"));

//restaurantt

// restaurant

const Product = React.lazy(() => import("./views/restaurant/products/Product"));
const Meal = React.lazy(() => import("./views/restaurant/meal/AddMeals"));
const Order = React.lazy(() => import("./views/restaurant/orders/Order"));
const Categories = React.lazy(() => import("./views/restaurant/meal/AddCategories"));
const AddPlaces = React.lazy(() => import("./views/restaurant/places/AddPlaces"));
const AllPlaces =  React.lazy(() => import("./views/restaurant/places/AllPlaces"))


const Widgets = React.lazy(() => import("./views/widgets/Widgets"));
const routes = [
  { path: "/", exact: true, name: "Home" },
  {
    path: "/dashboard",
    name: "Dashboard",
    element: (
      <DashboardProtected>
        <Dashboard />
      </DashboardProtected>
    ),
  },
  {
    path: "/restaurant/allproducts",
    name: "All Product",
    element: (
      <DashboardProtected>
        <Product />
      </DashboardProtected>
    ),
  },
  {
    path: "/restaurant/addproducts",
    name: "Add Products",
    element: (
      <DashboardProtected>
        <AddProduct />
      </DashboardProtected>
    ),
  },
  {
    path: "/restaurant/addmeals",
    name: "Add Meals",
    element: (
      <DashboardProtected>
        <Meal />
      </DashboardProtected>
    ),
  },
  {
    path: "/restaurant/addcategories",
    name: "Add Categories",
    element: (
      <DashboardProtected>
        <Categories />
      </DashboardProtected>
    ),
  },
  {
    path: "/restaurant/orders",
    name: "Orders",
    element: (
      <DashboardProtected>
        <Order />
      </DashboardProtected>
    ),
  },
  {
    path: "/restaurant/allplaces",
    name: "AllPlaces",
    element: (
      <DashboardProtected>
        <AllPlaces />
      </DashboardProtected>
    ),
  },
  {
    path: "/restaurant/addplaces",
    name: "AddPlaces",
    element: (
      <DashboardProtected>
        <AddPlaces />
      </DashboardProtected>
    ),
  },

  {
    path: "/widgets",
    name: "Widgets",
    element: (
      <DashboardProtected>
        <Widgets />
      </DashboardProtected>
    ),
  },
];
export default routes;
