import { Settings, LogOut } from 'lucide-react';

interface SidebarFooterProps {
    onAskQuestion?: () => void;
    onSettings?: () => void;
    onLogout?: () => void;
}

export default function SidebarFooter({ onAskQuestion, onSettings, onLogout }: SidebarFooterProps) {
    return (
        <div className="space-y-4 pt-4 border-t border-slate-100">
            <button
                type="button"
                onClick={onAskQuestion}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm transition text-sm"
            >
                Ask a Question
            </button>
            <div className="space-y-1">
                <button
                    type="button"
                    onClick={onSettings}
                    className="flex w-full items-center space-x-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium"
                >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Settings</span>
                </button>
                <button
                    type="button"
                    onClick={onLogout}
                    className="flex w-full items-center space-x-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium"
                >
                    <LogOut className="w-4 h-4 text-slate-400" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
