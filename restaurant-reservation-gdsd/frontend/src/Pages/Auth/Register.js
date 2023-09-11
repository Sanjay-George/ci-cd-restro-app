// antd
import { useForm } from "antd/lib/form/Form";
import React, { useEffect } from "react";
import { Button, message, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../query/auth";
import { useMutation } from "react-query";
import "./Auth.css";

// includes

const SignIn = () => {
  let navigate = useNavigate();

  const registerUserMutation = useMutation((data) => registerUser(data));

  useEffect(() => {
    if (registerUserMutation?.data?.data) {
      return navigate("/login");
    }
  }, [registerUserMutation]);

  const onFinish = (values) => {
    registerUserMutation.mutate(values, {
      onSuccess: () => {
        message.success("User Registered Successfully");
      },
      onError: (data) => {
        const errorMessage = data?.response?.data?.msg;
        message.error(errorMessage);
      },
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="auth-wrap">
      <Form
        name="basic"
        labelCol={{ span: 9 }}
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
          rules={[{ required: true, message: "Please input your email!" }]}
          className="registrationLabels"
        >
          <Input type="email" className="registrationFields" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
          className="registrationLabels"
        >
          <Input.Password className="registrationFields" />
        </Form.Item>

        <Form.Item
          label="Firstname"
          name="firstName"
          rules={[{ required: true, message: "Please input your firstName!" }]}
          className="registrationLabels"
        >
          <Input className="registrationFields" />
        </Form.Item>

        <Form.Item
          label="Lastname"
          name="lastName"
          rules={[{ required: true, message: "Please input your lastName!" }]}
          className="registrationLabels"
        >
          <Input className="registrationFields" />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phonenumber"
          rules={[
            { required: true, message: "Please input your phonenumber!" },
          ]}
          className="registrationLabels"
        >
          <Input type="number" className="registrationFields" />
        </Form.Item>
        <div className="login-info">
          Already have an account?{" "}
          <Link to="/login">
            <span style={{ color: "blue" }}>Login</span>
          </Link>
        </div>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignIn;
