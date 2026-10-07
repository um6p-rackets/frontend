import { Zap } from 'lucide-react';

export default function HotStreakBadge() {
    return (
    <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border bg-yellow-50 text-yellow-600 border-yellow-300 uppercase tracking-wider">
        <Zap className="w-3 h-3 fill-yellow-500 text-yellow-600" />
        <span>HOT STREAK</span>
    </div>
    );
}