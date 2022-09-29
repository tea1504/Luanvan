import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storageSession from 'redux-persist/lib/storage/session'
import userSlice from './slice/user.slice'
import configSlice from './slice/config.slice'
import bookSlide from './slice/book.slide'
import typeSlide from './slice/type.slide'

const reducers = combineReducers({
  user: userSlice,
  config: configSlice,
  book: bookSlide,
  type: typeSlide,
})

const persistConfig = {
  key: 'global',
  version: 1,
  storage: storageSession,
}

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})
