import type { ProColumns } from '@ant-design/pro-components';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { DrawerForm, ProFormSwitch, ProFormText, ProFormTextArea, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm } from 'antd';
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

  const columns: ProColumns<Role>[] = [
    { title: '角色名称', dataIndex: 'name', valueType: 'text' },
    { title: '角色ID', dataIndex: 'id', copyable: true },
    {
      title: '状态',
      dataIndex: 'enabled',
      valueType: 'select',
      fieldProps: { options: [{ label: '已启用', value: 'true' }, { label: '未启用', value: 'false' }] },
      render: (_, r) => <Button type="link" onClick={() => setRoles(list => list.map(x => (x.id === r.id ? { ...x, enabled: !x.enabled } : x)))}>{r.enabled ? '已启用' : '未启用'}</Button>,
    },
    { title: '备注', dataIndex: 'remark', hideInSearch: true },
    { title: '创建时间', dataIndex: 'createdAt', valueType: 'dateTime', hideInSearch: true },
    {
      title: '操作',
      valueType: 'option',
      render: (_, r) => [
        <Button key="edit" type="link" icon={<EditOutlined />} onClick={() => setEditing(r)}>修改</Button>,
        <Popconfirm key="del" title="确认删除此角色？" okText="删除" cancelText="取消" onConfirm={() => setRoles(list => list.filter(x => x.id !== r.id))}>
          <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>,
      ],
    },
  ];

  const request = async (params: Record<string, any>) => {
    const { name, id, enabled } = params;
    const data = roles.filter((r) => {
      const n = name ? r.name.toLowerCase().includes(String(name).toLowerCase()) : true;
      const i = id ? r.id.toLowerCase().includes(String(id).toLowerCase()) : true;
      const e = enabled !== undefined && enabled !== null && enabled !== '' ? (String(enabled) === 'true' ? r.enabled : !r.enabled) : true;
      return n && i && e;
    });
    return { data, success: true, total: data.length };
  };

  return (
    <>
      <ProTable<Role>
        rowKey="id"
        columns={columns}
        search={{ labelWidth: 90 }}
        toolBarRender={() => [<Button key="new" type="primary" icon={<PlusOutlined />} onClick={() => setEditing({ id: uid(), name: '', enabled: true, remark: '', createdAt: Date.now() })}>新增角色</Button>]}
        request={request}
        pagination={{ pageSize: 20 }}
      />

      <DrawerForm
        open={!!editing}
        onOpenChange={o => !o && setEditing(null)}
        title={editing?.name ? '编辑角色' : '新增角色'}
        size="large"
        initialValues={editing || {}}
        onFinish={async (v) => {
          if (editing && roles.find(r => r.id === editing.id)) {
            setRoles(list => list.map(x => (x.id === editing.id ? { ...x, ...v } : x)));
          }
          else {
            setRoles(list => [{ id: editing?.id || uid(), name: v.name || '新角色', enabled: v.enabled ?? true, remark: v.remark || '', createdAt: Date.now() }, ...list]);
          }
          setEditing(null);
          return true;
        }}
      >
        <ProFormText name="name" label="角色名称" rules={[{ required: true, message: '角色名称必填' }, { min: 2, message: '至少 2 个字符' }]} />
        <ProFormSwitch name="enabled" label="启用" />
        <ProFormTextArea name="remark" label="备注" fieldProps={{ rows: 4 }} rules={[{ max: 100, message: '备注不超过 100 字符' }]} />
      </DrawerForm>
    </>
  );
}
