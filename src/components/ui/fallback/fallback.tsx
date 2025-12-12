import { ArrowLeftOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import Icon403 from './icons/icon-403';
import Icon404 from './icons/icon-404';
import Icon500 from './icons/icon-500';
import IconComingSoon from './icons/icon-coming-soon';
import IconOffline from './icons/icon-offline';

export interface FallbackProps {
  /**
   * 描述
   */
  description?: string;
  /**
   * 首页路由地址
   * @default /
   */
  homePath?: string;
  /**
   * 默认显示的图片
   */
  image?: string;
  /**
   * 内置类型
   */
  status?: '403' | '404' | '500' | 'coming-soon' | 'offline';
  /**
   * 页面提示语
   */
  title?: string;
  /**
   * 自定义操作按钮
   */
  action?: React.ReactNode;
}

export function Fallback(props: FallbackProps) {
  const {
    description,
    homePath = '/',
    image,
    status = 'coming-soon',
    title,
    action,
  } = props;

  const navigate = useNavigate();

  const titleText = useMemo(() => {
    if (title) {
      return title;
    }
    switch (status) {
      case '403':
        return '403 禁止访问';
      case '404':
        return '404 页面未找到';
      case '500':
        return '500 服务器错误';
      case 'coming-soon':
        return '即将推出';
      case 'offline':
        return '网络连接中断';
      default:
        return '';
    }
  }, [status, title]);

  const descText = useMemo(() => {
    if (description) {
      return description;
    }
    switch (status) {
      case '403':
        return '您没有权限访问该页面';
      case '404':
        return '抱歉，您访问的页面不存在';
      case '500':
        return '抱歉，服务器发生错误';
      case 'offline':
        return '请检查您的网络连接';
      default:
        return '';
    }
  }, [status, description]);

  const FallbackIcon = useMemo(() => {
    switch (status) {
      case '403':
        return Icon403;
      case '404':
        return Icon404;
      case '500':
        return Icon500;
      case 'coming-soon':
        return IconComingSoon;
      case 'offline':
        return IconOffline;
      default:
        return null;
    }
  }, [status]);

  const showBack = status === '403' || status === '404';
  const showRefresh = status === '500' || status === 'offline';

  const back = () => {
    navigate(homePath);
  };

  const refresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex size-full flex-col items-center justify-center duration-300">
      {image
        ? (
            <img src={image} className="md:1/3 w-1/2 lg:w-1/4" alt="fallback" />
          )
        : (
            FallbackIcon && <FallbackIcon />
          )}
      <div className="flex flex-col items-center justify-center">
        <p className="text-foreground mt-8 text-2xl md:text-3xl lg:text-4xl">
          {titleText}
        </p>
        <p className="text-muted-foreground md:text-md my-4 lg:text-lg">
          {descText}
        </p>
        {action || (
          <>
            {showBack && (
              <Button type="primary" size="large" onClick={back} icon={<ArrowLeftOutlined />}>
                返回首页
              </Button>
            )}
            {showRefresh && (
              <Button type="primary" size="large" onClick={refresh} icon={<ReloadOutlined />}>
                刷新页面
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
