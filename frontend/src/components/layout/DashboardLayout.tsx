import type { ReactNode } from 'react';
import Header, { type HeaderNavLink } from './Header';
import Sidebar, { type SidebarNavItem } from './Sidebar';

interface DashboardLayoutProps {
    brand: string;
    navLinks: HeaderNavLink[];
    sidebarTitle: string;
    sidebarSubtitle?: string;
    sidebarNavItems: SidebarNavItem[];
    avatarUrl?: string;
    onAskQuestion?: () => void;
    onSettings?: () => void;
    onLogout?: () => void;
    children: ReactNode;
}

export default function DashboardLayout({
    brand,
    navLinks,
    sidebarTitle,
    sidebarSubtitle,
    sidebarNavItems,
    avatarUrl,
    onAskQuestion,
    onSettings,
    onLogout,
    children,
}: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-[#F3F4F6] text-slate-800 font-sans flex flex-col">
            <Header brand={brand} navLinks={navLinks} avatarUrl={avatarUrl} />

            <div className="flex flex-1">
                <Sidebar
                    title={sidebarTitle}
                    subtitle={sidebarSubtitle}
                    navItems={sidebarNavItems}
                    onAskQuestion={onAskQuestion}
                    onSettings={onSettings}
                    onLogout={onLogout}
                />
                <main className="flex-1 p-8 space-y-8 max-w-7xl">{children}</main>
            </div>
        </div>
    );
}
