import { Calendar, CheckCircle, LayoutDashboard, User } from 'lucide-react';

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const TYPE_STYLES = {
  booking:      { icon: Calendar,       bg: 'bg-blue-500/20',    text: 'text-blue-400' },
  registration: { icon: User,           bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  completion:   { icon: CheckCircle,    bg: 'bg-purple-500/20',  text: 'text-purple-400' },
  cancellation: { icon: LayoutDashboard,bg: 'bg-red-500/20',     text: 'text-red-400' },
};

export function ActivityFeed({ items = [], loading }) {
  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-white/5 rounded w-3/4" />
              <div className="h-2 bg-white/5 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!items.length) {
    return <p className="text-gray-500 text-sm text-center py-6">No recent activity</p>;
  }

  return (
    <div className="space-y-5">
      {items.map((activity, i) => {
        const style = TYPE_STYLES[activity.type] || TYPE_STYLES.registration;
        const Icon = style.icon;
        return (
          <div key={activity.id || i} className="flex gap-3 relative">
            {i !== items.length - 1 && (
              <div className="absolute top-8 left-4 bottom-[-16px] w-px bg-white/10" />
            )}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${style.bg} ${style.text}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm">
                <span className="font-medium text-white">{activity.user}</span>{' '}
                <span className="text-gray-400">{activity.action}</span>{' '}
                <span className="font-medium text-[#00CFE8]">{activity.target}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">{timeAgo(activity.time)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
