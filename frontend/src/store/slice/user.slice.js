import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: {},
  token: '',
}

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    setToken: (state, action) => {
      state.token = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUser, setToken } = userInfoSlice.actions

export default userInfoSlice.reducer
