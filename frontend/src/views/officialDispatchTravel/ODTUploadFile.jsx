import React from 'react'
import PropTypes from 'prop-types'
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
  CWidgetStatsF,
} from '@coreui/react'
import { FaPaperclip, FaTrash } from 'react-icons/fa'
import Strings from 'src/constants/strings'
import Helpers from 'src/commons/helpers'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setLoading } from 'src/store/slice/config.slice'
import Constants from 'src/constants'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import BaseService from 'src/services/base.service'
import Screens from 'src/constants/screens'
import ODPreview from '../officialDispatch/ODPreview'

const service = new BaseService()
const MySwal = withReactContent(Swal)

function ODTUploadFile({
  state,
  extension,
  handleInputFileOnChange,
  updateData,
  handleDeleteFile,
}) {
  let loading = useSelector((state) => state.config.loading)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [process, setProcess] = useState({})
  const [value, setValue] = useState(0)
  const [totalPage, setTotalPage] = useState(1)

  const renderFile = () => {
    return (
      <CRow className="px-0 mx-0" xs={{ cols: 1, gutter: 4 }} md={{ cols: state.fileTemp.length }}>
        {state.fileTemp.map((el, ind) => (
          <CCol xs key={ind}>
            <CWidgetStatsF
              icon={extension(el.name).icon}
              color={extension(el.name).color}
              padding={false}
              title={Helpers.formatBytes(el.size)}
              value={el.name}
              footer={
                <CRow>
                  <CCol
                    className="text-center"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setProcess(el)}
                  >
                    {Strings.Common.CHOOSE}
                  </CCol>
                  <CCol>
                    <CButton
                      variant="ghost"
                      color="secondary"
                      className="w-100 m-0 p-0"
                      onClick={() => {
                        handleDeleteFile(el)
                      }}
                    >
                      <FaTrash /> {Strings.Common.DELETE}
                    </CButton>
                  </CCol>
                </CRow>
              }
            />
          </CCol>
        ))}
      </CRow>
    )
  }

  const handleClickButton = async () => {
    try {
      dispatch(setLoading(true))
      const result = await service.api.postFormData({
        path: Constants.ApiPath.POST_PROCESS_OD,
        data: { file: state.file[process.code], totalPage: totalPage },
        config: {
          onDownloadProgress: (progressEvent) => {
            var str = progressEvent.currentTarget.response
            var percent = str.split('|')
            var a = percent[percent.length - 1].split('/')
            setValue((a[0] * 100) / a[1])
          },
        },
      })
      updateData(JSON.parse(result.data.substring(result.data.indexOf('#') + 1)).data)
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
    <CRow>
      <CCol xs={12} className="text-center my-1">
        <CFormInput
          id={Helpers.makeID(
            Strings.IncomingOfficialDispatch.CODE,
            Helpers.propName(Strings, Strings.Form.FieldName.FILE),
          )}
          type="file"
          multiple
          onChange={handleInputFileOnChange}
          hidden
        />
        <CFormLabel
          htmlFor={Helpers.makeID(
            Strings.IncomingOfficialDispatch.CODE,
            Helpers.propName(Strings, Strings.Form.FieldName.FILE),
          )}
          style={{ cursor: 'pointer' }}
        >
          <h1>
            <FaPaperclip /> {Strings.IncomingOfficialDispatch.Common.UPLOAD_FILE}
          </h1>
        </CFormLabel>
      </CCol>
      <CCol xs={12} className="my-1">
        {renderFile(true)}
      </CCol>
      <CCol xs={12} className="my-1">
        {!Helpers.isObjectEmpty(process) && state.fileTemp.length !== 0 && (
          <CProgress>
            <CProgressBar value={value} color="success" variant="striped" animated />
          </CProgress>
        )}
      </CCol>
      <CCol xs={12} className="my-1">
        {!Helpers.isObjectEmpty(process) && state.fileTemp.length !== 0 && (
          <CRow>
            <CCol xs={12}>
              <CFormLabel>S??? trang c???a v??n b???n</CFormLabel>
              <CFormInput
                type="number"
                value={totalPage}
                min={1}
                onChange={(e) => setTotalPage(e.target.value)}
              />
              <CFormText>S??? trang ???????c hi???u l?? t??? trang ?????u ?????n ph???n c?? ch??? k??</CFormText>
            </CCol>
            <CCol xs={12} className="mt-3">
              {!loading && (
                <CButton className="w-100" onClick={handleClickButton}>
                  {Strings.Common.PROCESS}
                </CButton>
              )}
              {loading && (
                <CButton className="w-100" disabled={true}>
                  <CSpinner size="sm" /> {Strings.Common.PROCESSING}
                </CButton>
              )}
            </CCol>
            <CCol xs={12} className="mt-3">
              <div style={{ height: '45vh' }}>
                <ODPreview data={process.path} />
              </div>
            </CCol>
          </CRow>
        )}
      </CCol>
    </CRow>
  )
}

ODTUploadFile.prototype = {
  state: PropTypes.object.isRequired,
  extension: PropTypes.func.isRequired,
  handleInputFileOnChange: PropTypes.func.isRequired,
  updateData: PropTypes.func.isRequired,
  handleDeleteFile: PropTypes.func.isRequired,
}

export default ODTUploadFile
