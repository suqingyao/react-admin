import { Button } from 'antd';
import { useState } from 'react';

interface Org {
  id: number;
  name: string;
  parentId?: number | null;
}

const initial: Org[] = [
  { id: 1, name: '总部', parentId: null },
  { id: 2, name: '技术部', parentId: 1 },
  { id: 3, name: '产品部', parentId: 1 },
];

function OrgTree({ nodes, parentId }: { nodes: Org[]; parentId: number | null }) {
  const children = nodes.filter((n) => (n.parentId ?? null) === parentId);
  if (!children.length) return null;
  return (
    <ul className="ml-4 list-disc">
      {children.map((c) => (
        <li key={c.id}>
          {c.name}
          <OrgTree nodes={nodes} parentId={c.id} />
        </li>
      ))}
    </ul>
  );
}

export default function DepartmentsPage() {
  const [items, setItems] = useState<Org[]>(initial);
  const [editing, setEditing] = useState<Org | null>(null);
  const [form, setForm] = useState<Omit<Org, 'id'>>({ name: '', parentId: null });

  const onAdd = () => {
    const id = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    setItems([...items, { id, ...form }]);
    setForm({ name: '', parentId: null });
  };

  const onUpdate = () => {
    if (!editing) return;
    setItems(items.map((i) => (i.id === editing.id ? { ...editing, ...form } : i)));
    setEditing(null);
    setForm({ name: '', parentId: null });
  };

  const onEdit = (i: Org) => {
    setEditing(i);
    setForm({ name: i.name, parentId: i.parentId ?? null });
  };

  const onDelete = (id: number) => {
    setItems(items.filter((i) => i.id !== id));
    if (editing?.id === id) setEditing(null);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">部门管理</h2>
      <div className="rounded-lg border bg-white p-4">
        <div className="grid grid-cols-2 gap-3">
          <input
            className="h-10 rounded-md border px-3"
            placeholder="部门名称"
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
          />
          <select
            className="h-10 rounded-md border px-3"
            value={form.parentId ?? ''}
            onChange={(e) =>
              setForm((s) => ({ ...s, parentId: e.target.value ? Number(e.target.value) : null }))
            }
          >
            <option value="">无上级</option>
            {items.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex gap-2">
          {editing ? (
            <>
              <Button onClick={onUpdate}>保存</Button>
              <Button
                type="link"
                onClick={() => (setEditing(null), setForm({ name: '', parentId: null }))}
              >
                取消
              </Button>
            </>
          ) : (
            <Button onClick={onAdd}>新增</Button>
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <h3 className="font-semibold mb-2">部门架构</h3>
        <OrgTree nodes={items} parentId={null} />
        <div className="mt-4">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-black/5">
                <th className="text-left p-3">名称</th>
                <th className="text-left p-3">上级</th>
                <th className="text-left p-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id} className="border-b">
                  <td className="p-3">{i.name}</td>
                  <td className="p-3">{items.find((x) => x.id === i.parentId)?.name ?? '-'}</td>
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
    </div>
  );
}
