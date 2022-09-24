import { CButton, CCol, CContainer, CRow } from '@coreui/react'
import React from 'react'
import { useState } from 'react'
import TestService from '../../services/test.service'

const testService = new TestService()

const Test = () => {
  const [data, setData] = useState({ data: null })
  const updateData = (newState) => {
    console.log(newState)
    setData((previousState) => ({
      ...previousState,
      ...newState,
    }))
  }

  const getData = async () => {
    try {
      const res = await testService.getTests()
      updateData({ data: res.data })
    } catch (error) {
      console.log('error', error)
    }
  }
  const getMultipleResponse = async () => {
    try {
      const PromiseArr = []
      PromiseArr.push(
        testService.getTest2().then((result) => new Promise((resolve) => resolve(result))),
      )
      const res = await testService.getTest2().then((a) => console.log('a', a))
      console.log(res)
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <CContainer fluid>
      <CRow>
        <CCol>
          <h1>Test</h1>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CButton color="primary" variant="outline" onClick={getData}>
            get api
          </CButton>
          {data.data && data.data}
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CButton color="primary" variant="outline" onClick={getMultipleResponse}>
            get api multiple response
          </CButton>
          {data.data && data.data}
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Test
