import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ClearOutlined,
  CloseOutlined,
  DownOutlined,
  ExpandOutlined,
  ExportOutlined,
  LeftOutlined,
  PushpinOutlined,
  ReloadOutlined,
  RightOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { DndContext } from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Icon } from '@iconify/react';
import { cn } from '@suqingyao/utils';
import { Dropdown } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { getMenuRoutes } from '@/router';

interface TabItem {
  key: string;
  title: string;
  path: string;
  pinned?: boolean;
  icon?: string;
}

function SortableTab({
  item,
  active,
  showSeparator,
  onClick,
  menuForFn,
  onClose,
}: {
  item: TabItem;
  active: boolean;
  showSeparator: boolean;
  onClick: () => void;
  menuForFn: (key: string) => any;
  onClose: (key: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.key,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as React.CSSProperties;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose(item.key);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative flex h-[26px] items-center gap-2 rounded-md px-3 text-sm transition-all cursor-pointer select-none mr-[2px]',
        active
          ? 'bg-primary/10 text-primary'
          : 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-800',
      )}
      onClick={onClick}
    >
      {/* 拖拽手柄 */}
      <span
        className="cursor-grab opacity-0 transition-opacity group-hover:opacity-100"
        {...attributes}
        {...listeners}
      >
        <SwapOutlined className="text-[10px] text-gray-400" />
      </span>

      {item.icon ? <Icon icon={item.icon} width={14} height={14} /> : null}

      <Dropdown trigger={['contextMenu']} menu={menuForFn(item.key)}>
        <span className="whitespace-nowrap">{item.title}</span>
      </Dropdown>

      {!item.pinned && (
        <div
          className={cn(
            'ml-1 flex h-4 w-4 items-center justify-center rounded-full transition-colors hover:bg-gray-200',
            active ? 'text-primary hover:bg-primary/20' : 'text-gray-400',
          )}
          onClick={handleClick}
        >
          <CloseOutlined className="text-[10px]" />
        </div>
      )}

      {/* 分隔线：显示在右侧，absolute定位到父容器右侧外 */}
      {showSeparator && (
        <div className="absolute -right-[2px] top-1/2 h-3 w-[1px] -translate-y-1/2 bg-gray-200" />
      )}
    </div>
  );
}

export function NovaWorkTab({ onMaximizeChange }: { onMaximizeChange?: (max: boolean) => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState<TabItem[]>([]);
  const [activeKey, setActiveKey] = useState<string>('');
  const [maximized, setMaximized] = useState<boolean>(false);
  const [_, setDragKey] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const metaMap = useMemo(() => {
    const routes = getMenuRoutes();
    const map: Record<string, { name: string; icon?: string }> = {};
    routes.forEach((r: any) => {
      if (r.path) map[r.path] = { name: r.title || r.name || r.path, icon: r.icon };
      (r.routes || []).forEach((c: any) => {
        if (c.path) map[c.path] = { name: c.title || c.name || c.path, icon: c.icon };
      });
    });
    return map;
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('workTabs');
      const active = localStorage.getItem('workTabs.active');
      if (raw) {
        const saved: TabItem[] = JSON.parse(raw);
        const normalized = saved.map((it) => {
          const meta = metaMap[it.path];
          return { ...it, title: meta?.name || it.title || it.path, icon: meta?.icon ?? it.icon };
        });
        setItems(normalized);
      }
      if (active) setActiveKey(active);
    } catch {}
  }, [metaMap]);

  useEffect(() => {
    const path = location.pathname;
    const meta = metaMap[path];
    const title = meta?.name || path;
    const icon = meta?.icon;
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.key === path);
      if (idx >= 0) {
        const cur = prev[idx];
        if (cur.title !== title || cur.icon !== icon) {
          const next = prev.slice();
          next[idx] = { ...cur, title, icon };
          return next;
        }
        return prev;
      }
      return [...prev, { key: path, title, path, icon }];
    });
    setActiveKey(path);
  }, [location.pathname, metaMap]);

  useEffect(() => {
    try {
      localStorage.setItem('workTabs', JSON.stringify(items));
      if (activeKey) localStorage.setItem('workTabs.active', activeKey);
    } catch {}
  }, [items, activeKey]);

  useEffect(() => {
    onMaximizeChange?.(maximized);
  }, [maximized, onMaximizeChange]);

  const onContextAction = (key: string, action: string) => {
    const idx = items.findIndex((i) => i.key === key);
    if (idx === -1) return;
    if (action === 'refresh') {
      const cur = items[idx];
      navigate(`${cur.path}?_=${Date.now()}`, { replace: true } as any);
      return;
    }
    if (action === 'pin') {
      setItems((prev) => prev.map((i) => (i.key === key ? { ...i, pinned: !i.pinned } : i)));
      return;
    }
    if (action === 'close') {
      const next = items.filter((i) => i.key !== key);
      setItems(next);
      if (activeKey === key) {
        const target = next[idx - 1] || next[idx] || null;
        if (target) navigate(target.path);
      }
      return;
    }
    if (action === 'maximize') {
      setMaximized((m) => !m);
      return;
    }
    if (action === 'newWindow') {
      window.open(items[idx].path, '_blank');
      return;
    }
    if (action === 'closeLeft') {
      const keep = items.filter((_, i) => i >= idx || items[i].pinned);
      setItems(keep);
      if (!keep.find((t) => t.key === activeKey)) navigate(items[idx].path);
      return;
    }
    if (action === 'closeRight') {
      const keep = items.filter((_, i) => i <= idx || items[i].pinned);
      setItems(keep);
      if (!keep.find((t) => t.key === activeKey)) navigate(items[idx].path);
      return;
    }
    if (action === 'closeOthers') {
      const keep = items.filter((i) => i.key === key || i.pinned);
      setItems(keep);
      navigate(items[idx].path);
      return;
    }
    if (action === 'closeAll') {
      setItems([]);
      navigate('/');
    }
  };

  const menuFor = (key: string) => ({
    items: [
      { key: 'refresh', label: '刷新', icon: <ReloadOutlined /> },
      { key: 'pin', label: '固定', icon: <PushpinOutlined /> },
      { type: 'divider' as const },
      { key: 'close', label: '关闭', icon: <CloseOutlined /> },
      { key: 'maximize', label: '最大化', icon: <ExpandOutlined /> },
      { key: 'newWindow', label: '在新窗口打开', icon: <ExportOutlined /> },
      { type: 'divider' as const },
      { key: 'closeLeft', label: '关闭左侧标签页', icon: <ArrowLeftOutlined /> },
      { key: 'closeRight', label: '关闭右侧标签页', icon: <ArrowRightOutlined /> },
      { key: 'closeOthers', label: '关闭其他标签页', icon: <SwapOutlined /> },
      { key: 'closeAll', label: '关闭全部标签页', icon: <ClearOutlined /> },
    ],
    onClick: ({ key: action }: any) => onContextAction(key, String(action)),
  });

  const tabKeys = useMemo(() => items.map((i) => i.key), [items]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex h-[34px] items-center border-t border-gray-200 bg-white shadow-sm">
      {/* 左侧箭头 */}
      <div
        className="flex h-full w-9 cursor-pointer items-center justify-center border-r border-gray-200 hover:bg-gray-50"
        onClick={scrollLeft}
      >
        <LeftOutlined className="text-gray-500 text-xs" />
      </div>

      {/* 中间滚动区域 */}
      <div className="flex-1 overflow-hidden px-2">
        <DndContext
          onDragStart={(e) => setDragKey(String(e.active.id))}
          onDragEnd={(e) => {
            const { active, over } = e;
            setDragKey(null);
            if (!over || active.id === over.id) return;
            const fromIndex = items.findIndex((i) => i.key === String(active.id));
            const toIndex = items.findIndex((i) => i.key === String(over.id));
            if (fromIndex < 0 || toIndex < 0) return;
            const next = items.slice();
            const [moved] = next.splice(fromIndex, 1);
            next.splice(toIndex, 0, moved);
            setItems(next);
          }}
        >
          <SortableContext items={tabKeys} strategy={horizontalListSortingStrategy}>
            <div
              ref={scrollContainerRef}
              className="flex h-full items-center overflow-x-auto scrollbar-hide"
            >
              {items.map((i, index) => {
                // 判断是否显示右侧分隔线：
                // 1. 当前不是最后一个
                // 2. 当前不是激活的
                // 3. 下一个不是激活的
                const isActive = activeKey === i.key;
                const nextIsActive = index + 1 < items.length && items[index + 1].key === activeKey;
                const showSeparator = index !== items.length - 1 && !isActive && !nextIsActive;

                return (
                  <SortableTab
                    key={i.key}
                    item={i}
                    active={isActive}
                    showSeparator={showSeparator}
                    onClick={() => {
                      setActiveKey(i.key);
                      navigate(i.path);
                    }}
                    menuForFn={menuFor}
                    onClose={(k) => onContextAction(k, 'close')}
                  />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* 右侧箭头 */}
      <div
        className="flex h-full w-9 cursor-pointer items-center justify-center border-l border-r border-gray-200 hover:bg-gray-50"
        onClick={scrollRight}
      >
        <RightOutlined className="text-gray-500 text-xs" />
      </div>

      {/* 右侧功能区 */}
      <div className="flex h-full items-center">
        <Dropdown
          menu={{
            items: [
              { key: 'refresh', label: '刷新当前', icon: <ReloadOutlined /> },
              { key: 'closeAll', label: '关闭全部', icon: <ClearOutlined /> },
              { key: 'closeLeft', label: '关闭左侧', icon: <ArrowLeftOutlined /> },
              { key: 'closeRight', label: '关闭右侧', icon: <ArrowRightOutlined /> },
              { key: 'closeOthers', label: '关闭其他', icon: <SwapOutlined /> },
            ],
            onClick: ({ key }) => onContextAction(activeKey, key),
          }}
          placement="bottomRight"
          arrow
        >
          <div className="flex h-full w-9 cursor-pointer items-center justify-center border-r border-gray-200 hover:bg-gray-50">
            <DownOutlined className="text-gray-500 text-xs" />
          </div>
        </Dropdown>

        <div
          className="flex h-full w-9 cursor-pointer items-center justify-center hover:bg-gray-50"
          onClick={() => setMaximized(!maximized)}
        >
          {maximized ? (
            <ExpandOutlined className="text-gray-500 text-xs" />
          ) : (
            <ExpandOutlined className="rotate-180 text-gray-500 text-xs" />
          )}
        </div>
      </div>
    </div>
  );
}
