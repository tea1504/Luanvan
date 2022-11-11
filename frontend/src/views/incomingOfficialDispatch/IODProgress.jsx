import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { useState } from 'react'
import {
  CButton,
  CCol,
  CFormInput,
  CFormLabel,
  CFormText,
  CProgress,
  CProgressBar,
  CRow,
  CSpinner,
  CToast,
  CToastBody,
  CToaster,
  CToastHeader,
} from '@coreui/react'
import ODPreview from '../officialDispatch/ODPreview'
import BaseService from 'src/services/base.service'
import Constants from 'src/constants'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setLoading } from 'src/store/slice/config.slice'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useNavigate } from 'react-router-dom'
import Strings from 'src/constants/strings'
import Screens from 'src/constants/screens'

const service = new BaseService()
const MySwal = withReactContent(Swal)

function IODProgress({ data, dataTemp, updateData }) {
  const val = data.map((el, ind) => {
    return { value: ind, label: el.name }
  })

  let loading = useSelector((state) => state.config.loading)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [state, setState] = useState(-1)
  const [totalPage, setTotalPage] = useState(1)
  const [value, setValue] = useState(0)

  const handleClickButton = async () => {
    try {
      if (state !== -1) {
        dispatch(setLoading(true))
        const result = await service.api.postFormData({
          path: Constants.ApiPath.POST_PROCESS_OD,
          data: { file: data[state], totalPage: totalPage },
          config: {
            onDownloadProgress: (progressEvent) => {
              var str = progressEvent.currentTarget.response
              var percent = str.split('|')
              var a = percent[percent.length - 1].split('/')
              setValue((a[0] * 100) / a[1])
            },
          },
        })
        const response = JSON.parse(result.data.substring(result.data.indexOf('#') + 1))
        console.log('response', response.data)
        dispatch(setLoading(false))
        if (response.status !== 200) {
          setValue(0)
          return MySwal.fire({
            title: Strings.Message.COMMON_ERROR,
            icon: 'error',
            text: response.message,
          })
        }
        updateData(response.data)
      }
    } catch (error) {
      dispatch(setLoading(false))
      switch (error.status) {
        case 401:
          MySwal.fire({
            title: Strings.Message.COMMON_ERROR,
            icon: 'error',
            text: error.message,
          }).then(() => {
            localStorage.clear(Constants.StorageKeys.ACCESS_TOKEN)
            localStorage.clear(Constants.StorageKeys.USER_INFO)
            navigate(Screens.LOGIN)
          })
          break
        default:
          MySwal.fire({
            title: Strings.Message.COMMON_ERROR,
            icon: 'error',
            text: error.message,
          })
          break
      }
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <Select
          options={val}
          onChange={(selectedItem) => {
            setState(selectedItem.value)
          }}
        />
      </CCol>
      <CCol xs={12} className="my-1">
        <CProgress>
          <CProgressBar value={value} color="success" variant="striped" animated />
        </CProgress>
      </CCol>
      <CCol xs={12}>
        <CFormLabel>Số trang của văn bản</CFormLabel>
        <CFormInput
          type="number"
          value={totalPage}
          min={1}
          onChange={(e) => setTotalPage(e.target.value)}
        />
        <CFormText>Số trang được hiểu là từ trang đầu đến phần có chữ ký</CFormText>
      </CCol>
      <CCol>
        <CButton disabled={loading} onClick={handleClickButton} className="mt-3 w-100">
          {loading && (
            <>
              <CSpinner size="sm" /> {Strings.Common.PROCESSING}
            </>
          )}{' '}
          {!loading && Strings.Common.PROCESS}
        </CButton>
      </CCol>
      <CCol xs={12} style={{ height: '60vh' }} className="mt-3">
        {state !== -1 && <ODPreview data={dataTemp[state].path} />}
      </CCol>
    </CRow>
  )
}

IODProgress.prototype = {
  data: PropTypes.array.isRequired,
  dataTemp: PropTypes.array.isRequired,
  updateData: PropTypes.func.isRequired,
}

export default IODProgress
