import { NavLink } from 'react-router';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="size-full flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404 Not Found</h1>
      <NavLink to="/">
        <Button variant="link">Back to Home</Button>
      </NavLink>
    </div>
  );
}
