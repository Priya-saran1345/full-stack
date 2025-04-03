/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";

interface signup{
  name: string;
  email: string;
  password: string;
  phone: string;
  age: number;
  bio: string;
}

const SignupPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: signup) => {
    setLoading(true);
    console.log("Form values:", values);

    try {
      const response = await fetch("/api/Users/signup/", {
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
        toast.error(data.error || "Signup failed. Please try again.");
        return;
      }
      
      toast.success("Signup successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Please enter your name" }]}>
            <Input prefix={<UserOutlined />} placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}>
            <Input prefix={<MailOutlined />} placeholder="Enter your email" />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true, min: 6, message: "Password must be at least 6 characters" }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
          </Form.Item>

          <Form.Item name="phonenumber" label="Phone Number" rules={[{ required: true, message: "Please enter your phone number" }, { pattern: /^[0-9]{10}$/, message: "Enter a valid 10-digit phone number" }]}>
            <Input prefix={<PhoneOutlined />} placeholder="Enter your phone number" />
          </Form.Item>

          <Form.Item name="age" label="Age" rules={[{ required: true, message: "Please enter your age" }]}>
            <Input type="number" placeholder="Enter your age" />
          </Form.Item>

          <Form.Item className="flex justify-between">
            <Button type="default" onClick={() => router.push("/login")}>Login</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignupPage;
