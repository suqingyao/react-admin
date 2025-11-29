import { Button } from 'antd';
import { useState } from 'react';

interface MenuItem { id: number; name: string; path: string; parentId?: number | null }

const initial: MenuItem[] = [
  { id: 1, name: '看板', path: '/dashboard', parentId: null },
  { id: 2, name: '用户管理', path: '/users', parentId: null },
  { id: 3, name: '菜单管理', path: '/menus', parentId: null },
  { id: 4, name: '组织管理', path: '/orgs', parentId: null },
  { id: 5, name: '权限分配', path: '/permissions', parentId: null },
];

export default function MenusPage() {
  const [items, setItems] = useState<MenuItem[]>(initial);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<Omit<MenuItem, 'id'>>({ name: '', path: '', parentId: null });

  const onAdd = () => {
    const id = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
    setItems([...items, { id, ...form }]);
    setForm({ name: '', path: '', parentId: null });
  };

  const onUpdate = () => {
    if (!editing)
      return;
    setItems(items.map(i => (i.id === editing.id ? { ...editing, ...form } : i)));
    setEditing(null);
    setForm({ name: '', path: '', parentId: null });
  };

  const onEdit = (i: MenuItem) => {
    setEditing(i);
    setForm({ name: i.name, path: i.path, parentId: i.parentId ?? null });
  };

  const onDelete = (id: number) => {
    setItems(items.filter(i => i.id !== id));
    if (editing?.id === id)
      setEditing(null);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">菜单管理</h2>
      <div className="rounded-lg border bg-white p-4">
        <div className="grid grid-cols-3 gap-3">
          <input
            className="h-10 rounded-md border px-3"
            placeholder="名称"
            value={form.name}
            onChange={e => setForm(s => ({ ...s, name: e.target.value }))}
          />
          <input
            className="h-10 rounded-md border px-3"
            placeholder="路径"
            value={form.path}
            onChange={e => setForm(s => ({ ...s, path: e.target.value }))}
          />
          <select
            className="h-10 rounded-md border px-3"
            value={form.parentId ?? ''}
            onChange={e =>
              setForm(s => ({ ...s, parentId: e.target.value ? Number(e.target.value) : null }))}
          >
            <option value="">无父级</option>
            {items.map(i => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex gap-2">
          {editing
            ? (
                <>
                  <Button onClick={onUpdate}>保存</Button>
                  <Button variant="secondary" onClick={() => (setEditing(null), setForm({ name: '', path: '', parentId: null }))}>
                    取消
                  </Button>
                </>
              )
            : (
                <Button onClick={onAdd}>新增</Button>
              )}
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-black/5">
              <th className="text-left p-3">名称</th>
              <th className="text-left p-3">路径</th>
              <th className="text-left p-3">父级</th>
              <th className="text-left p-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map(i => (
              <tr key={i.id} className="border-b">
                <td className="p-3">{i.name}</td>
                <td className="p-3">{i.path}</td>
                <td className="p-3">{items.find(x => x.id === i.parentId)?.name ?? '-'}</td>
                <td className="p-3 space-x-2">
                  <Button size="small" onClick={() => onEdit(i)}>
                    编辑
                  </Button>
                  <Button size="small" danger onClick={() => onDelete(i.id)}>
                    删除
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
