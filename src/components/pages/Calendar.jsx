import { useState } from 'react';
import { motion } from 'framer-motion';
import CalendarView from '@/components/organisms/CalendarView';
import ApperIcon from '@/components/ApperIcon';

const Calendar = () => {
  const handleCreateEvent = () => {
    // This would open a modal to create a new calendar event
    console.log('Create new event');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6 max-w-full overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          </div>
          <p className="text-gray-600">
            View and manage events from all your connected calendar services in one unified view.
          </p>
        </div>

        {/* Main Content */}
        <CalendarView onCreateEvent={handleCreateEvent} />
      </div>
    </motion.div>
  );
};

export default Calendar;