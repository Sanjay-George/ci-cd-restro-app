import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilDescription, cilSpeedometer, cilStar } from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavGroup,
    name: 'Restaurants',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add Restaurants',
        to: '/dashboard/add-restaurant',
      },
      {
        component: CNavItem,
        name: 'View Restaurants',
        to: '/dashboard/view-restaurant',
      },
      {
        component: CNavItem,
        name: 'Restaurants Approval',
        to: '/dashboard/restaurant-approval',
      },
      {
        component: CNavItem,
        name: 'Upload Images',
        to: '/dashboard/upload-images',
      },
      {
        component: CNavItem,
        name: 'Moderate Images',
        to: '/dashboard/moderate-images',
      },
    ],
  },
  ,
  {
    component: CNavGroup,
    name: 'Reservations',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'User Reservations',
        to: '/dashboard/user-reservations',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Chat',
    to: '/dashboard/chat',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // },
  },
]

export default _nav
