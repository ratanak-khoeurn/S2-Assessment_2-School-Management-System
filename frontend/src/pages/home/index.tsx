import {
    BookOpen,
    GraduationCap,
    TrendingUp,
    HelpCircle,
    LayoutGrid,
    MapPin,
    MoreVertical,
    Megaphone,
    ArrowRight,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import type { HeaderNavLink } from '../../components/layout/Header';
import type { SidebarNavItem } from '../../components/layout/Sidebar';
import { logoutUser } from '../../services/authService';

const NAV_LINKS: HeaderNavLink[] = [
    { label: 'Dashboard', href: '#', active: true },
    { label: 'Courses', href: '#' },
    { label: 'Schedule', href: '#' },
    { label: 'Grades', href: '#' },
];

const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
    { label: 'Home', href: '#', icon: LayoutGrid, active: true },
    { label: 'My Courses', href: '#', icon: BookOpen },
    { label: 'Class Enrollment', href: '#', icon: GraduationCap },
    { label: 'Academic Progress', href: '#', icon: TrendingUp },
    { label: 'Support', href: '#', icon: HelpCircle },
];

const TODAY_SCHEDULE = [
    {
        time: '09:00',
        period: 'AM',
        course: 'CS101: Intro to Computer Science',
        location: 'Room 304, Science Building',
        badge: 'In 30 mins',
    },
    {
        time: '11:30',
        period: 'AM',
        course: 'ENG205: Modern Literature',
        location: 'Main Library, Hall B',
    },
];

const CURRENT_GRADES = [
    { course: 'CS101', score: '92% (A)', percent: 92, tone: 'emerald' as const },
    { course: 'ENG205', score: '88% (B+)', percent: 88, tone: 'emerald' as const },
    { course: 'MATH301', score: '75% (C)', percent: 75, tone: 'amber' as const },
];

const ANNOUNCEMENTS = [
    {
        tag: 'Important',
        tagClassName: 'bg-indigo-100 text-indigo-700',
        title: 'Spring Registration Opens',
        body: 'Registration for the Spring 2025 semester begins next Monday....',
        postedAt: 'Posted 2 hours ago',
    },
    {
        tag: 'Event',
        tagClassName: 'bg-slate-100 text-slate-600',
        title: 'Career Fair Next Week',
        body: 'Over 50 companies will be at the Student Union for the annual Tech ...',
        postedAt: 'Posted 1 day ago',
    },
    {
        tag: 'Maintenance',
        tagClassName: 'bg-amber-100 text-amber-700',
        title: 'Portal Downtime',
        body: 'EduPortal will be down for scheduled maintenance this Sunday from 2 A...',
        postedAt: 'Posted 2 days ago',
    },
];

export default function EduPortalDashboard() {
    return (
        <DashboardLayout
            brand="EduPortal"
            navLinks={NAV_LINKS}
            sidebarTitle="University Portal"
            sidebarSubtitle="Academic Year 2024"
            sidebarNavItems={SIDEBAR_NAV_ITEMS}
            avatarUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
            onLogout={logoutUser}
        >
            {/* Welcome Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900">Welcome back, Alex</h1>
                <p className="text-slate-500 mt-1 text-sm">
                    Here is an overview of your academic progress for the Fall semester.
                </p>
            </div>

            {/* Top Section: Schedule & Grades */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card
                    className="lg:col-span-2 space-y-5"
                    title="Today's Schedule"
                    action={
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                            Thursday, Oct 24
                        </span>
                    }
                >
                    {TODAY_SCHEDULE.map((item) => (
                        <div
                            key={item.course}
                            className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-white"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="text-center font-bold text-slate-800 leading-tight">
                                    <span className="block text-sm">{item.time}</span>
                                    <span className="text-xs text-slate-400">{item.period}</span>
                                </div>
                                <div className="border-l border-slate-200 pl-4 space-y-1">
                                    <h3 className="text-sm font-bold text-slate-900">{item.course}</h3>
                                    <div className="flex items-center text-xs text-slate-500 space-x-1">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                        <span>{item.location}</span>
                                    </div>
                                </div>
                            </div>
                            {item.badge && (
                                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md">
                                    {item.badge}
                                </span>
                            )}
                        </div>
                    ))}

                    <a
                        href="#"
                        className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 pt-1"
                    >
                        <span>View full schedule</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                </Card>

                <Card
                    className="flex flex-col justify-between"
                    title="Current Grades"
                    action={
                        <button type="button" className="text-slate-400 hover:text-slate-600">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    }
                >
                    <div className="space-y-4">
                        {CURRENT_GRADES.map((grade) => (
                            <div key={grade.course} className="space-y-1.5">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-slate-700">{grade.course}</span>
                                    <span className={grade.tone === 'amber' ? 'text-amber-600' : 'text-emerald-600'}>
                                        {grade.score}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${grade.tone === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                        style={{ width: `${grade.percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                        <span className="text-xs text-slate-500 font-medium">
                            Estimated GPA: <strong className="text-slate-900 font-extrabold text-sm">3.6</strong>
                        </span>
                    </div>
                </Card>
            </div>

            {/* Bottom Section: Campus Announcements */}
            <Card
                className="space-y-4"
                title={
                    <span className="inline-flex items-center gap-2">
                        <Megaphone className="w-5 h-5 text-emerald-600" />
                        Campus Announcements
                    </span>
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {ANNOUNCEMENTS.map((announcement) => (
                        <div
                            key={announcement.title}
                            className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3"
                        >
                            <div className="space-y-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${announcement.tagClassName}`}>
                                    {announcement.tag}
                                </span>
                                <h3 className="text-sm font-bold text-slate-900 leading-snug">{announcement.title}</h3>
                                <p className="text-xs text-slate-500 line-clamp-2">{announcement.body}</p>
                            </div>
                            <span className="text-[11px] font-medium text-slate-400">{announcement.postedAt}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </DashboardLayout>
    );
}
