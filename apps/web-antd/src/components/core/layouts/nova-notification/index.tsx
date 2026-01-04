import { cn } from '@suqingyao/utils';
import { Button } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import avatar1 from '@/assets/images/avatar/avatar1.webp';
import avatar2 from '@/assets/images/avatar/avatar2.webp';
import avatar3 from '@/assets/images/avatar/avatar3.webp';
import avatar4 from '@/assets/images/avatar/avatar4.webp';
import avatar5 from '@/assets/images/avatar/avatar5.webp';
import avatar6 from '@/assets/images/avatar/avatar6.webp';
import { NovaSvgIcon } from '@/components/core/base/nova-svg-icon';

type NoticeType = 'email' | 'message' | 'collection' | 'user' | 'notice';

interface NoticeItem {
  title: string;
  time: string;
  type: NoticeType;
}

interface MessageItem {
  title: string;
  time: string;
  avatar: string;
}

interface PendingItem {
  title: string;
  time: string;
}

interface BarItem {
  name: string;
  num: number;
}

interface NoticeStyle {
  icon: string;
  iconClass: string;
}

interface NovaNotificationPanelProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

const NOTICE_ITEMS: NoticeItem[] = [
  {
    title: '新增国际化',
    time: '2024-6-13 0:10',
    type: 'notice',
  },
  {
    title: '冷月呆呆给你发了一条消息',
    time: '2024-4-21 8:05',
    type: 'message',
  },
  {
    title: '小肥猪关注了你',
    time: '2020-3-17 21:12',
    type: 'collection',
  },
  {
    title: '新增使用文档',
    time: '2024-02-14 0:20',
    type: 'notice',
  },
  {
    title: '小肥猪给你发了一封邮件',
    time: '2024-1-20 0:15',
    type: 'email',
  },
  {
    title: '菜单mock本地真实数据',
    time: '2024-1-17 22:06',
    type: 'notice',
  },
];

const MESSAGE_ITEMS: MessageItem[] = [
  {
    title: '池不胖 关注了你',
    time: '2021-2-26 23:50',
    avatar: avatar1,
  },
  {
    title: '唐不苦 关注了你',
    time: '2021-2-21 8:05',
    avatar: avatar2,
  },
  {
    title: '中小鱼 关注了你',
    time: '2020-1-17 21:12',
    avatar: avatar3,
  },
  {
    title: '何小荷 关注了你',
    time: '2021-01-14 0:20',
    avatar: avatar4,
  },
  {
    title: '誶誶淰 关注了你',
    time: '2020-12-20 0:15',
    avatar: avatar5,
  },
  {
    title: '冷月呆呆 关注了你',
    time: '2020-12-17 22:06',
    avatar: avatar6,
  },
];

const PENDING_ITEMS: PendingItem[] = [];

const NOTICE_STYLE_MAP: Record<NoticeType, NoticeStyle> = {
  email: {
    icon: 'ri:mail-line',
    iconClass: 'bg-warning/12 text-warning',
  },
  message: {
    icon: 'ri:volume-down-line',
    iconClass: 'bg-success/12 text-success',
  },
  collection: {
    icon: 'ri:heart-3-line',
    iconClass: 'bg-danger/12 text-danger',
  },
  user: {
    icon: 'ri:volume-down-line',
    iconClass: 'bg-info/12 text-info',
  },
  notice: {
    icon: 'ri:notification-3-line',
    iconClass: 'bg-theme/12 text-theme',
  },
};

const getNoticeStyle = (type: NoticeType): NoticeStyle => {
  const defaultStyle: NoticeStyle = {
    icon: 'ri:arrow-right-circle-line',
    iconClass: 'bg-theme/12 text-theme',
  };

  return NOTICE_STYLE_MAP[type] || defaultStyle;
};

export function NovaNotificationPanel({ open, onOpenChange }: NovaNotificationPanelProps) {
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [barActiveIndex, setBarActiveIndex] = useState(0);

  const noticeList = NOTICE_ITEMS;
  const msgList = MESSAGE_ITEMS;
  const pendingList = PENDING_ITEMS;

  const barList: BarItem[] = useMemo(
    () => [
      {
        name: '通知',
        num: noticeList.length,
      },
      {
        name: '消息',
        num: msgList.length,
      },
      {
        name: '待办',
        num: pendingList.length,
      },
    ],
    [noticeList.length, msgList.length, pendingList.length],
  );

  useEffect(() => {
    let openTimer: number | undefined;
    let closeTimer: number | undefined;

    if (open) {
      setVisible(true);
      openTimer = window.setTimeout(() => {
        setShow(true);
      }, 5);
    } else {
      setShow(false);
      closeTimer = window.setTimeout(() => {
        setVisible(false);
      }, 350);
    }

    return () => {
      if (openTimer !== undefined) {
        window.clearTimeout(openTimer);
      }
      if (closeTimer !== undefined) {
        window.clearTimeout(closeTimer);
      }
    };
  }, [open]);

  const currentTabIsEmpty = useMemo(() => {
    const tabDataMap = [noticeList, msgList, pendingList];
    const currentData = tabDataMap[barActiveIndex];
    return !currentData || currentData.length === 0;
  }, [barActiveIndex, noticeList, msgList, pendingList]);

  const handleNoticeAll = () => {
    // eslint-disable-next-line no-console
    console.log('查看全部通知');
  };

  const handleMsgAll = () => {
    // eslint-disable-next-line no-console
    console.log('查看全部消息');
  };

  const handlePendingAll = () => {
    // eslint-disable-next-line no-console
    console.log('查看全部待办');
  };

  const handleViewAll = () => {
    const viewAllHandlers: Record<number, () => void> = {
      0: handleNoticeAll,
      1: handleMsgAll,
      2: handlePendingAll,
    };

    const handler = viewAllHandlers[barActiveIndex];
    handler?.();

    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const changeBar = (index: number) => {
    setBarActiveIndex(index);
  };

  if (!visible && !show) {
    return null;
  }

  return (
    <div
      className={cn(
        'nova-notification-panel',
        'art-card-sm !shadow-xl',
        'absolute top-14.5 right-5 w-90 h-125 overflow-hidden',
        'transition-all duration-300 origin-top will-change-[top,left]',
        'max-[640px]:top-[65px] max-[640px]:right-0 max-[640px]:w-full max-[640px]:h-[80vh]',
      )}
      style={{
        transform: show ? 'scaleY(1)' : 'scaleY(0.9)',
        opacity: show ? 1 : 0,
      }}
      onClick={(event) => {
        event.stopPropagation();
      }}>
      <div className="mt-3.5 flex items-center justify-between px-3.5">
        <span className="text-base font-medium text-g-800">通知中心</span>
        <span className="c-p select-none rounded px-1.5 py-1 text-xs text-g-800 hover:bg-g-200">
          一键已读
        </span>
      </div>

      <ul className="border-b-d box-border flex h-12.5 w-full items-end px-3.5">
        {barList.map((item, index) => (
          <li
            key={item.name}
            className={cn(
              'c-p mr-5 h-12 select-none overflow-hidden text-[13px] leading-[3rem] text-g-700',
              'border-b-2 border-transparent',
              barActiveIndex === index && 'border-[var(--theme-color)] text-[var(--theme-color)]',
            )}
            onClick={() => changeBar(index)}>
            {item.name} ({item.num})
          </li>
        ))}
      </ul>

      <div className="h-[calc(100%-95px)] w-full">
        <div className="h-[calc(100%-60px)] overflow-y-scroll scrollbar-thin">
          {barActiveIndex === 0 && (
            <ul>
              {noticeList.map((item) => {
                const style = getNoticeStyle(item.type);
                return (
                  <li
                    key={`${item.title}-${item.time}`}
                    className="box-border flex cursor-pointer items-center px-3.5 py-3.5 last:border-b-0 hover:bg-g-200/60">
                    <div
                      className={cn(
                        'flex size-9 items-center justify-center rounded-lg text-center leading-9',
                        style.iconClass,
                      )}>
                      <NovaSvgIcon className="text-lg !bg-transparent" icon={style.icon} />
                    </div>
                    <div className="ml-3.5 w-[calc(100%-45px)]">
                      <h4 className="text-sm font-normal leading-[1.375rem] text-g-900">
                        {item.title}
                      </h4>
                      <p className="mt-1.5 text-xs text-g-500">{item.time}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {barActiveIndex === 1 && (
            <ul>
              {msgList.map((item) => (
                <li
                  key={`${item.title}-${item.time}`}
                  className="box-border flex cursor-pointer items-center px-3.5 py-3.5 last:border-b-0 hover:bg-g-200/60">
                  <div className="h-9 w-9">
                    <img src={item.avatar} alt={item.title} className="h-full w-full rounded-lg" />
                  </div>
                  <div className="ml-3.5 w-[calc(100%-45px)]">
                    <h4 className="text-xs font-normal leading-[1.375rem]">{item.title}</h4>
                    <p className="mt-1.5 text-xs text-g-500">{item.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {barActiveIndex === 2 && (
            <ul>
              {pendingList.map((item) => (
                <li
                  key={`${item.title}-${item.time}`}
                  className="box-border px-5 py-3.5 last:border-b-0">
                  <h4>{item.title}</h4>
                  <p className="text-xs text-g-500">{item.time}</p>
                </li>
              ))}
            </ul>
          )}

          {currentTabIsEmpty && (
            <div className="relative top-25 h-full !bg-transparent text-center text-g-500">
              <NovaSvgIcon icon="system-uicons:inbox" className="text-5xl" />
              <p className="mt-3.5 text-xs !bg-transparent">
                当前暂无
                {barList[barActiveIndex]?.name}
              </p>
            </div>
          )}
        </div>

        <div className="relative box-border w-full px-3.5">
          <Button className="mt-3 w-full" onClick={handleViewAll}>
            查看全部
          </Button>
        </div>
      </div>

      <div className="h-25" />
    </div>
  );
}
