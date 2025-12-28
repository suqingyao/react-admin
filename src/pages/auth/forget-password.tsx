import { MailOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input } from 'antd';
import { useNavigate } from 'react-router';

export default function ForgetPassword() {
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    console.log('Success:', values);
    // Handle password reset logic
  };

  return (
    <div className="flex size-full items-center justify-center bg-gray-100">
      <Card
        className="w-96 shadow-lg"
        title={<div className="text-center text-xl font-bold">Forget Password</div>}
      >
        <div className="mb-6 text-center text-gray-500">Enter your email to reset password</div>
        <Form name="forget-password" onFinish={onFinish} autoComplete="off" size="large">
          <Form.Item
            name="email"
            rules={[{ required: true, type: 'email', message: 'Please input your email!' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Send Reset Link
            </Button>
          </Form.Item>

          <div className="text-center">
            <a onClick={() => navigate('/auth/login')} className="cursor-pointer text-blue-500">
              Back to Login
            </a>
          </div>
        </Form>
      </Card>
    </div>
  );
}
