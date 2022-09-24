import React from 'react'
import { CButton, CTooltip } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import background from './../../../assets/images/403.gif'

const Page403 = () => {
  const navigate = useNavigate()

  return (
    <div
      className="vh-100 d-flex flex-row align-items-center justify-content-center"
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
      }}
    >
      <CButton
        onClick={() => navigate('/', { replace: true })}
        color="link"
        className="text-white vh-100 vw-100"
        title="Click vào điểm bất kỳ để về trang chủ"
      ></CButton>
    </div>
  )
}

export default Page403
