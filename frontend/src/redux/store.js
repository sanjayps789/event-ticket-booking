import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";  

import authReducer from "./slices/authSlice";
// import eventReducer from "./slices/eventSlice";
// import bookingReducer from "./slices/bookingSlice";

const rootReducer = combineReducers({
  auth: authReducer,
//   event: eventReducer,
//   booking: bookingReducer,
});

const persistConfig = {
  key: "root",
  storage: storageSession,   // 👈 maattam ivide
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);