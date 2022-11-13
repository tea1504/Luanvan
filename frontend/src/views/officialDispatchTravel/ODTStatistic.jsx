import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCardSubtitle,
  CCardTitle,
  CCol,
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CRow,
} from '@coreui/react'
import React, { useRef } from 'react'
import Chart from 'chart.js/auto'
import { Bar, Doughnut, getElementsAtEvent, Line } from 'react-chartjs-2'
import IODService from 'src/services/IOD.service'
import { useDispatch, useSelector } from 'react-redux'
import Helpers from 'src/commons/helpers'
import Constants from 'src/constants'
import Strings from 'src/constants/strings'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Screens from 'src/constants/screens'
import { setLoading } from 'src/store/slice/config.slice'

const service = new IODService()
const MySwal = withReactContent(Swal)
export default function ODTStatistic() {
  const dispatch = useDispatch()
  let loading = useSelector((state) => state.config.loading)
  let loggedUser = useSelector((state) => state.user.user)
  if (Helpers.isObjectEmpty(loggedUser))
    loggedUser = JSON.parse(localStorage.getItem(Constants.StorageKeys.USER_INFO))
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [year, setYear] = useState([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(0)
  const [total, setTotal] = useState(0)
  const [active, setActive] = useState({ month: false, year: true })

  const chartRef = useRef()

  const [state, setState] = useState({
    labels: [],
    datasets: [
      {
        label: 'Số văn bản nhận được',
        backgroundColor: '#3e95cd',
        data: [],
      },
    ],
  })
  const updateState = (newState) => setState((prevState) => ({ ...prevState, ...newState }))

  const showError = (error) => {
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
      case 406:
        const message = Object.values(error.data.error).map((el) => el.message)
        MySwal.fire({
          title: Strings.Message.COMMON_ERROR,
          icon: 'error',
          html: message.join('<br/>'),
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

  const getEndDate = (year, month) => {
    let date = new Date(year, month + 1, 1)
    date.setDate(date.getDate() - 1)
    return date
  }

  const getStatistic = async (mode = 'year', year = 0, month = 0, week = 0) => {
    try {
      dispatch(setLoading(true))
      setTotal((prevState) => 0)
      switch (mode) {
        case 'year':
          {
            const result = await service.getStatisticYearMonth(year)
            updateState({
              labels: new Array(12).fill(0).map((el, ind) => 'Tháng ' + (ind + 1)),
            })
            let data = new Array(12).fill(0)
            result.data.data.map((el, ind) => {
              data[el._id - 1] += el.count
              setTotal((prev) => prev + data[el._id - 1])
            })
            updateState({ datasets: state.datasets.map((el) => ({ ...el, data: data })) })
          }
          break
        case 'month':
          {
            const result = await service.getStatisticMonthDay(year, month)
            updateState({
              labels: new Array(getEndDate(year, month - 1).getDate())
                .fill(0)
                .map((el, ind) => 'Ngày ' + (ind + 1)),
            })
            let data = new Array(getEndDate(year, month - 1).getDate()).fill(0)
            result.data.data.map((el, ind) => {
              data[el._id - 1] += el.count
              setTotal((prev) => prev + data[el._id - 1])
            })
            updateState({ datasets: state.datasets.map((el) => ({ ...el, data: data })) })
          }
          break

        default:
          break
      }
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const getYearReport = async () => {
    try {
      dispatch(setLoading(true))
      setYear((prevState) => [])
      const result = await service.getYearReport()
      result.data.data
        .sort((a, b) => a._id - b._id)
        .map((el) => {
          setYear((prevState) => [...prevState, { label: el._id, value: el._id }])
        })
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  useEffect(() => {
    getStatistic('year', selectedYear)
    getYearReport()
  }, [])

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              <CCardTitle>
                <CRow>
                  <CCol>
                    <h3>Thống kê số văn bản nhận tổng số {total} văn bản</h3>
                    {active.year && <CCardSubtitle>Trong năm {selectedYear}</CCardSubtitle>}
                    {active.month && (
                      <CCardSubtitle>
                        Trong tháng {month} năm {selectedYear}
                      </CCardSubtitle>
                    )}
                  </CCol>
                  <CCol className="text-end">
                    <CButtonGroup>
                      <CButton
                        variant={active.date ? '' : 'outline'}
                        onClick={() => {
                          setActive({ month: false, year: false })
                        }}
                      >
                        Tuần
                      </CButton>
                      <CDropdown>
                        <CDropdownToggle variant={active.month ? '' : 'outline'}>
                          Tháng
                        </CDropdownToggle>
                        <CDropdownMenu>
                          {new Array(12).fill(0).map((el, ind) => (
                            <CDropdownItem
                              active={ind + 1 === month}
                              key={ind}
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                setActive({ month: true, year: false })
                                setMonth(ind + 1)
                                getStatistic('month', selectedYear, ind + 1)
                              }}
                            >
                              {ind + 1}
                            </CDropdownItem>
                          ))}
                        </CDropdownMenu>
                      </CDropdown>
                      <CDropdown>
                        <CDropdownToggle variant={active.year ? '' : 'outline'}>
                          Năm
                        </CDropdownToggle>
                        <CDropdownMenu>
                          {year.map((el, ind) => (
                            <CDropdownItem
                              active={el.value === selectedYear}
                              key={ind}
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                setActive({ month: false, year: true })
                                setSelectedYear(el.value)
                                getStatistic('year', el.value)
                              }}
                            >
                              {el.label}
                            </CDropdownItem>
                          ))}
                        </CDropdownMenu>
                      </CDropdown>
                    </CButtonGroup>
                  </CCol>
                </CRow>
              </CCardTitle>
              <Bar
                ref={chartRef}
                height={80}
                data={state}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
                onClick={(event) => {
                  console.log(getElementsAtEvent(chartRef.current, event))
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}
