import React from 'react'
import { FaChartArea, FaFlag } from 'react-icons/fa'
import { TbReportAnalytics } from 'react-icons/tb'
import Screens from 'src/constants/screens'
import Strings from 'src/constants/strings'

const func = [
  {
    value: Strings.IncomingOfficialDispatch.Common.STATISTIC,
    title: Strings.IncomingOfficialDispatch.Common.STATISTIC,
    color: 'bg-primary bg-gradient text-white',
    to: Screens.OD_REPORT_IOD_STATISTIC,
    icon: <FaChartArea className="my-2" size="5rem" />,
  },
  {
    value: Strings.IncomingOfficialDispatch.Common.REPORT,
    title: Strings.IncomingOfficialDispatch.Common.REPORT,
    color: 'bg-primary bg-gradient text-white bg-opacity-75',
    to: Screens.OD_REPORT_IOD_REPORT,
    icon: <TbReportAnalytics className="my-2" size="5rem" />,
  },
]

export default func
