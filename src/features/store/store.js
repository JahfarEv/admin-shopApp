// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import userReducer from "./user/userSlice";
import shopReducer from "./shop/shopSlice";
import productReducer from "./products/productSlice";
import commissionReducer from "./commision/commisionSlice";
import salesmanReducer from "./salesman/salesmanSlice";
import salesmanProfileReducer from "./salesman/salesmanSlice";
import salesmansShopReducer from "./salesman/shopSlice";
import salesmanRegisterReducer from "./salesman/registrationSlice";
import managerRegistrationReducer from "./manager/managerRegistrationSlice";
import managerReducer from "./managers/managersSlice"
import salesmansReducer from "./salesmans/salesmanSlice"


export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    shops: shopReducer,
    products: productReducer,
    commission: commissionReducer,
    salesman: salesmanReducer,
    salesmanProfile: salesmanProfileReducer,
    shop: salesmansShopReducer,
    salesmanRegister: salesmanRegisterReducer,
    managerRegistration: managerRegistrationReducer,
    manager: managerReducer, // 👈 must match useSelector(state.manager)
    salesman: salesmansReducer,

  },
});
