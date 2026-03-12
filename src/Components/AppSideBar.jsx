import {
  Home, Inbox, Users, Settings,
  LogOut, PlusCircle, Folder,
  HelpCircle, ChevronDown
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useContext, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthContext from "@/contexts/AuthContext";
import { Sidebar, SidebarContent, SidebarFooter } from "@/Components/ui/sidebar";
import { Button } from "@/Components/ui/button";
import ProfileHeader from "./ProfileHeader";

const sections = [
  {
    key: "main",
    items: [
      { title: "Dashboard", url: "/", icon: Home },
      { title: "Orders", url: "/commandes", icon: Inbox },
      { title: "Clients", url: "/companies", icon: Users },
    ],
  },
  {
    key: "finance",
    title: "Finance",
    items: [
      { title: "Overview", url: "/finances", icon: Home },
      { title: "Create Invoice", url: "/create", icon: Inbox },
      { title: "Nouveau Paiment", url: "/payment", icon: Inbox },
    ],
  },
  {
    key: "stock",
    title: "Stock Management",
    restricted: true,
    items: [
      { title: "Products", url: "/products", icon: Folder },
      { title: "Stock", url: "/stock", icon: Folder },
    ],
  },
  {
    key: "admin",
    title: "Administration",
    restricted: true,
    items: [
      { title: "Users", url: "/users", icon: Users },
      { title: "Documents", url: "/drive", icon: Folder },
      { title: "Settings", url: "/settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const { profile, logout } = useContext(AuthContext);
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  // Auto expand section based on active route
  useMemo(() => {
    sections.forEach((section) => {
      if (section.items.some((i) => i.url === location.pathname)) {
        setOpenSection(section.key);
      }
    });
  }, [location.pathname]);

  const isRestricted = (section) =>
    section.restricted &&
    (profile?.role === "USER" || profile?.role === "CLIENT");

  const renderItem = (item) => {
    const active = location.pathname === item.url;

    return (
      <Link
        key={item.title}
        to={item.url}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
          ${active
            ? "bg-black text-white"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
        `}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        {!collapsed && <span className="truncate">{item.title}</span>}
      </Link>
    );
  };

  const renderSection = (section) => {
    if (isRestricted(section)) return null;

    if (section.key === "main") {
      return (
        <div className="space-y-1">
          {section.items.map(renderItem)}
        </div>
      );
    }

    const isOpen = openSection === section.key;

    return (
      <div key={section.key} className="space-y-1">
        <button
          onClick={() =>
            setOpenSection(isOpen ? null : section.key)
          }
          className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          {!collapsed && section.title}
          {!collapsed && (
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </button>

        <AnimatePresence initial={false}>
          {isOpen && !collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden space-y-1"
            >
              {section.items.map(renderItem)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <Sidebar
      className={`h-screen bg-white border-r flex flex-col transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Header */}
      <div className="px-4 py-5 border-b flex items-center justify-between">
        {!collapsed && <ProfileHeader />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-black"
        >
          ☰
        </button>
      </div>

      {/* Scrollable */}
      <SidebarContent className="flex-1 overflow-y-auto py-6 space-y-6">

        {/* CTA */}
        {!collapsed && (
          <div className="px-4">
            <Button className="w-full gap-2">
              <PlusCircle size={16} /> New Order
            </Button>
          </div>
        )}

        {sections.map(renderSection)}

      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t p-4 space-y-2">
        <Link
          to="/help"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
        >
          <HelpCircle className="h-4 w-4" />
          {!collapsed && "Help"}
        </Link>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 w-full"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && "Logout"}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}