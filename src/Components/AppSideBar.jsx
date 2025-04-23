import { Calendar, Home, Inbox, Search, Settings, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
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

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/Components/ui/collapsible";
import { Separator } from "@/Components/ui/separator";
import ProfileHeader from "./ProfileHeader";
import AuthContext from "@/contexts/AuthContext";
// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Commandes",
    url: "/Commandes",
    icon: Inbox,
  },
  {
    title: "Clients",
    url: "/companies",
    icon: Users,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <ProfileHeader />
        </SidebarHeader>

        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={`sidebar-item ${
                    location.pathname === item.url
                      ? "bg-gray-400 text-gray-200 rounded-md pointer-events-none"
                      : "hover:bg-gray-300 hover:text-gray-900"
                  }`}
                >
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />

        {/* Collapsible Section */}
        <SidebarGroup>
          <SidebarMenu>
            <Collapsible>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <Settings />
                    <span>More Settings</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>

              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem asChild>
                    <Link to="/advanced-settings">Advanced Settings</Link>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem asChild>
                    <Link to="/permissions">Permissions</Link>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenuButton onClick={logout}>
          <Settings />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
