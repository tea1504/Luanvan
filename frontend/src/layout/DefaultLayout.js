import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Constants from 'src/constants'
import { setFoldable, setLanguage, setSidebarShow } from 'src/store/slice/config.slice'
import { setToken, setUser } from 'src/store/slice/user.slice'
import { AppContent, AppSidebar, AppHeader } from '../components/index'

const DefaultLayout = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem(Constants.StorageKeys.ACCESS_TOKEN)
    if (token) dispatch(setToken(token))
    const userInfo = localStorage.getItem(Constants.StorageKeys.USER_INFO)
    if (userInfo) dispatch(setUser(JSON.parse(userInfo)))
    const foldable = localStorage.getItem(Constants.StorageKeys.CONFIG_FOLDABLE)
    if (foldable) dispatch(setFoldable(foldable === 'true'))
    const language = localStorage.getItem(Constants.StorageKeys.LANGUAGE)
    if (language) dispatch(setLanguage(language))
  }, [])

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
      </div>
    </div>
  )
}

export default DefaultLayout
