import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: '',
  userInfo: {},
}

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setSidebarShow: (state, action) => {
      state.sidebarShow = action.payload
    },
    setUnfoldable: (state, action) => {
      state.sidebarUnfoldable = action.payload
    },
  },
})

export const { setSidebarShow, setUnfoldable } = configSlice.actions

export default configSlice.reducer
