import React, { useState } from 'react'
import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getImages, getMyRestaurants, deleteImage } from '../../query/restaurants'
import {
  Typography,
  Form,
  Button,
  Checkbox,
  Space,
  Table,
  Tag,
  Popconfirm,
  Select,
  Input,
  Divider,
} from 'antd'
import { CToast, CToastBody, CToastClose } from '@coreui/react'
const { Title } = Typography

const ImageUploader = () => {
  const [imageUploadForm] = Form.useForm()

  const [selectedFiles, setSelectedFiles] = useState([])
  const [isMenuImage, setIsMenuImage] = useState(false)
  const queryClient = useQueryClient()

  const [showToast, setShowToast] = useState({
    visible: false,
    message: '',
  })

  const [restaurantId, setRestaurantId] = useState(0)

  const { data: myRestaurantData } = useQuery('my-restaurants', () => getMyRestaurants(100))

  // Query to fetch existing images
  const { data: existingImages = [], refetch: refetchExistingImages } = useQuery(
    ['existingImages', restaurantId],
    () => getImages(restaurantId),
  )

  // Mutation to delete an image
  const deleteImageMutation = useMutation(
    ({ imageId, restaurantId }) => deleteImage(imageId, restaurantId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('existingImages')
        setShowToast({
          visible: true,
          message: 'Image deleted!',
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

  // Mutation to add new images
  const addImagesMutation = useMutation(
    (formData) =>
      axios.post(`/restaurants/${restaurantId}/images`, formData, {
        baseURL: process.env.REACT_APP_BASE_URL,
        headers: {
          'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
          ...(localStorage.getItem('token') && {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          }),
        },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('existingImages')
        setSelectedFiles([])
        setIsMenuImage(false)
        imageUploadForm.resetFields()
      },
    },
  )

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files)
  }

  const handleUploadClick = (event) => {
    // event.preventDefault()
    const formData = new FormData()
    formData.append('image', selectedFiles[0])
    formData.append('isMenuImage', isMenuImage)
    // for (let i = 0; i < selectedFiles.length; i++) {
    //   formData.append('images', selectedFiles[i])
    // }
    addImagesMutation.mutate(formData)
  }

  const handleDeleteClick = (id) => {
    deleteImageMutation.mutate({ imageId: id, restaurantId: restaurantId })
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
          <Popconfirm
            title="Delete image"
            description="Are you sure you want to delete this image?"
            onConfirm={() => handleDeleteClick(record?.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button>Delete</Button>
          </Popconfirm>
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
          <Title level={5}>Upload Image</Title>
          <Divider />

          <Form
            name="image-upload-form"
            initialValues={{ remember: true }}
            autoComplete="off"
            onFinish={handleUploadClick}
            form={imageUploadForm}
          >
            <Space>
              <Form.Item label="" name="file" rules={[{ required: true, message: 'Choose file' }]}>
                <Input type="file" onChange={handleFileChange} />
              </Form.Item>

              <Form.Item label="" name="file">
                <Checkbox
                  onChange={(e) => {
                    setIsMenuImage(e.target.checked)
                  }}
                >
                  Mark as a menu image?{' '}
                </Checkbox>
              </Form.Item>

              <Form.Item label="" name="file">
                <Button type="primary" htmlType="submit">
                  Upload
                </Button>
              </Form.Item>
            </Space>
          </Form>

          <Title level={5}>Uploaded Images</Title>
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

export default ImageUploader
