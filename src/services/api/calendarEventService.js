import calendarEventsData from '@/services/mockData/calendarEvents.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CalendarEventService {
  constructor() {
    this.data = [...calendarEventsData];
  }

  async getAll() {
    await delay(300);
    return [...this.data].sort((a, b) => new Date(a.start) - new Date(b.start));
  }

  async getById(id) {
    await delay(200);
    const item = this.data.find(event => event.Id === parseInt(id, 10));
    return item ? { ...item } : null;
  }

  async getByDateRange(startDate, endDate) {
    await delay(250);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return this.data
      .filter(event => {
        const eventStart = new Date(event.start);
        return eventStart >= start && eventStart <= end;
      })
      .map(event => ({ ...event }))
      .sort((a, b) => new Date(a.start) - new Date(b.start));
  }

  async create(event) {
    await delay(400);
    const maxId = Math.max(...this.data.map(e => e.Id), 0);
    const newEvent = {
      ...event,
      Id: maxId + 1,
      attendees: event.attendees || []
    };
    this.data.push(newEvent);
    return { ...newEvent };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.data.findIndex(event => event.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Event not found');
    }
    
    const updatedEvent = {
      ...this.data[index],
      ...updates,
      Id: this.data[index].Id // Prevent Id modification
    };
    
    this.data[index] = updatedEvent;
    return { ...updatedEvent };
  }

  async delete(id) {
    await delay(250);
    const index = this.data.findIndex(event => event.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Event not found');
    }
    
    const deletedEvent = { ...this.data[index] };
    this.data.splice(index, 1);
    return deletedEvent;
  }

  async checkConflicts(start, end, excludeId = null) {
    await delay(200);
    const eventStart = new Date(start);
    const eventEnd = new Date(end);
    
    return this.data
      .filter(event => {
        if (excludeId && event.Id === parseInt(excludeId, 10)) {
          return false;
        }
        
        const existingStart = new Date(event.start);
        const existingEnd = new Date(event.end);
        
        return (eventStart < existingEnd && eventEnd > existingStart);
      })
      .map(event => ({ ...event }));
  }
}

export default new CalendarEventService();