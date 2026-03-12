import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/Components/ui/sidebar";
import { AppSidebar } from "@/Components/AppSideBar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";

function generateBreadcrumbLabel(segment) {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function Layout() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-50">
        <AppSidebar />

        {/* Right Side */}
        <div className="flex flex-1 flex-col overflow-hidden">

          {/* Top Bar */}
          <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-white px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="rounded-md p-2 hover:bg-gray-100 transition" />

              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  {segments.map((segment, index) => {
                    const isLast = index === segments.length - 1;
                    const path = `/${segments
                      .slice(0, index + 1)
                      .join("/")}`;
                    const label = generateBreadcrumbLabel(segment);

                    return (
                      <React.Fragment key={path}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          {isLast ? (
                            <BreadcrumbPage>
                              {label}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink asChild>
                              <Link to={path}>{label}</Link>
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </React.Fragment>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Future Right Controls (Notifications / User / Theme) */}
            <div className="flex items-center gap-4">
              {/* Placeholder */}
            </div>
          </header>

          {/* Scrollable Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-7xl px-6 py-8">
              <Outlet />
            </div>
          </main>

        </div>
      </div>
    </SidebarProvider>
  );
}