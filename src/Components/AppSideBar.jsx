import { Calendar, Home, Inbox, Search, Settings, Users } from "lucide-react";
import { Link } from "react-router-dom";
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

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/Components/ui/collapsible";
import { Separator } from "@/Components/ui/separator";
import ProfileHeader from "./ProfileHeader";

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
    url: "/Clients",
    icon: Users,
  },
  {
    title: "Users",
    url: "/Users",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  }, 
];

export function AppSidebar() {
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
                <SidebarMenuItem key={item.title}>
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
        <SidebarMenuButton>
          <Settings />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
