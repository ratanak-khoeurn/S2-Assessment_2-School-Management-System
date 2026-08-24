import { Search, Bell, HelpCircle } from 'lucide-react';

export interface HeaderNavLink {
    label: string;
    href: string;
    active?: boolean;
}

interface HeaderProps {
    brand: string;
    navLinks: HeaderNavLink[];
    avatarUrl?: string;
    searchPlaceholder?: string;
}

export default function Header({ brand, navLinks, avatarUrl, searchPlaceholder = 'Search...' }: HeaderProps) {
    return (
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center space-x-10">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">{brand}</h1>
                <nav className="hidden md:flex space-x-6 text-sm font-medium">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className={
                                link.active
                                    ? 'text-emerald-600 border-b-2 border-emerald-600 pb-4 pt-4 font-semibold'
                                    : 'text-slate-500 hover:text-slate-800 pb-4 pt-4 transition'
                            }
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>
            </div>

            <div className="flex items-center space-x-4">
                <div className="relative w-64 hidden sm:block">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        className="w-full bg-slate-100 rounded-full pl-9 pr-4 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
                <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition">
                    <Bell className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition">
                    <HelpCircle className="w-5 h-5" />
                </button>
                {avatarUrl && (
                    <img
                        src={avatarUrl}
                        alt="User avatar"
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 cursor-pointer"
                    />
                )}
            </div>
        </header>
    );
}
