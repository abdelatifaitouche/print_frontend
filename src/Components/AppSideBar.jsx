import { 
  Calendar, Home, Inbox, Settings, Users, LogOut,
  PlusCircle, Folder, HelpCircle, ChevronDown
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "@/contexts/AuthContext";
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
  SidebarMenuItem
} from "@/Components/ui/sidebar";
import { Separator } from "@/Components/ui/separator";
import { Button } from "@/Components/ui/button";
import ProfileHeader from "./ProfileHeader";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/Components/ui/collapsible";

const mainItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Orders", url: "/commandes", icon: Inbox, badge: "12" },
  { title: "Clients", url: "/companies", icon: Users },
];

const stockItems = [
  { title: "Products", url: "/products", icon: Folder },
  { title: "Stock", url: "/stock", icon: Folder },
];

const adminItems = [
  { title: "Users", url: "/users", icon: Users },
  { title: "Documents", url: "/drive", icon: Folder },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const {profile ,  logout } = useContext(AuthContext);
  const location = useLocation();

  const renderMenuItem = (item) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton
        asChild
        active={location.pathname === item.url}
        className="group transition-colors rounded-lg"
      >
        <Link
          to={item.url}
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded hover:bg-gray-200 hover:text-gray-900 w-full"
        >
          <item.icon className="h-5 w-5 text-gray-500 group-hover:text-gray-900 transition-all" />
          <span className="flex-1 truncate">{item.title}</span>
          {item.badge && (
            <span className="ml-auto rounded-full bg-black text-white px-2 py-0.5 text-xs font-semibold">
              {item.badge}
            </span>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  const renderCollapsibleGroup = (title, items) => (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <div className="px-4 py-2 flex justify-between items-center cursor-pointer text-xs font-semibold uppercase text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded">
          <span>{title}</span>
          <ChevronDown className="h-4 w-4 transition-transform duration-200" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarGroupContent className="px-2">
          <SidebarMenu>{items.map(renderMenuItem)}</SidebarMenu>
        </SidebarGroupContent>
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <Sidebar className="border-r bg-white min-h-screen flex flex-col justify-between w-60">
      <SidebarContent className="space-y-6 overflow-hidden">
        <SidebarHeader className="px-4 py-6">
          <ProfileHeader />
        </SidebarHeader>

        {/* Quick Action */}
        <div className="px-4">
          <Button className="w-full gap-2 flex items-center justify-center" size="sm">
            <PlusCircle size={16} /> New Order
          </Button>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase text-gray-400">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{mainItems.map(renderMenuItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="mx-4" />

        {/* Stock Section */}
        {profile?.role == "USER" ? "" : renderCollapsibleGroup("Stock Management", stockItems)}

        <Separator className="mx-4" />

        {/* Admin Section */}
        {profile?.role == "USER" ? "" : renderCollapsibleGroup("Administration", adminItems)}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4">
        <div className="space-y-2">
          <SidebarMenuButton asChild>
            <Link to="/help" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 w-full">
              <HelpCircle className="h-4 w-4" /> Help Center
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton onClick={logout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 w-full">
            <LogOut className="h-4 w-4" /> Logout
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
