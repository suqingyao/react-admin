import { Outlet } from 'react-router';
import { AuthGuard } from './auth';
import { BootstrapGuard } from './bootstrap';

export function AppGuard() {
  return (
    <AuthGuard>
      <BootstrapGuard>
        <Outlet />
      </BootstrapGuard>
    </AuthGuard>
  );
}

export { AuthGuard } from './auth';
export { BootstrapGuard } from './bootstrap';
