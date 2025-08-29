import {
  LuLayoutDashboard,
  LuHandCoins,
  LuWalletMinimal,
  LuLogOut,
  LuRepeat,
  LuTrendingUpDown,
} from "react-icons/lu";

import { FaBitcoin , FaPiggyBank} from "react-icons/fa";


export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "02",
    label: "Income",
    icon: LuWalletMinimal,
    path: "/income",
  },
  {
    id: "03",
    label: "Expense",
    icon: LuHandCoins,
    path: "/expense",
  },

  {
    id: "04", // Make sure the ID is unique
    label: "Budgets",
    icon: FaPiggyBank, // Or your chosen icon
    path: "/budgets",   // This must match the route in App.jsx
  },

  {
        id: "05",
        label: "Subscriptions",
        icon: LuRepeat,
        path: "/subscriptions",
  },

  {
        id: "06",
        label: "Stocks",
        icon: LuTrendingUpDown,
        path: "/stocks",
    },

    {id:"07" , label: "Crypto",    path: "/crypto",    icon: FaBitcoin },

    

  
  
];
