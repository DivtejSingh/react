import React from "react";
import CIcon from "@coreui/icons-react";
import CategoryIcon from "@mui/icons-material/Category";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import DashboardIcon from "@mui/icons-material/Dashboard";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import FoodBankIcon from "@mui/icons-material/FoodBank";
import RemoveIcon from "@mui/icons-material/Remove";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

import { cilBell, cilCalculator, cilChartPie, cilCursor, cilDescription, cilDrop, cilNotes, cilPencil, cilPuzzle, cilSpeedometer, cilStar, cilLocationPin } from "@coreui/icons";
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";

const _nav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/dashboard",
    icon: <DashboardIcon style={{ marginRight: "7px" }} />,
  },

  {
    component: CNavGroup,
    name: "Restaurant",
    to: "/restaurant",
    icon: <LunchDiningIcon style={{ marginRight: "7px" }} />,
    items: [
      {
        component: CNavGroup,
        name: "Categories",
        to: "/restaurant/meal",
        icon: <CategoryIcon style={{ marginRight: "7px" }} />,
        items: [
          {
            component: CNavItem,
            name: "Categories",
            to: "/restaurant/addmeals",
            icon: <RemoveIcon style={{ marginRight: "7px", marginLeft: "10px" }} />,
          },
          {
            component: CNavItem,
            name: "Add Subcategories",
            to: "/restaurant/addcategories",
            icon: <RemoveIcon style={{ marginRight: "7px", marginLeft: "10px" }} />,
          },
        ],
      },

      {
        component: CNavGroup,
        name: "Product",
        to: "/restaurant/products",
        icon: <RestaurantMenuIcon style={{ marginRight: "7px" }} />,
        items: [
          {
            component: CNavItem,
            name: "All Product",
            to: "/restaurant/allproducts",
            icon: <RemoveIcon style={{ marginRight: "7px", marginLeft: "10px" }} />,
          },
          {
            component: CNavItem,
            name: "Add Products",
            to: "/restaurant/addproducts",
            icon: <RemoveIcon style={{ marginRight: "7px", marginLeft: "10px" }} />,
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Places",
        to: "/restaurant/places",
        icon: <LocationOnOutlinedIcon style={{ marginRight: "7px" }} />,
        items: [
          {
            component: CNavItem,
            name: "AllPlaces",
            to: "/restaurant/allplaces",
            icon: <RemoveIcon style={{ marginRight: "7px", marginLeft: "10px" }} />,
          },
          {
            component: CNavItem,
            name: "AddPlaces",
            to: "/restaurant/addplaces",
            icon: <RemoveIcon style={{ marginRight: "7px", marginLeft: "10px" }} />,
          },
        ],
      },

      {
        component: CNavItem,
        name: "Orders",
        to: "/restaurant/orders",
        icon: <FoodBankIcon style={{ marginRight: "7px" }} />,
      },
    ],
  },

 
];

export default _nav;
