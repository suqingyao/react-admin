import { BellOutlined, LogoutOutlined, QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { PageContainer, ProLayout } from '@ant-design/pro-components';
import { Icon } from '@iconify/react';
import { Badge, Dropdown, Space } from 'antd';
import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import WorkTabs from '@/components/core/work-tabs';
import { getMenuRoutes } from '@/router';
import { GuardContainer } from '@/router/guards';

export default function DefaultLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [maximized, setMaximized] = useState(false);

  const dynamicRoutes = getMenuRoutes();
  const normalizeIcon = (name?: string) => {
    if (!name)
      return undefined as string | undefined;
    if (name.includes(':'))
      return name;
    const map: Record<string, string> = {
    };
    return map[name] || name;
  };
  const routes = dynamicRoutes.map((r: any) => ({
    ...r,
    name: r.title || r.name,
    icon: r.icon ? <Icon icon={normalizeIcon(r.icon)} width={16} height={16} /> : undefined,
    key: r.path,
    routes: (r.routes || []).map((c: any) => ({
      ...c,
      name: c.title || c.name,
      icon: c.icon ? <Icon icon={normalizeIcon(c.icon)} width={16} height={16} /> : undefined,
      key: c.path,
    })),
  }));

  const userMenuItems = [
    { key: 'profile', label: '个人中心' },
    { key: 'settings', label: '设置' },
    { key: 'logout', label: '退出登录', icon: <LogoutOutlined /> },
  ];

  return (
    <div className="h-full w-full">
      <GuardContainer />
      <ProLayout
        route={{ routes }}
        location={location}
        fixedHeader={true}
        layout={maximized ? 'top' : 'mix'}
        title="Nova Admin"
        logo={<Icon icon="ri:star-s-fill" width={18} height={18} />}
        menu={{ defaultOpenAll: true }}
        actionsRender={() => [
          <SearchOutlined key="search" />,
          <QuestionCircleOutlined key="help" />,
          <Badge key="bell" count={12} size="small">
            <BellOutlined />
          </Badge>,
        ]}
        avatarProps={{
          size: 'small',
          title: 'Admin',
          render: (props, dom) => (
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: ({ key }) => {
                  if (key === 'logout')
                    navigate('/authorized/login');
                  if (key === 'profile')
                    navigate('/users');
                  if (key === 'settings')
                    navigate('/system');
                },
              }}
            >
              <a>
                <Space>
                  {dom}
                  Admin
                </Space>
              </a>
            </Dropdown>
          ),
        }}
        menuItemRender={(item, dom) => (
          <a onClick={() => item.path && navigate(item.path)}>{dom}</a>
        )}
      >
        <WorkTabs onMaximizeChange={setMaximized} />
        <PageContainer>
          <Outlet />
        </PageContainer>
      </ProLayout>
    </div>
  );
}
