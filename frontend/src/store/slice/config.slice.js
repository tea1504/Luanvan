import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarShow: true,
  sidebarFoldable: true,
  language: 'vi',
  loading: false,
  formatCodeOD: 1,
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
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setFormatCodeOD: (state, action) => {
      state.formatCodeOD = action.payload
    },
  },
})

export const { setSidebarShow, setFoldable, setLanguage, setLoading, setFormatCodeOD } =
  configSlice.actions

export default configSlice.reducer
