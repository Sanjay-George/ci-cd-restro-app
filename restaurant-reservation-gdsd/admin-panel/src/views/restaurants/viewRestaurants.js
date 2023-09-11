import React, { useState } from 'react'
import { useQuery } from 'react-query'

import { getMyRestaurants } from '../../query/restaurants'
import VerticalCard from '../../components/Cards/VerticalCard'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import { CToast, CToastBody, CToastClose } from '@coreui/react'

const ViewRestaurants = () => {
  const { data: myRestaurantData } = useQuery('my-restaurants', () => getMyRestaurants(20))
  const [showToast, setShowToast] = useState({
    visible: false,
    message: '',
  })
  return (
    <div>
      <div className="view-res-wrapper">
        <Link to="/dashboard/add-restaurant">
          <Button>Add Restaurant</Button>
        </Link>
      </div>
      <CToast autohide={false} visible={showToast?.visible} className="align-items-right">
        <div className="d-flex">
          <CToastBody>{showToast?.message}</CToastBody>
          <CToastClose className="me-2 m-auto" />
        </div>
      </CToast>
      {myRestaurantData?.data?.length > 0
        ? myRestaurantData?.data?.map((data) => (
            <VerticalCard
              name={data?.name}
              address={data?.address}
              city={data?.city}
              restaurantNote={data?.restaurantNote}
              maxCapacity={data?.maxCapacity}
              status={data?.status}
              id={data?.id}
              key={data?.id}
              setShowToast={setShowToast}
              images={data?.images}
            />
          ))
        : 'No Restaurants available'}
    </div>
  )
}

export default ViewRestaurants
