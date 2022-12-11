import React from 'react'
import Screens from 'src/constants/screens'
import { FaChartLine, FaFileExport, FaFileImport, FaUser, FaUserFriends } from 'react-icons/fa'
import { AiOutlineSetting } from 'react-icons/ai'
import { CgOrganisation } from 'react-icons/cg'
import Strings from 'src/constants/strings'

const func = [
  {
    value: 'Danh sách văn bản đến',
    title: 'Danh sách văn bản đến',
    color: 'bg-primary bg-gradient text-white',
    to: Screens.IOD_LIST,
    icon: <FaFileImport size="5rem" />,
  },
  {
    value: 'Danh sách văn bản đi',
    title: 'Danh sách văn bản đi',
    color: 'bg-success bg-gradient text-white',
    to: Screens.ODT_LIST,
    icon: <FaFileExport size="5rem" />,
  },
  {
    value: 'Báo cáo thống kê',
    title: 'Báo cáo thống kê',
    color: 'bg-dark bg-gradient text-white',
    to: Screens.OD_REPORT,
    right: Strings.Common.READ_CATEGORIES,
    icon: <FaChartLine size="5rem" />,
  },
  {
    value: 'Danh sách tổ chức',
    title: 'Danh sách tổ chức',
    color: 'bg-danger bg-gradient text-white',
    to: Screens.ORGANIZATION,
    right: Strings.Common.CREATE_CATEGORIES,
    icon: <CgOrganisation size="5rem" />,
  },
  {
    value: 'Danh sách cán bộ',
    title: 'Danh sách cán bộ',
    color: 'bg-warning bg-gradient text-white',
    to: Screens.OFFICER,
    right: Strings.Common.CREATE_CATEGORIES,
    icon: <FaUserFriends size="5rem" />,
  },
  {
    value: 'Xem tài khoản',
    title: 'Xem tài khoản',
    color: 'bg-info bg-gradient text-white',
    to: Screens.OFFICER_INFO,
    icon: <FaUser size="5rem" />,
  },
  {
    value: 'Cấu hình hệ thống',
    title: 'Cấu hình hệ thống',
    color: 'bg-dark text-white',
    to: Screens.CONFIG,
    icon: <AiOutlineSetting size="5rem" />,
  },
]

export default func
