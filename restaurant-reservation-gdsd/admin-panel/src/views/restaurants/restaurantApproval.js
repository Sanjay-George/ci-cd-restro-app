import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Button, Space, Table, Tag, Popconfirm } from 'antd'
import { CToast, CToastBody, CToastClose } from '@coreui/react'

import { getAllRestaurants, updateStatusRestaurant } from '../../query/restaurants'

const RestaurantApproval = () => {
  const queryClient = useQueryClient()
  const [showToast, setShowToast] = useState({
    visible: false,
    message: '',
  })

  const { data: allRestaurantData } = useQuery('all-restaurants', getAllRestaurants)
  const updateStatusRestaurantMutation = useMutation((data) => updateStatusRestaurant(data))

  const updateStatus = (type, id) => {
    const data = {
      status: type,
      restaurantId: id,
    }
    updateStatusRestaurantMutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries(['all-restaurants'])
        setShowToast({
          visible: true,
          message: `Restaurant ${type} successfully`,
        })
        setTimeout(() => {
          setShowToast({
            visible: false,
            message: '',
          })
        }, 2000)
      },
      onError: (data) => {
        const errorMessage = data?.response?.data?.msg
        setShowToast({
          visible: true,
          message: errorMessage,
        })
      },
    })
  }

  const columns = [
    {
      title: 'Restaurant Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Restaurant Owner',
      dataIndex: 'restaurantOwner',
      key: 'restaurantOwner',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (text) => (
        <Tag color={text === 'approved' ? 'green' : text === 'rejected' ? 'red' : 'blue'}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record?.status !== 'approved' && (
            <Popconfirm
              title="Approve restaurant"
              description="Are you sure to approve this restaurant?"
              onConfirm={() => updateStatus('approved', record?.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button style={{ color: 'blue' }}>Approve</Button>
            </Popconfirm>
          )}
          {record?.status !== 'rejected' && (
            <Popconfirm
              title="Reject restaurant"
              description="Are you sure to reject this restaurant?"
              onConfirm={() => updateStatus('rejected', record?.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button style={{ color: 'red' }}>Reject</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]
  const data =
    allRestaurantData?.data?.length > 0
      ? allRestaurantData?.data?.map((data) => ({
          key: data?.id,
          id: data?.id,
          name: data?.name,
          status: data?.status,
          address: `${data?.address}, ${data?.city}`,
          restaurantOwner: `${data?.ownerFirstName} ${data?.ownerLastName}`,
        }))
      : []
  return (
    <div>
      <CToast autohide={false} visible={showToast?.visible} className="align-items-right">
        <div className="d-flex">
          <CToastBody>{showToast?.message}</CToastBody>
          <CToastClose className="me-2 m-auto" />
        </div>
      </CToast>
      <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default RestaurantApproval
