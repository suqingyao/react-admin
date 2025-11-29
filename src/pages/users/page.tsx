import { useMemo, useState } from 'react'
import { Button } from 'antd'

type User = { id: number; name: string; email: string; role: string }

const initialUsers: User[] = [
  { id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' },
  { id: 2, name: 'Editor', email: 'editor@example.com', role: 'editor' },
  { id: 3, name: 'Viewer', email: 'viewer@example.com', role: 'viewer' },
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [editing, setEditing] = useState<User | null>(null)
  const [form, setForm] = useState<Omit<User, 'id'>>({ name: '', email: '', role: 'viewer' })

  const resetForm = () => setForm({ name: '', email: '', role: 'viewer' })

  const onAdd = () => {
    const id = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1
    setUsers([...users, { id, ...form }])
    resetForm()
  }

  const onUpdate = () => {
    if (!editing) return
    setUsers(users.map((u) => (u.id === editing.id ? { ...editing, ...form } as User : u)))
    setEditing(null)
    resetForm()
  }

  const onEdit = (u: User) => {
    setEditing(u)
    setForm({ name: u.name, email: u.email, role: u.role })
  }

  const onDelete = (id: number) => {
    setUsers(users.filter((u) => u.id !== id))
    if (editing?.id === id) {
      setEditing(null)
      resetForm()
    }
  }

  const roles = useMemo(() => ['admin', 'editor', 'viewer'], [])

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">用户管理</h2>
      <div className="rounded-lg border bg-white p-4">
        <div className="grid grid-cols-3 gap-3">
          <input
            className="h-10 rounded-md border px-3"
            placeholder="姓名"
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
          />
          <input
            className="h-10 rounded-md border px-3"
            placeholder="邮箱"
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
          />
          <select
            className="h-10 rounded-md border px-3"
            value={form.role}
            onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex gap-2">
          {editing ? (
            <>
              <Button onClick={onUpdate}>保存</Button>
              <Button variant="secondary" onClick={() => (setEditing(null), resetForm())}>取消</Button>
            </>
          ) : (
            <Button onClick={onAdd}>新增</Button>
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-black/5">
              <th className="text-left p-3">姓名</th>
              <th className="text-left p-3">邮箱</th>
              <th className="text-left p-3">角色</th>
              <th className="text-left p-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3 space-x-2">
                  <Button size="small" onClick={() => onEdit(u)}>
                    编辑
                  </Button>
                  <Button size="small" danger onClick={() => onDelete(u.id)}>
                    删除
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}