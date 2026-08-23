import type { LucideIcon } from 'lucide-react';
import { GraduationCap } from 'lucide-react';
import SidebarFooter from './SidebarFooter';

export interface SidebarNavItem {
    label: string;
    href: string;
    icon: LucideIcon;
    active?: boolean;
}

interface SidebarProps {
    title: string;
    subtitle?: string;
    navItems: SidebarNavItem[];
    onAskQuestion?: () => void;
    onSettings?: () => void;
    onLogout?: () => void;
}

export default function Sidebar({ title, subtitle, navItems, onAskQuestion, onSettings, onLogout }: SidebarProps) {
    return (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 hidden md:flex">
            <div className="space-y-6">
                <div className="flex items-center space-x-3 p-2">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-900 leading-tight">{title}</h2>
                        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
                    </div>
                </div>

                <nav className="space-y-1">
                    {navItems.map(({ label, href, icon: Icon, active }) => (
                        <a
                            key={label}
                            href={href}
                            className={
                                active
                                    ? 'flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-emerald-50 text-emerald-700 font-semibold border-r-4 border-emerald-600'
                                    : 'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition font-medium'
                            }
                        >
                            <Icon className={`w-5 h-5 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                            <span className="text-sm">{label}</span>
                        </a>
                    ))}
                </nav>
            </div>

            <SidebarFooter onAskQuestion={onAskQuestion} onSettings={onSettings} onLogout={onLogout} />
        </aside>
    );
}
