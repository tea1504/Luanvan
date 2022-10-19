import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: [],
  rowsPerPage: 10,
  total: 0,
  page: 1,
}

export const organizationSlide = createSlice({
  name: 'organization',
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

export const { setData, setRowPerPage, setTotal, setPage } = organizationSlide.actions

export default organizationSlide.reducer
