import { NavLink } from 'react-router';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="size-full flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Hello Home Page</h1>
      <NavLink to="/dashboard">
        <Button variant="link">Go to Dashboard</Button>
      </NavLink>
    </div>
  );
}
