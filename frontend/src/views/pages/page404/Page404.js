import React from 'react'
import { CButton } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import Resources from 'src/commons/resources'

const Page404 = () => {
  const navigate = useNavigate()

  return (
    <div
      className="vh-100 d-flex flex-row align-items-center justify-content-center"
      style={{
        backgroundImage: `url(${Resources.Images.ERR_404})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
      }}
    >
      <CButton
        onClick={() => navigate(-1, { replace: true })}
        color="link"
        className="text-white vh-100 vw-100"
        title="Click vào điểm bất kỳ để về trang chủ"
      ></CButton>
    </div>
  )
}

export default Page404
