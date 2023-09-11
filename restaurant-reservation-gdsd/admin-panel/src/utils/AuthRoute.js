import React from 'react'
import { Navigate, Route, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

const AuthRoute = ({ token, role, accessRoles, children }) => {
  let location = useLocation()

  return token ? (
    accessRoles.includes(role) ? (
      children
    ) : (
      <Navigate to="/dashboard" state={{ from: location }} replace />
    )
  ) : (
    <Navigate to="/dashboard/login" state={{ from: location }} replace />
  )
}

export default AuthRoute

AuthRoute.propTypes = {
  token: PropTypes.string,
  children: PropTypes.node,
}
