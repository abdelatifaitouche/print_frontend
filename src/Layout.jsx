import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/Components/ui/sidebar';
import { AppSidebar } from '@/Components/AppSideBar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/Components/ui/breadcrumb';

function generateBreadcrumbLabel(segment) {
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function Layout() {
  const { pathname } = useLocation();
  const pathSegments = pathname.split('/').filter(Boolean);

  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="flex min-h-screen w-full flex-col bg-gray-50 p-6 sm:p-8">
        {/* Header row with trigger + breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="rounded-md p-2 hover:bg-muted/50 transition-colors" />

            <Breadcrumb className="rounded-md bg-white px-3 py-2 shadow-sm">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                {pathSegments.map((segment, index) => {
                  const isLast = index === pathSegments.length - 1;
                  const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
                  const label = generateBreadcrumbLabel(segment);

                  return (
                    <React.Fragment key={path}>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>{label}</BreadcrumbPage>
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

          {/* ← You can add user menu, notifications, theme switch etc here later */}
        </div>

        {/* Page content */}
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}