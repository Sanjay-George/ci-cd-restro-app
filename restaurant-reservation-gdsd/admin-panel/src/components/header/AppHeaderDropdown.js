import React from 'react'
import {
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { UserOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'

const AppHeaderDropdown = () => {
  const userData = localStorage.getItem('userName')
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <Avatar size={50} icon={<UserOutlined />} />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Welcome, {userData}</CDropdownHeader>
        <CDropdownItem
          onClick={() => {
            localStorage.removeItem('token')
            localStorage.removeItem('userName')
            localStorage.removeItem('role')
            localStorage.removeItem('id')
            window.location.reload()
          }}
          style={{ cursor: 'pointer' }}
        >
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
