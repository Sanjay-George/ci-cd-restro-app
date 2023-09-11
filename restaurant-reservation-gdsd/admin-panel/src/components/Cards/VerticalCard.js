import React, { useState } from 'react'
import './Card.css'
import defaultImage from '../../assets/images/RestImages/default-restaurant.jpeg'
import { Button, Tag, Popconfirm } from 'antd'
import { useMutation, useQueryClient } from 'react-query'
import { deleteRestaurant } from '../../query/restaurants'
import EditRestaurant from '../../views/restaurants/editRestaurants'

const VerticalCard = (props) => {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [resId, setResId] = useState(null)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const deleteRestaurantMutation = useMutation((id) => deleteRestaurant(id))

  const confirmDeleteRestaurant = (e) => {
    deleteRestaurantMutation.mutate(props?.id, {
      onSuccess: () => {
        queryClient.invalidateQueries(['my-restaurants'])
        props?.setShowToast({
          visible: true,
          message: 'Restaurant deleted successfully',
        })
      },
      onError: (data) => {
        const errorMessage = data?.response?.data?.msg
        props?.setShowToast({
          visible: true,
          message: errorMessage,
        })
      },
    })
  }

  const allImages = props?.images ? props?.images?.filter((img) => !img.menuImage) : []

  return (
    <div className="VerCard">
      <div className="VerCardImgContainer">
        <img
          src={`${process.env.REACT_APP_IMAGE_STORE_URL}/${allImages[0]?.path}`}
          className="VerCard_Img"
          alt=""
          onError={(e) => {
            e.target.src = defaultImage
          }}
        />
      </div>
      <div class="VerCard_Content">
        <div className="ver-card-wrapper">
          <h3 className="VerCard_title">
            <span style={{ marginRight: 10 }}>{props.name}</span>
            <Tag
              color={
                props?.status === 'approved'
                  ? 'green'
                  : props?.status === 'rejected'
                  ? 'red'
                  : 'blue'
              }
            >
              {props?.status}
            </Tag>
          </h3>
          <div>
            {/* <Link to={`/dashboard/edit-restaurant/${props?.id}`}> */}
            <Button
              onClick={() => {
                showModal()
                setResId(props?.id)
              }}
            >
              Edit
            </Button>
            {/* </Link> */}
            <Popconfirm
              title="Delete restaurant"
              description="Are you sure to delete this restaurant?"
              onConfirm={confirmDeleteRestaurant}
              okText="Yes"
              cancelText="No"
            >
              <Button style={{ backgroundColor: 'red', color: '#fff', marginLeft: 10 }}>
                Delete
              </Button>
            </Popconfirm>
          </div>
        </div>
        {/* <span className="VerCardReviews">Based on 21 reviews</span> */}
        <p className="VerCard_Description">
          {props?.address}, {props?.city}
        </p>
        <div>{props?.restaurantNote}</div>
        <div>Max Capacity: {props.maxCapacity}</div>
      </div>
      <EditRestaurant
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        resId={resId}
        setShowToast={props?.setShowToast}
      />
    </div>
  )
}

export default VerticalCard
