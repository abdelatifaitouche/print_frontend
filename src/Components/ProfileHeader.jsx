import { useContext } from 'react';
import AuthContext from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/Components/ui/dropdown-menu";

function ProfileHeader() {
  const { user, logout } = useContext(AuthContext);

  // Get initials from user's name
  const getInitials = (name) => {
    if (!name) return 'US';
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-3 p-2 hover:bg-muted/50 w-full justify-start"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
              {getInitials(user?.name || 'Abdelatif')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col items-start overflow-hidden">
            <span className="text-sm font-medium truncate max-w-[120px]">
              {user?.name || 'Abdelatif'}
            </span>
            <span className="text-xs text-muted-foreground truncate max-w-[120px]">
              {user?.role || 'Admin'}
            </span>
          </div>
          
          <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="start" side="right">
        <DropdownMenuItem className="cursor-pointer">
          My Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          Account Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          Notifications
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={logout}
        >
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileHeader;