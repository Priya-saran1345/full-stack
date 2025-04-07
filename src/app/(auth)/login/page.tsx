/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

 interface Login {
  email: string;
  password: string;
 }
const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onFinish = async (values: Login) => {
    setLoading(true);
    console.log("Login form values:", values);
    try {
      const response = await fetch("/api/Users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const textResponse = await response.text();
      console.log("Raw API response:", textResponse);
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        toast.error("Invalid response from server.");
        return;
      }
      if (!response.ok) {
        console.error("API error response:", data);
        toast.error(data.error || "Login failed. Please try again.");
        return;
      }
      if (data.token) {
        Cookies.set("authToken", data.token, { expires: 1, secure: true, sameSite: "Strict" });
        Cookies.set("user_id", data.user_id, { expires: 1, secure: true, sameSite: "Strict" });
      }
      toast.success("Login successful! Redirecting...");
      setTimeout(() => router.push("/profile"), 2000);
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}>
            <Input prefix={<MailOutlined />} placeholder="Enter your email" />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true, min: 6, message: "Password must be at least 6 characters" }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
          </Form.Item>

          <Form.Item className="flex justify-between">
            <Button type="default" onClick={() => router.push("/signup")}>Sign Up</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
