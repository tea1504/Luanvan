import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: [],
  rowsPerPage: 10,
  total: 0,
  page: 1,
}

export const IODSlide = createSlice({
  name: 'IOD',
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data = action.payload
    },
    setRowPerPage: (state, action) => {
      state.rowsPerPage = action.payload
    },
    setTotal: (state, action) => {
      state.total = action.payload
    },
    setPage: (state, action) => {
      state.page = action.payload
    },
  },
})

export const { setData, setRowPerPage, setTotal, setPage } = IODSlide.actions

export default IODSlide.reducer
