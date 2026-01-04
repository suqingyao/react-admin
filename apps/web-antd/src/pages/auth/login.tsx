import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input } from 'antd';
import { useNavigate } from 'react-router';
import { fetchLogin } from '@/api/auth';
import { HOME_PAGE_PATH } from '@/router';
import { useUserStore } from '@/store';

export default function Login() {
  const navigate = useNavigate();
  const { setToken, setLoginStatus } = useUserStore();

  const onFinish = async (values: Record<string, string>) => {
    const { username, password } = values;
    if (!username || !password) return;

    const { token, refreshToken } = await fetchLogin({
      userName: username,
      password,
    });
    // 验证token
    if (!token) {
      throw new Error('Login failed - no token received');
    }

    // 存储 token 和登录状态
    setToken(token, refreshToken);
    setLoginStatus(true);

    // 获取 redirect 参数，如果存在则跳转到指定页面，否则跳转到首页
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    navigate(redirect || HOME_PAGE_PATH);
  };

  return (
    <div className="flex size-full items-center justify-center bg-gray-100">
      <Card
        className="w-96 shadow-lg"
        title={<div className="text-center text-xl font-bold">Nova Admin</div>}>
        <div className="mb-6 text-center text-gray-500">后台管理系统</div>
        <Form
          onFinish={onFinish}
          size="large"
          initialValues={{ username: 'Super', password: '123456' }}>
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined />} placeholder="请输入用户名 (admin/user)" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
