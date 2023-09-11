import React, { useState } from 'react'
import { Button, Select, Form, Input, message, Upload } from 'antd'
// import { InboxOutlined, PlusOutlined } from '@ant-design/icons'
import { useQuery } from 'react-query'
import { useMutation } from 'react-query'
import { getAllCuisines, getAllExtraServices } from '../../query/searchFilters'
import { addRestaurant } from '../../query/restaurants'
import { CToast, CToastBody, CToastClose } from '@coreui/react'

// const { Dragger } = Upload
const Restaurants = () => {
  const [form] = Form.useForm()
  const addRestaurantMutation = useMutation((data) => addRestaurant(data))
  const [showToast, setShowToast] = useState({
    visible: false,
    message: '',
  })

  const { data: allCuisines } = useQuery('all-cuisines', getAllCuisines)
  // const { data: allExtraServices } = useQuery('all-extra-service', getAllExtraServices)

  const onFinish = (values) => {
    addRestaurantMutation.mutate(values, {
      onSuccess: () => {
        setShowToast({
          visible: true,
          message: 'Restaurant added successfully',
        })
        form.resetFields()
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
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const cuisineOptions =
    allCuisines?.data?.values?.length > 0
      ? allCuisines?.data?.values.map((data) => ({
          label: data,
          value: data,
        }))
      : []

  // const extraServicesOptions =
  //   allExtraServices?.data?.values?.length > 0
  //     ? allExtraServices?.data?.values.map((data) => ({
  //         label: data,
  //         value: data,
  //       }))
  //     : []

  // const props = {
  //   name: 'file',
  //   multiple: true,
  //   action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  //   onChange(info) {
  //     const { status } = info.file
  //     if (status !== 'uploading') {
  //       console.log(info.file, info.fileList)
  //     }
  //     if (status === 'done') {
  //       message.success(`${info.file.name} file uploaded successfully.`)
  //     } else if (status === 'error') {
  //       message.error(`${info.file.name} file upload failed.`)
  //     }
  //   },
  //   onDrop(e) {
  //     console.log('Dropped files', e.dataTransfer.files)
  //   },
  // }
  return (
    <div>
      <CToast autohide={false} visible={showToast?.visible} className="align-items-right">
        <div className="d-flex">
          <CToastBody>{showToast?.message}</CToastBody>
          <CToastClose className="me-2 m-auto" />
        </div>
      </CToast>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
      >
        {/* <Form.Item label="Images" valuePropName="fileList">
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">Upload Restaurant Files</p>
          </Dragger>
        </Form.Item> */}
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter your restaurant name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Max Capacity"
          name="maxCapacity"
          rules={[{ required: true, message: 'Please enter restaurant table count!' }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Number of tables"
          name="maxTables"
          rules={[{ required: true, message: 'Please enter restaurant table count!' }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Grace period"
          name="gracePeriod"
          rules={[{ required: true, message: 'Please enter your restaurant grace period!' }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Cuisines"
          name="cuisine"
          rules={[{ required: true, message: 'Please select the cuisines!' }]}
        >
          <Select
            // mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Please select the cuisines"
            options={cuisineOptions}
          />
        </Form.Item>
        {/* <Form.Item
          label="Extra services"
          name="extraService"
          rules={[{ required: true, message: 'Please select the cuisines!' }]}
        >
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Please select the cuisines"
            options={extraServicesOptions}
          />
        </Form.Item> */}
        <Form.Item
          label="Reservation Interval"
          name="timeInterval"
          rules={[{ required: true, message: 'Please enter your restaurant booking interval!' }]}
        >
          <Input type="number" />
        </Form.Item>
        {/* <Form.Item label="Upload" valuePropName="fileList">
          <Upload action="/upload.do" listType="picture-card">
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Menu Picture</div>
            </div>
          </Upload>
        </Form.Item> */}

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please enter your restaurant address!' }]}
        >
          <Input />
        </Form.Item>

        {/* <Form.Item
          label="Mobile Number"
          name="number"
          rules={[{ required: true, message: 'Please enter your restaurant contact number!' }]}
        >
          <Input type="number" />
        </Form.Item> */}

        <Form.Item
          label="City"
          name="city"
          rules={[{ required: true, message: 'Please enter your restaurant city!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Plz"
          name="postalCode"
          rules={[{ required: true, message: 'Please enter your restaurant PLZ!' }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          label="Restaurant Note"
          name="restaurantNote"
          rules={[{ required: true, message: 'Please enter your restaurant note!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Restaurants
