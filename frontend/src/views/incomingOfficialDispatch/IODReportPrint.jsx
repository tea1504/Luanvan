import {
  CContainer,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Helpers from 'src/commons/helpers'
import Constants from 'src/constants'
import Strings from 'src/constants/strings'
import OrganizationService from 'src/services/organization.service'

const organizationService = new OrganizationService()

export const IODReportPrint = React.forwardRef(function IODToPrint(props, ref) {
  const { state, status, start, end } = props
  const dispatch = useDispatch()
  let loading = useSelector((state) => state.config.loading)
  let loggedUser = useSelector((state) => state.user.user)
  if (Helpers.isObjectEmpty(loggedUser))
    loggedUser = JSON.parse(localStorage.getItem(Constants.StorageKeys.USER_INFO))
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)
  const [organ, setOrgan] = useState('')
  const [organParent, setOrganParent] = useState('')

  const getOrgan = async () => {
    try {
      setOrgan(loggedUser.organ.name)
      if (loggedUser.organ.organ) {
        const result = await organizationService.getOne(loggedUser.organ.organ)
        setOrganParent(result.data.data.name)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getOrgan()
  }, [])

  return (
    <div ref={ref}>
      <CTable borderless className="text-center">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>{organParent.toUpperCase()}</CTableHeaderCell>
            <CTableHeaderCell>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</CTableHeaderCell>
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell>{organ.toUpperCase()}</CTableHeaderCell>
            <CTableHeaderCell>Độc lập - Tự do - Hạnh phúc</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
      </CTable>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <h1 className="text-center">
        {Strings.IncomingOfficialDispatch.Common.REPORT}
        <br />
        &#40;Từ ngày{' '}
        {Helpers.formatDateFromString(start, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })}{' '}
        đến ngày{' '}
        {Helpers.formatDateFromString(end, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })}
        &#41;
      </h1>
      <div className="page-break"></div>
      <CTable responsive bordered hover>
        <CTableHead>
          <CTableRow className="text-center align-middle">
            <CTableHeaderCell rowSpan={2}>STT</CTableHeaderCell>
            <CTableHeaderCell rowSpan={2}>Đơn vị</CTableHeaderCell>
            <CTableHeaderCell colSpan={status.length + 1}>Số văn bản đã nhận</CTableHeaderCell>
          </CTableRow>
          <CTableRow className="text-center align-middle">
            <CTableHeaderCell>Tổng</CTableHeaderCell>
            {status.map((el, ind) => (
              <CTableHeaderCell key={ind}>{el?.description}</CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow>
            <CTableHeaderCell colSpan={2} className="text-center align-middle">
              Tổng
            </CTableHeaderCell>
            <CTableDataCell className="text-end">
              {state.reduce((prev, cur) => {
                return prev + Object.values(cur.status).reduce((a, b) => a + b, 0)
              }, 0)}
            </CTableDataCell>
            {status.map((el, ind) => (
              <CTableDataCell key={ind} className="text-end">
                {state.reduce((prev, cur) => {
                  return prev + (cur.status[el._id] || 0)
                }, 0)}
              </CTableDataCell>
            ))}
          </CTableRow>
          {state.length !== 0 &&
            state.map((el, ind) => (
              <CTableRow key={ind}>
                <CTableDataCell>{ind + 1}</CTableDataCell>
                <CTableDataCell>{el?.name}</CTableDataCell>
                <CTableDataCell className="text-end">
                  {Object.values(el?.status).reduce((a, b) => a + b, 0)}
                </CTableDataCell>
                {status.map((e, ind) => (
                  <CTableDataCell key={ind} className="text-end">
                    {el?.status[e._id] || 0}
                  </CTableDataCell>
                ))}
              </CTableRow>
            ))}
        </CTableBody>
      </CTable>
      <CTable borderless>
        <CTableBody>
          <CTableRow>
            <CTableDataCell width="70%"></CTableDataCell>
            <CTableDataCell className="text-end">
              Cần Thơ, ngày{' '}
              {Helpers.formatDateFromString(new Date(), {
                day: '2-digit',
              })}{' '}
              tháng{' '}
              {Helpers.formatDateFromString(new Date(), {
                month: '2-digit',
              })}{' '}
              năm{' '}
              {Helpers.formatDateFromString(new Date(), {
                year: 'numeric',
              })}{' '}
            </CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableDataCell></CTableDataCell>
            <CTableDataCell className="text-center">
              <strong>Cán bộ lập báo cáo</strong>
              <br />
              <br />
              <br />
              <br />
              {loggedUser.lastName} {loggedUser.firstName}
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
    </div>
  )
})
