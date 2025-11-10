import { Outlet } from 'react-router';
import Content from '../components/Content';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function DefaultLayout() {
  return (
    <div className="h-full w-full flex flex-col">
      <Header />
      <div className="flex-1 w-full flex">
        <Sidebar />
        <Content>
          <Outlet />
        </Content>
      </div>
    </div>
  );
}
