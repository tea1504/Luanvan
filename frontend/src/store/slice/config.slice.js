import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarShow: true,
  sidebarFoldable: true,
  language: 'vi',
}

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setSidebarShow: (state, action) => {
      state.sidebarShow = action.payload
    },
    setFoldable: (state, action) => {
      state.sidebarFoldable = action.payload
    },
    setLanguage: (state, action) => {
      state.language = action.payload
    },
  },
})

export const { setSidebarShow, setFoldable, setLanguage } = configSlice.actions

export default configSlice.reducer
