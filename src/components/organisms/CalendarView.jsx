import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, startOfWeek, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import calendarEventService from '@/services/api/calendarEventService';
import serviceService from '@/services/api/serviceService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ServiceBadge from '@/components/molecules/ServiceBadge';

const CalendarView = ({ onCreateEvent }) => {
  const [events, setEvents] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week'); // 'week' | 'month'

  useEffect(() => {
    loadData();
  }, [currentDate]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [eventsData, servicesData] = await Promise.all([
        calendarEventService.getAll(),
        serviceService.getAll()
      ]);
      setEvents(eventsData);
      setServices(servicesData);
    } catch (err) {
      setError(err.message || 'Failed to load calendar data');
      toast.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  const getServiceById = (serviceId) => {
    return services.find(s => s.Id.toString() === serviceId.toString());
  };

  const getEventsForDate = (date) => {
    return events.filter(event => 
      isSameDay(new Date(event.start), date)
    );
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {/* Header */}
        {weekDays.map((day, index) => (
          <div
            key={index}
            className="bg-surface p-3 text-center border-b border-gray-200"
          >
            <div className="text-sm font-medium text-gray-900">
              {format(day, 'EEE')}
            </div>
            <div className={`text-lg ${isSameDay(day, new Date()) ? 'text-primary font-bold' : 'text-gray-700'}`}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
        
        {/* Events */}
        {weekDays.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          return (
            <div
              key={index}
              className="bg-surface p-2 min-h-[200px] space-y-1"
            >
              {dayEvents.map((event, eventIndex) => (
                <motion.div
                  key={event.Id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: eventIndex * 0.05 }}
                  className="bg-primary/10 border border-primary/20 rounded p-2 text-xs"
                >
                  <div className="font-medium text-primary truncate">
                    {event.title}
                  </div>
                  <div className="text-gray-600">
                    {format(new Date(event.start), 'HH:mm')}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <ServiceBadge 
                      service={getServiceById(event.serviceId)} 
                      size="xs" 
                      showName={false} 
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = addDays(calendarStart, 41); // 6 weeks
    const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {/* Header */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="bg-surface p-3 text-center font-medium text-gray-700">
            {day}
          </div>
        ))}
        
        {/* Calendar Days */}
        {calendarDays.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = isSameDay(day, new Date());
          
          return (
            <div
              key={index}
              className={`bg-surface p-2 min-h-[100px] ${!isCurrentMonth ? 'opacity-50' : ''}`}
            >
              <div className={`text-sm mb-1 ${isToday ? 'text-primary font-bold' : 'text-gray-700'}`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((event, eventIndex) => (
                  <div
                    key={event.Id}
                    className="bg-primary/10 border border-primary/20 rounded px-1 py-0.5 text-xs truncate"
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-surface rounded-lg p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-7 gap-4">
            {[...Array(28)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface rounded-lg p-8 text-center">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load calendar</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={loadData}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => view === 'week' ? navigateWeek(-1) : navigateMonth(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="ChevronLeft" className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => view === 'week' ? navigateWeek(1) : navigateMonth(1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="ChevronRight" className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                view === 'week' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                view === 'month' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
              }`}
            >
              Month
            </button>
          </div>
          
          <Button onClick={onCreateEvent}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-surface rounded-lg border border-gray-200">
        {view === 'week' ? renderWeekView() : renderMonthView()}
      </div>

      {/* Events Summary */}
      <div className="bg-surface rounded-lg p-4 border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-3">Connected Calendars</h3>
        <div className="flex flex-wrap gap-2">
          {services
            .filter(service => service.type === 'calendar')
            .map(service => (
              <div key={service.Id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <ServiceBadge service={service} size="sm" />
                <span className="text-xs text-gray-500">
                  {events.filter(e => e.serviceId === service.Id.toString()).length} events
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;