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
  CPlaceholder,
  CRow,
  CWidgetStatsA,
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
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import { FaArrowDown, FaArrowUp, FaUps } from 'react-icons/fa'

const service = new IODService()
const MySwal = withReactContent(Swal)
export default function IODStatistic() {
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
  const [IODWeek, setIODWeek] = useState({
    data: {
      labels: ['', '', '', '', '', '', ''],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: 'transparent',
          borderColor: 'rgba(255,255,255,.55)',
          data: [1, 1, 1, 1, 1, 1, 1],
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            display: false,
          },
        },
        y: {
          display: false,
          grid: {
            display: false,
          },
          ticks: {
            display: false,
          },
        },
      },
      elements: {
        line: {
          borderWidth: 1,
          tension: 0.4,
        },
        point: {
          radius: 4,
          hitRadius: 10,
          hoverRadius: 4,
        },
      },
    },
    now: 0,
    percent: 0,
  })
  const [IODImplementWeek, setIODImplementWeek] = useState({
    data: {
      labels: ['', '', '', '', '', '', ''],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: 'transparent',
          borderColor: 'rgba(255,255,255,.55)',
          data: [1, 1, 1, 1, 1, 1, 1],
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            display: false,
          },
        },
        y: {
          display: false,
          grid: {
            display: false,
          },
          ticks: {
            display: false,
          },
        },
      },
      elements: {
        line: {
          borderWidth: 1,
          tension: 0.4,
        },
        point: {
          radius: 4,
          hitRadius: 10,
          hoverRadius: 4,
        },
      },
    },
    now: 0,
    percent: 0,
  })
  const [IODRefuseWeek, setIODRefuseWeek] = useState({
    data: {
      labels: ['', '', '', '', '', '', ''],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: 'rgba(255,255,255,.2)',
          borderColor: 'rgba(255,255,255,.55)',
          data: [0, 0, 0, 0, 0, 0, 0],
          fill: true,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      maintainAspectRatio: false,
      scales: {
        x: {
          display: false,
        },
        y: {
          display: false,
        },
      },
      elements: {
        line: {
          borderWidth: 2,
          tension: 0.4,
        },
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
        },
      },
    },
    now: 0,
    percent: 0,
  })
  const [IODLateWeek, setIODLateWeek] = useState({
    data: {
      labels: ['', '', '', '', '', '', ''],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: 'rgba(255,255,255,.2)',
          borderColor: 'rgba(255,255,255,.55)',
          data: [0, 0, 0, 0, 0, 0, 0],
          barPercentage: 0.6,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawTicks: false,
          },
          ticks: {
            display: false,
          },
        },
        y: {
          grid: {
            display: false,
            drawBorder: false,
            drawTicks: false,
          },
          ticks: {
            display: false,
          },
        },
      },
    },
    now: 0,
    percent: 0,
  })

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

  const getIODCurrentWeek = async (mode = 'year', year = 0, month = 0, week = 0) => {
    try {
      dispatch(setLoading(true))
      const result = await service.getIODCurrentWeek()
      setIODWeek((prevState) => ({
        ...prevState,
        data: {
          labels: result.data.data.labels,
          datasets: [
            {
              label: 'Số văn bản đến',
              backgroundColor: 'transparent',
              borderColor: 'rgba(255,255,255,.55)',
              data: result.data.data.data,
            },
          ],
        },
        now: result.data.data.now,
        percent: Math.round(result.data.data.percent * 10000) / 100,
      }))
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      showError(error)
    }
  }

  const getIODStatusCurrentWeek = async () => {
    try {
      dispatch(setLoading(true))
      let result = await service.getIODStatusCurrentWeek('IMPLEMENT')
      setIODImplementWeek((prevState) => ({
        ...prevState,
        data: {
          labels: result.data.data.labels,
          datasets: [
            {
              label: 'Số văn bản đến được ban hành',
              backgroundColor: 'transparent',
              borderColor: 'rgba(255,255,255,.55)',
              data: result.data.data.data,
              fill: true,
            },
          ],
        },
        now: result.data.data.now,
        percent: Math.round(result.data.data.percent * 10000) / 100,
      }))
      result = await service.getIODStatusCurrentWeek('REFUSE')
      setIODRefuseWeek((prevState) => ({
        ...prevState,
        data: {
          labels: result.data.data.labels,
          datasets: [
            {
              label: 'Số văn bản đến bị từ chối',
              backgroundColor: 'rgba(255,255,255,.2)',
              borderColor: 'rgba(255,255,255,.55)',
              data: result.data.data.data,
              fill: true,
            },
          ],
        },
        now: result.data.data.now,
        percent: Math.round(result.data.data.percent * 10000) / 100,
      }))
      result = await service.getIODStatusCurrentWeek('LATE')
      setIODLateWeek((prevState) => ({
        ...prevState,
        data: {
          labels: result.data.data.labels,
          datasets: [
            {
              label: 'Số văn bản đến bị trễ hạn xử lý',
              backgroundColor: 'rgba(255,255,255,.2)',
              borderColor: 'rgba(255,255,255,.55)',
              data: result.data.data.data,
              barPercentage: 1.2,
            },
          ],
        },
        now: result.data.data.now,
        percent: Math.round(result.data.data.percent * 10000) / 100,
      }))
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

  const init = async () => {
    await getStatistic('year', selectedYear)
    await getYearReport()
    await getIODCurrentWeek()
    await getIODStatusCurrentWeek()
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <CContainer>
      <CRow>
        <CCol xs={12} sm={6} lg={3}>
          {!loading && (
            <CWidgetStatsA
              className="mb-4"
              color="info"
              value={
                <>
                  {IODWeek.now}{' '}
                  <span className="fs-6 fw-normal">
                    ({IODWeek.percent}% {IODWeek.percent <= 0 ? <FaArrowDown /> : <FaArrowUp />})
                  </span>
                </>
              }
              title="Số văn bản đến hôm nay"
              chart={
                <CChartLine
                  className="mt-3 mx-3"
                  style={{ height: '70px' }}
                  data={IODWeek.data}
                  options={IODWeek.options}
                />
              }
            />
          )}
          {loading && (
            <CPlaceholder
              component={CWidgetStatsA}
              xs={12}
              className="mb-4"
              color="secondary"
              style={{ height: '170px' }}
              animation="wave"
            ></CPlaceholder>
          )}
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          {!loading && (
            <CWidgetStatsA
              className="mb-4"
              color="success"
              value={
                <>
                  {IODImplementWeek.now}{' '}
                  <span className="fs-6 fw-normal">
                    ({IODImplementWeek.percent}%{' '}
                    {IODImplementWeek.percent <= 0 ? <FaArrowDown /> : <FaArrowUp />})
                  </span>
                </>
              }
              title="Số văn bản được ban hành hôm nay"
              chart={
                <CChartLine
                  className="mt-3 mx-3"
                  style={{ height: '70px' }}
                  data={IODImplementWeek.data}
                  options={IODImplementWeek.options}
                />
              }
            />
          )}
          {loading && (
            <CPlaceholder
              component={CWidgetStatsA}
              xs={12}
              className="mb-4"
              color="secondary"
              style={{ height: '170px' }}
              animation="wave"
            ></CPlaceholder>
          )}
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          {!loading && (
            <CWidgetStatsA
              className="mb-4"
              color="warning"
              value={
                <>
                  {IODRefuseWeek.now}{' '}
                  <span className="fs-6 fw-normal">
                    ({IODRefuseWeek.percent}%{' '}
                    {IODRefuseWeek.percent <= 0 ? <FaArrowDown /> : <FaArrowUp />})
                  </span>
                </>
              }
              title="Số văn bản bị từ chối hôm nay"
              chart={
                <CChartLine
                  className="mt-3"
                  style={{ height: '70px' }}
                  data={IODRefuseWeek.data}
                  options={IODRefuseWeek.options}
                />
              }
            />
          )}
          {loading && (
            <CPlaceholder
              component={CWidgetStatsA}
              xs={12}
              className="mb-4"
              color="secondary"
              style={{ height: '170px' }}
              animation="wave"
            ></CPlaceholder>
          )}
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          {!loading && (
            <CWidgetStatsA
              className="mb-4"
              color="danger"
              value={
                <>
                  {IODLateWeek.now}{' '}
                  <span className="fs-6 fw-normal">
                    ({IODLateWeek.percent}%{' '}
                    {IODLateWeek.percent <= 0 ? <FaArrowDown /> : <FaArrowUp />})
                  </span>
                </>
              }
              title="Số văn bản đến bị từ chối hôm nay"
              chart={
                <CChartBar
                  className="mt-3 mx-3"
                  style={{ height: '70px' }}
                  data={IODLateWeek.data}
                  options={IODLateWeek.options}
                />
              }
            />
          )}
          {loading && (
            <CPlaceholder
              component={CWidgetStatsA}
              xs={12}
              className="mb-4"
              color="secondary"
              style={{ height: '170px' }}
              animation="wave"
            ></CPlaceholder>
          )}
        </CCol>
        <CCol xs={12}>
          {!loading && (
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
          )}
          {loading && (
            <CCard>
              <CCardBody>
                <CCardTitle>
                  <CRow>
                    <CCol>
                      <CPlaceholder xs={12}></CPlaceholder>
                      <CPlaceholder xs={5}></CPlaceholder>
                    </CCol>
                    <CCol className="text-end">
                      <CPlaceholder
                        component={CButton}
                        disabled
                        href="#"
                        tabIndex={-1}
                        xs={6}
                        style={{ height: '40px' }}
                        animation="wave"
                      ></CPlaceholder>
                    </CCol>
                  </CRow>
                </CCardTitle>
                <CPlaceholder
                  component={CChartBar}
                  xs={12}
                  color="secondary"
                  style={{ height: '170px' }}
                  animation="wave"
                ></CPlaceholder>
              </CCardBody>
            </CCard>
          )}
        </CCol>
      </CRow>
    </CContainer>
  )
}
