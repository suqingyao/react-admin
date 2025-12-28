import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { dayjs } from '@suqingyao/utils';
import { Button, Drawer, Form, Input, Popconfirm, Space, Switch, Table } from 'antd';
import { useState } from 'react';

interface Role {
  id: string;
  name: string;
  enabled: boolean;
  remark: string;
  createdAt: number;
}

function uid() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

const initialRoles: Role[] = Array.from({ length: 60 }).map((_, i) => ({
  id: uid(),
  name: `${['Admin', 'Editor', 'Viewer', 'Auditor', 'Operator'][i % 5]} ${i + 1}`,
  enabled: i % 3 !== 0,
  remark: ['核心权限', '业务编辑', '只读查看', '审计跟踪', '运营支撑'][i % 5],
  createdAt: Date.now() - i * 86400000,
}));

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [editing, setEditing] = useState<Role | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form] = Form.useForm();

  const handleEdit = (record: Role) => {
    setEditing(record);
    form.setFieldsValue(record);
    setIsDrawerOpen(true);
  };

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editing)
        setRoles((prev) => prev.map((r) => (r.id === editing.id ? { ...r, ...values } : r)));
      else setRoles((prev) => [{ id: uid(), createdAt: Date.now(), ...values }, ...prev]);

      setIsDrawerOpen(false);
    });
  };

  const columns = [
    { title: '角色名称', dataIndex: 'name' },
    { title: '角色ID', dataIndex: 'id' },
    {
      title: '状态',
      dataIndex: 'enabled',
      render: (enabled: boolean, r: Role) => (
        <Switch
          checked={enabled}
          onChange={(checked) => {
            setRoles((list) => list.map((x) => (x.id === r.id ? { ...x, enabled: checked } : x)));
          }}
        />
      ),
    },
    { title: '备注', dataIndex: 'remark' },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      render: (ts: number) => dayjs(ts).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      render: (_: any, r: Role) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(r)}>
            修改
          </Button>
          <Popconfirm
            title="确认删除此角色？"
            onConfirm={() => setRoles((list) => list.filter((x) => x.id !== r.id))}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="rounded-lg bg-white p-4">
      <div className="mb-4 flex justify-between">
        <div className="text-lg font-bold">角色管理</div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新建角色
        </Button>
      </div>
      <Table
        dataSource={roles}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10, hideOnSinglePage: true }}
      />
      <Drawer
        title={editing ? '编辑角色' : '新建角色'}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        width={500}
        extra={
          <Space>
            <Button onClick={() => setIsDrawerOpen(false)}>取消</Button>
            <Button type="primary" onClick={handleSave}>
              提交
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="角色名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="enabled" label="状态" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
