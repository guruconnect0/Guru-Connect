import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DashboardCalendar({ bookings = [] }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const upcomingBookings = useMemo(() => {
        return bookings.filter(b => 
            ['pending', 'confirmed', 'awaiting-payment', 'in-progress'].includes(b.status)
        ).slice(0, 3);
    }, [bookings]);

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        const days = [];
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const hasBooking = (day) => {
        if (!day) return false;
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return bookings.some(b => {
            if (!b.date) return false;
            const bookingDate = new Date(b.date).toISOString().split('T')[0];
            return bookingDate === dateStr && ['pending', 'confirmed', 'awaiting-payment'].includes(b.status);
        });
    };

    const formatBookingTime = (booking) => {
        if (!booking.date || !booking.time) return '';
        const date = new Date(booking.date);
        return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${booking.time}`;
    };

    return (
        <Card className="h-full">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">Schedule</CardTitle>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-medium w-24 text-center">
                            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </span>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {days.map(day => (
                        <div key={day} className="text-xs font-medium text-muted-foreground py-1">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {getDaysInMonth(currentDate).map((day, i) => (
                        <div key={i} className={`aspect-square flex items-center justify-center text-sm rounded-lg ${day ? 'hover:bg-accent cursor-pointer' : ''} ${hasBooking(day) ? 'bg-primary/10 text-primary font-medium' : ''}`}>
                            {day || ''}
                        </div>
                    ))}
                </div>

                {upcomingBookings.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-border">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Upcoming Sessions</p>
                        <div className="space-y-3">
                            {upcomingBookings.map((booking, i) => (
                                <div key={i} className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{booking.mentorId?.userId?.name || 'Mentor'}</p>
                                        <p className="text-xs text-muted-foreground">{formatBookingTime(booking)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {upcomingBookings.length === 0 && (
                    <div className="mt-6 pt-4 border-t border-border">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Next Session</p>
                        <p className="text-sm text-muted-foreground">No upcoming sessions</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}