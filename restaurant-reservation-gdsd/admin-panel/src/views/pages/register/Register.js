// antd
import React, { useEffect } from 'react'
import { Button, message, Form, Input } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../../../query/auth'
import { useMutation } from 'react-query'

// includes

const Register = () => {
  const navigate = useNavigate()

  const registerUserMutation = useMutation((data) => registerUser(data))

  useEffect(() => {
    if (registerUserMutation?.data?.data) {
      return navigate('/dashboard/login')
    }
  }, [registerUserMutation, navigate])

  const onFinish = (values) => {
    registerUserMutation.mutate(values, {
      onSuccess: () => {
        message.success('User Registered Successfully')
      },
      onError: (data) => {
        const errorMessage = data?.response?.data?.message
        message.error(errorMessage)
      },
    })
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }
  return (
    <div className="auth-wrap">
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Firstname"
          name="firstName"
          rules={[{ required: true, message: 'Please input your firstName!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Lastname"
          name="lastName"
          rules={[{ required: true, message: 'Please input your lastName!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phonenumber"
          rules={[{ required: true, message: 'Please input your phonenumber!' }]}
        >
          <Input type="number" />
        </Form.Item>
        <div className="login-info">
          Already have an account?{' '}
          <Link to="/dashboard/login">
            <span style={{ color: 'blue' }}>Login</span>
          </Link>
        </div>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Register
