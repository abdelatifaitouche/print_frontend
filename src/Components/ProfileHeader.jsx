import { useContext, useEffect } from 'react';
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
  const { profile, verifyToken, logout } = useContext(AuthContext);

  useEffect(() => {
    verifyToken();
  }, []);

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
          className="flex items-center gap-3 p-2 hover:bg-muted/50 w-full justify-start transition-colors rounded-md"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile?.avatar} />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {getInitials(profile?.username || 'US')}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-start overflow-hidden">
            <span className="text-sm font-medium truncate max-w-[140px]">
              {profile?.username || 'Guest'}
            </span>
            <span className="text-xs text-muted-foreground truncate max-w-[140px]">
              {profile?.role || 'Guest'}
            </span>
          </div>

          <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 shadow-lg" align="start" side="right">
        <DropdownMenuItem className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
          My Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
          Account Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
          Notifications
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-destructive hover:bg-destructive/10 transition-colors"
          onClick={logout}
        >
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileHeader;
