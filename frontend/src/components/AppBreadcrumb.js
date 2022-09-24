import React from 'react'
import { matchPath, useLocation, useNavigate } from 'react-router-dom'

import routes from '../routes'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import { useSelector } from 'react-redux'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname
  const navigate = useNavigate()
  const language = useSelector((state) => state.config.language) || 'vi'

  const getRouteName = (pathname, routes) => {
    for (var i = 0; i < routes.length; i++) {
      var routePath = routes[i]
      if (matchPath({ path: routePath.path, exact: true, strike: true }, pathname)) {
        return routePath.name[language]
      }
    }
    return null
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname, routes)
      routeName &&
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length ? true : false,
        })
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="m-0 ms-2">
      <CBreadcrumbItem
        onClick={() => navigate('/', { replace: true })}
        style={{ cursor: 'pointer' }}
      >
        {language === 'vi' ? 'Trang chủ' : 'Home'}
      </CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            onClick={() => navigate(breadcrumb.pathname, { replace: true })}
            style={{ cursor: breadcrumb.active ? 'text' : 'pointer' }}
            {...(breadcrumb.active ? { active: true } : {})}
            key={index}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
