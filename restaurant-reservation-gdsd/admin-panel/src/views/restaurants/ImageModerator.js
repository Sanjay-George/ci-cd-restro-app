import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getImages, getAllRestaurants, updateImageStatus } from '../../query/restaurants'
import { Typography, Form, Button, Space, Table, Tag, Popconfirm, Select, Divider } from 'antd'
import { CToast, CToastBody, CToastClose } from '@coreui/react'
const { Title } = Typography

const ImageModerator = () => {
  const [imageUploadForm] = Form.useForm()

  const [selectedFiles, setSelectedFiles] = useState([])
  const [isMenuImage, setIsMenuImage] = useState(false)
  const queryClient = useQueryClient()

  const [showToast, setShowToast] = useState({
    visible: false,
    message: '',
  })

  const [restaurantId, setRestaurantId] = useState(0)

  const { data: myRestaurantData } = useQuery('my-restaurants', () => getAllRestaurants(100))

  // Query to fetch existing images
  const { data: existingImages, refetch: refetchExistingImages } = useQuery(
    ['existingImages', restaurantId],
    () => getImages(restaurantId),
  )

  // Mutation to delete an image
  const updateImageStatusMutation = useMutation(
    ({ imageId, restaurantId, status }) => updateImageStatus(imageId, restaurantId, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('existingImages')
        setShowToast({
          visible: true,
          message: 'Image status updated!',
        })
        setTimeout(() => {
          setShowToast({
            visible: false,
            message: '',
          })
        }, 2000)
      },
    },
  )

  const handleUpdateStatusClick = (status, id) => {
    updateImageStatusMutation.mutate({ imageId: id, restaurantId: restaurantId, status: status })
  }

  const columns = [
    {
      title: 'Restaurant Name',
      dataIndex: 'restaurantName',
      key: 'restaurantName',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        <img src={`${process.env.REACT_APP_IMAGE_STORE_URL}/${image}`} alt={image} height="100" />
      ),
    },
    {
      title: 'IsMenuImage',
      dataIndex: 'isMenuImage',
      key: 'isMenuImage',
      render: (isMenuImage) => <p>{isMenuImage.toString()}</p>,
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (text) => (
        <Tag
          color={
            text.toLowerCase() === 'approved'
              ? 'green'
              : text.toLowerCase() === 'rejected'
              ? 'red'
              : 'blue'
          }
        >
          {text}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record?.status !== 'Approved' && (
            <Popconfirm
              title="Approve image"
              description="Approve this image?"
              onConfirm={() => handleUpdateStatusClick('approved', record?.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button style={{ color: 'blue' }}>Approve</Button>
            </Popconfirm>
          )}
          {record?.status !== 'Rejected' && (
            <Popconfirm
              title="Reject Image"
              description="Reject this image?"
              onConfirm={() => handleUpdateStatusClick('rejected', record?.id)}
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
    existingImages?.data?.length > 0
      ? existingImages?.data?.map((item) => ({
          key: item?.id,
          id: item?.id,
          restaurantId: item?.restaurantID,
          restaurantName: item?.restaurantName,
          isMenuImage: item?.isMenuImage,
          image: item?.path,
          name: 'Test' || item?.name,
          status: item?.status,
        }))
      : []

  const restaurantOptions =
    myRestaurantData?.data?.length > 0
      ? myRestaurantData?.data?.map((item) => ({
          label: item.name,
          value: item.id,
        }))
      : []

  const handleRestaurantSelection = (id) => {
    setRestaurantId(id)
  }

  return (
    <div>
      <Form
        name="restaurant-form"
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        autoComplete="off"
      >
        <Form.Item
          label="Restaurants"
          name="restaurants"
          rules={[{ required: true, message: 'Please select a restaurant!' }]}
        >
          <Select
            // mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Select restaurant to upload image"
            options={restaurantOptions}
            onSelect={(value) => handleRestaurantSelection(value)}
          />
        </Form.Item>
      </Form>

      {restaurantId > 0 && (
        <>
          <Title level={5}>Moderate Images</Title>
          <Divider />

          <div>
            <CToast autohide={false} visible={showToast?.visible} className="align-items-right">
              <div className="d-flex">
                <CToastBody>{showToast?.message}</CToastBody>
                <CToastClose className="me-2 m-auto" />
              </div>
            </CToast>
            <Table columns={columns} dataSource={data} />
          </div>
        </>
      )}
    </div>
  )
}

export default ImageModerator
