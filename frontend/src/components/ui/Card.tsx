import type { ReactNode } from 'react';

interface CardProps {
    title?: ReactNode;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
}

export default function Card({ title, action, children, className = '' }: CardProps) {
    return (
        <div className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-100 ${className}`}>
            {(title || action) && (
                <div className="flex items-center justify-between mb-4">
                    {title && <h2 className="text-lg font-bold text-slate-900">{title}</h2>}
                    {action}
                </div>
            )}
            {children}
        </div>
    );
}
