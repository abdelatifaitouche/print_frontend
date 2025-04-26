import { 
  Calendar, 
  Home, 
  Inbox, 
  Settings, 
  Users, 
  ChevronDown,
  LogOut,
  PlusCircle,
  Folder,
  HelpCircle
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/Components/ui/sidebar";
import { Collapsible, CollapsibleContent } from "@/Components/ui/collapsible";
import { Separator } from "@/Components/ui/separator";
import { Button } from "@/Components/ui/button";
import ProfileHeader from "./ProfileHeader";
import AuthContext from "@/contexts/AuthContext";

const mainItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Orders",
    url: "/commandes",
    icon: Inbox,
    badge: "12",
  },
  {
    title: "Clients",
    url: "/companies",
    icon: Users,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
];

const adminItems = [
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Documents",
    url: "/documents",
    icon: Folder,
  }
];

export function AppSidebar() {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  return (
    <Sidebar className="border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-x-hidden">
      <SidebarContent className="space-y-4">
        {/* Header */}
        <SidebarHeader className="px-4 py-6">
          <ProfileHeader />
        </SidebarHeader>

        {/* Quick Action Button */}
        <div className="px-4">
          <Button className="w-full gap-2" size="sm">
            <PlusCircle size={16} />
            <span>New Order</span>
          </Button>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase text-muted-foreground">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    active={location.pathname === item.url}
                    className="hover:bg-accent hover:text-accent-foreground"
                  >
                    <Link to={item.url} className="group">
                      <item.icon className="h-4 w-4 transition-all group-hover:scale-110" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="mx-4 w-auto" />

        {/* Admin Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase text-muted-foreground">
            Administration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    active={location.pathname === item.url}
                    className="hover:bg-accent hover:text-accent-foreground"
                  >
                    <Link to={item.url} className="group">
                      <item.icon className="h-4 w-4 transition-all group-hover:scale-110" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Collapsible Settings Section */}
              <Collapsible defaultOpen>
                <SidebarMenuItem>
                  <SidebarMenuButton className="hover:bg-accent hover:text-accent-foreground">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                    <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200" />
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <CollapsibleContent className="pl-4">
                  <SidebarMenuSub>
                    <SidebarMenuSubItem asChild>
                      <Link 
                        to="/settings/general" 
                        className="hover:text-primary"
                      >
                        General
                      </Link>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem asChild>
                      <Link 
                        to="/settings/security" 
                        className="hover:text-primary"
                      >
                        Security
                      </Link>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem asChild>
                      <Link 
                        to="/settings/notifications" 
                        className="hover:text-primary"
                      >
                        Notifications
                      </Link>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4">
        <div className="space-y-2">
          <SidebarMenuButton asChild>
            <Link 
              to="/help" 
              className="text-sm text-muted-foreground hover:text-primary"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Help Center</span>
            </Link>
          </SidebarMenuButton>
          
          <SidebarMenuButton 
            onClick={logout}
            className="text-sm text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}