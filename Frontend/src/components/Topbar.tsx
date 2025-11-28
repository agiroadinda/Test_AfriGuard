import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthService from '@/services/AuthService';
import { toast } from 'sonner';

export function Topbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Admin User"}');

  return (
    <div className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-card-foreground">
          Welcome back, {user.name}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
          <User className="h-4 w-4 text-secondary-foreground" />
          <span className="text-sm font-medium text-secondary-foreground">{user.email}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
