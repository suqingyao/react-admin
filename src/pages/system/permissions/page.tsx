import { Button } from 'antd';
import { useMemo, useState } from 'react';

type Role = 'admin' | 'editor' | 'viewer';
interface Permission {
  role: Role;
  menus: string[];
}

const allMenus = ['/dashboard', '/users', '/menus', '/orgs', '/permissions'];

export default function PermissionsPage() {
  const roles: Role[] = useMemo(() => ['admin', 'editor', 'viewer'], []);
  const [perms, setPerms] = useState<Permission[]>([
    { role: 'admin', menus: [...allMenus] },
    { role: 'editor', menus: ['/dashboard', '/users', '/menus'] },
    { role: 'viewer', menus: ['/dashboard'] },
  ]);

  const toggle = (role: Role, m: string) => {
    setPerms((p) =>
      p.map((i) =>
        i.role === role
          ? {
              ...i,
              menus: i.menus.includes(m) ? i.menus.filter((x) => x !== m) : [...i.menus, m],
            }
          : i,
      ),
    );
  };

  const selectAll = (role: Role, checked: boolean) => {
    setPerms((p) =>
      p.map((i) => (i.role === role ? { ...i, menus: checked ? [...allMenus] : [] } : i)),
    );
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">权限分配</h2>
      <div className="rounded-lg border bg-white p-4 space-y-6">
        {roles.map((r) => {
          const current = perms.find((i) => i.role === r)!;
          const allChecked = allMenus.every((m) => current.menus.includes(m));
          return (
            <div key={r} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  角色：
                  {r}
                </h3>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={(e) => selectAll(r, e.target.checked)}
                  />
                  全选
                </label>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {allMenus.map((m) => (
                  <label key={m} className="flex items-center gap-2 rounded-md border px-3 py-2">
                    <input
                      type="checkbox"
                      checked={current.menus.includes(m)}
                      onChange={() => toggle(r, m)}
                    />
                    <span>{m}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
        <div className="flex justify-end">
          <Button type="primary">保存配置</Button>
        </div>
      </div>
    </div>
  );
}
