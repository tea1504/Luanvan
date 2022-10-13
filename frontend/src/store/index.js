import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storageSession from 'redux-persist/lib/storage/session'
import userSlice from './slice/user.slice'
import configSlice from './slice/config.slice'
import bookSlide from './slice/book.slide'
import typeSlide from './slice/type.slide'
import languageSlide from './slice/language.slide'
import securitySlide from './slice/security.slide'
import prioritySlide from './slice/priority.slide'
import rightSlide from './slice/right.slide'
import officerStatusSlide from './slice/officerStatus.slide'
import statusSlide from './slice/status.slide'

const reducers = combineReducers({
  user: userSlice,
  config: configSlice,
  book: bookSlide,
  type: typeSlide,
  language: languageSlide,
  security: securitySlide,
  priority: prioritySlide,
  priority: prioritySlide,
  right: rightSlide,
  officerStatus: officerStatusSlide,
  status: statusSlide,
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
