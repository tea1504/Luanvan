import {
  CContainer,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableFoot,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Helpers from 'src/commons/helpers'
import Constants from 'src/constants'
import Strings from 'src/constants/strings'
import OrganizationService from 'src/services/organization.service'

const organizationService = new OrganizationService()

export const IODToPrint = React.forwardRef(function IODToPrint(props, ref) {
  const { data } = props
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
          <CTableRow>
            <CTableHeaderCell className="text-center align-top">
              <hr
                style={{
                  width: '200px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginTop: 0,
                  height: '2px',
                  backgroundColor: 'black',
                }}
              />
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center align-top">
              <hr
                style={{
                  width: '200px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginTop: 0,
                  height: '2px',
                  backgroundColor: 'black',
                }}
              />
            </CTableHeaderCell>
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell></CTableHeaderCell>
            <CTableDataCell className="text-end">
              <i>
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
                })}
              </i>
            </CTableDataCell>
          </CTableRow>
        </CTableHead>
      </CTable>
      <br />
      <h1 className="text-center">Danh sách văn bản đến</h1>
      <br />
      <CTable bordered className="text-center align-middle">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Ngày đến</CTableHeaderCell>
            <CTableHeaderCell>Ngày phát hành</CTableHeaderCell>
            <CTableHeaderCell>Số đến</CTableHeaderCell>
            <CTableHeaderCell width="180px">Mã số</CTableHeaderCell>
            <CTableHeaderCell>Trích yếu</CTableHeaderCell>
            <CTableHeaderCell>Cơ quan ban hành</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {data.map((el, ind) => (
            <CTableRow key={ind}>
              <CTableDataCell>{ind + 1}</CTableDataCell>
              <CTableDataCell>
                {Helpers.formatDateFromString(el.arrivalDate, {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </CTableDataCell>
              <CTableDataCell>
                {Helpers.formatDateFromString(el.issuedDate, {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </CTableDataCell>
              <CTableDataCell>{el.arrivalNumber}</CTableDataCell>
              <CTableDataCell>
                {Helpers.getMaVanBan(
                  el.code,
                  el.organ.code,
                  el.type.notation,
                  el.issuedDate,
                  localStorage.getItem(Constants.StorageKeys.FORMAT_CODE_OD),
                )}
              </CTableDataCell>
              <CTableDataCell className="text-start text-justify">{el.subject}</CTableDataCell>
              <CTableDataCell className="text-start text-justify">{el.organ.name}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  )
})
