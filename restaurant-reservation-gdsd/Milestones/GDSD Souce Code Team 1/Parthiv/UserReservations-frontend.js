import React from 'react'
import { useQuery } from 'react-query'
import { Button, Space, Table, Tag, Popconfirm } from 'antd'
import { getUserReservations } from '../../query/restaurants'
import dayjs from 'dayjs'

const UserReservations = () => {
  const { data: allUserReservations } = useQuery('user-reservations', getUserReservations)
  const columns = [
    {
      title: 'Restaurant Name',
      dataIndex: 'restaurantName',
      key: 'restaurantName',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Booked By',
      dataIndex: 'bookedBy',
      key: 'bookedBy',
    },
    {
      title: 'User Email',
      dataIndex: 'userEmail',
      key: 'userEmail',
    },
    {
      title: 'User Phone',
      dataIndex: 'userPhone',
      key: 'userPhone',
    },
    {
      title: 'User Special Request',
      dataIndex: 'specialRequest',
      key: 'specialRequest',
    },
    {
      title: 'User Special Request',
      dataIndex: 'specialRequest',
      key: 'specialRequest',
    },
    {
      title: 'Seats Reserved',
      dataIndex: 'numberOfSeats',
      key: 'numberOfSeats',
    },
    {
      title: 'Reserved Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => <p>{dayjs(text).format('YYYY-MM-DD')}</p>,
    },
    {
      title: 'Reserved Time',
      dataIndex: 'time',
      key: 'time',
      render: (text) => <p>{text}:00</p>,
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (text) => <Tag color={text === 'Reserved' ? 'green' : 'red'}>{text}</Tag>,
    },
  ]
  const data =
    allUserReservations?.data?.length > 0
      ? allUserReservations?.data?.map((data) => ({
          key: data?.id,
          id: data?.id,
          restaurantName: data?.restaurantName,
          status: data?.status,
          address: `${data?.restaurantAddress}, ${data?.restaurantCity}`,
          bookedBy: `${data?.firstName} ${data?.lastName}`,
          specialRequest: data?.specialRequest,
          numberOfSeats: data?.numberOfSeats,
          time: data?.times,
          date: data?.date,
          userEmail: data?.userEmail,
          userPhone: data?.userPhone,
        }))
      : []
  return (
    <div>
      <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default UserReservations
