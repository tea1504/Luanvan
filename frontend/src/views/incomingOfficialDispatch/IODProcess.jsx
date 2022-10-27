import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { useState } from 'react'
import { CButton, CSpinner, CToast, CToastBody, CToaster, CToastHeader } from '@coreui/react'
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

function IODProcess({ data, dataTemp, updateData }) {
  const val = data.map((el, ind) => {
    return { value: ind, label: el.name }
  })

  let loading = useSelector((state) => state.config.loading)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [state, setState] = useState(-1)
  const [toast, setToast] = useState()

  const exampleToast = (message) => (
    <CToast>
      <CToastHeader closeButton>
        <svg
          className="rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          <rect width="100%" height="100%" fill="#007aff"></rect>
        </svg>
        <strong className="me-auto">CoreUI for React.js</strong>
        <small>7 min ago</small>
      </CToastHeader>
      <CToastBody>{message}</CToastBody>
    </CToast>
  )

  const handleClickButton = async () => {
    try {
      dispatch(setLoading(true))
      const result = await service.api
        .postFormData({
          path: Constants.ApiPath.POST_PROCESS_OD,
          data: { file: data[state] },
          config: {
            onDownloadProgress: (progressEvent) => {
              setToast(exampleToast(progressEvent.loaded))
            },
          },
        })
      updateData(JSON.parse(result.data.split('#')[1]).data)
      dispatch(setLoading(false))
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
    <div>
      <Select
        options={val}
        onChange={(selectedItem) => {
          setState(selectedItem.value)
        }}
      />
      <CButton disabled={loading} onClick={handleClickButton} className="mt-3 w-100">
        {loading && (
          <>
            <CSpinner size="sm" /> {Strings.Common.PROCESSING}
          </>
        )}{' '}
        {!loading && Strings.Common.SUBMIT}
      </CButton>

      <div style={{ height: '60vh' }} className="mt-3">
        {state !== -1 && <ODPreview data={dataTemp[state].path} />}
      </div>
      <CToaster push={toast} placement="top-end" />
    </div>
  )
}

IODProcess.prototype = {
  data: PropTypes.array.isRequired,
  dataTemp: PropTypes.array.isRequired,
  updateData: PropTypes.func.isRequired,
}

export default IODProcess
