// antd
import React, { useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import "./Auth.css";
import { loginUser } from "../../query/auth";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";

// includes

const SignIn = () => {
  let navigate = useNavigate();
  const loginMutation = useMutation((data) => loginUser(data));

  useEffect(() => {
    if (loginMutation?.data?.data) {
      if (loginMutation?.data?.data?.accessToken) {
        localStorage.setItem("token", loginMutation?.data?.data?.accessToken);
        localStorage.setItem(
          "userName",
          loginMutation?.data?.data?.data?.firstName
        );
        localStorage.setItem("role", loginMutation?.data?.data?.data?.role);
        localStorage.setItem("id", loginMutation?.data?.data?.data?.id);
      }
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      // return navigate("/");
    }
  }, [loginMutation]);

  const onFinish = (values) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        message.success("Login successful");
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
          rules={[{ required: true, message: "Please input your email!" }]}
          className="registrationLabels"
        >
          <Input className="registrationFields" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
          className="registrationLabels"
        >
          <Input.Password className="registrationFields" />
        </Form.Item>
        <div className="login-info">
          Don't have an account?{" "}
          <Link to="/register">
            <span style={{ color: "blue" }}>Register</span>
          </Link>
        </div>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignIn;
