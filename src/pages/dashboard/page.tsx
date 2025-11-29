import { Button } from 'antd'

export default function DashboardPage() {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">看板</h2>
      <div className="grid grid-cols-4 gap-4">
        {[
          { title: '用户数', value: 1280 },
          { title: '组织数', value: 24 },
          { title: '菜单数', value: 18 },
          { title: '今日登录', value: 76 },
        ].map((c) => (
          <div key={c.title} className="rounded-lg border bg-white p-4">
            <p className="text-sm text-muted-foreground">{c.title}</p>
            <p className="mt-2 text-3xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border bg-white p-4">
          <h3 className="font-semibold mb-2">快捷入口</h3>
          <div className="flex gap-2">
            <Button type="primary"><a href="/users">用户管理</a></Button>
            <Button><a href="/menus">菜单管理</a></Button>
            <Button type="dashed"><a href="/orgs">组织管理</a></Button>
            <Button type="link"><a href="/permissions">权限分配</a></Button>
          </div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <h3 className="font-semibold mb-2">最近动态</h3>
          <ul className="space-y-2 text-sm">
            <li>新增用户：Alice</li>
            <li>更新菜单：报告中心</li>
            <li>组织变更：技术部合并测试组</li>
            <li>权限调整：Editor 增加菜单访问</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
