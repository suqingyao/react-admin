import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import storageUtil from '@/lib/storage';

export default function Login() {
  const navigate = useNavigate();

  const onFinish = async (values: Record<string, any>) => {
    const { username, password } = values;
    if (!username || !password)
      return false;
    storageUtil.setItem('token', 'mock-token');
    storageUtil.setItem('user', { username, role: 'admin' });
    navigate('/dashboard');
    return true;
  };

  useEffect(() => {
    const token = storageUtil.getItem('token');
    if (token)
      navigate('/dashboard');
  }, []);

  return (
    <div className="size-full flex items-center justify-center">
      <LoginForm title="React Admin" subTitle="后台管理系统" onFinish={onFinish}>
        <ProFormText
          name="username"
          fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
          placeholder="请输入用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
          placeholder="请输入密码"
          rules={[{ required: true, message: '请输入密码' }]}
        />
      </LoginForm>
    </div>
  );
}
