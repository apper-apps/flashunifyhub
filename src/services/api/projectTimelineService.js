import unifiedItemService from './unifiedItemService';
import calendarEventService from './calendarEventService';
import projectService from './projectService';
import serviceService from './serviceService';

const projectTimelineService = {
  async getProjectTimeline(projectId) {
    try {
      // Validate projectId is integer
      const id = parseInt(projectId);
      if (isNaN(id) || id <= 0) {
        throw new Error('Invalid project ID');
      }

      // Get project to ensure it exists
      const project = await projectService.getById(id);
      if (!project) {
        throw new Error('Project not found');
      }

      // Get all services for reference
      const services = await serviceService.getAll();
      const serviceMap = services.reduce((map, service) => {
        map[service.Id] = service;
        return map;
      }, {});

      // Get unified items for this project
      const unifiedItems = await unifiedItemService.getAll();
      const projectUnifiedItems = unifiedItems
        .filter(item => item.projectId === id)
        .map(item => ({
          ...item,
          type: item.type || 'task',
          service: serviceMap[item.serviceId] || { name: 'Unknown', color: '#6B7280' },
          projectName: project.name
        }));

      // Get calendar events for this project
      const calendarEvents = await calendarEventService.getAll();
      const projectCalendarEvents = calendarEvents
        .filter(event => event.projectId === id)
        .map(event => ({
          ...event,
          type: 'event',
          service: serviceMap[event.serviceId] || { name: 'Calendar', color: '#3B82F6' },
          projectName: project.name
        }));

      // Combine and sort by date
      const allItems = [
        ...projectUnifiedItems,
        ...projectCalendarEvents
      ];

      // Sort by date/createdAt in descending order (newest first)
      const sortedItems = allItems.sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt || a.updatedAt);
        const dateB = new Date(b.date || b.createdAt || b.updatedAt);
        return dateB - dateA;
      });

      // Add a small delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 300));

      return [...sortedItems];

    } catch (error) {
      console.error('Error loading project timeline:', error);
      throw error;
    }
  },

  async getAllTimelines() {
    try {
      // Get all projects
      const projects = await projectService.getAll();
      const projectMap = projects.reduce((map, project) => {
        map[project.Id] = project;
        return map;
      }, {});

      // Get all services for reference
      const services = await serviceService.getAll();
      const serviceMap = services.reduce((map, service) => {
        map[service.Id] = service;
        return map;
      }, {});

      // Get all unified items
      const unifiedItems = await unifiedItemService.getAll();
      const allUnifiedItems = unifiedItems
        .map(item => ({
          ...item,
          type: item.type || 'task',
          service: serviceMap[item.serviceId] || { name: 'Unknown', color: '#6B7280' },
          projectName: projectMap[item.projectId]?.name || 'Unknown Project'
        }));

      // Get all calendar events
      const calendarEvents = await calendarEventService.getAll();
      const allCalendarEvents = calendarEvents
        .map(event => ({
          ...event,
          type: 'event',
          service: serviceMap[event.serviceId] || { name: 'Calendar', color: '#3B82F6' },
          projectName: projectMap[event.projectId]?.name || 'Unknown Project'
        }));

      // Combine and sort by date
      const allItems = [
        ...allUnifiedItems,
        ...allCalendarEvents
      ];

      // Sort by date/createdAt in descending order (newest first)
      const sortedItems = allItems.sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt || a.updatedAt);
        const dateB = new Date(b.date || b.createdAt || b.updatedAt);
        return dateB - dateA;
      });

      // Add a small delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 300));

      return [...sortedItems];

    } catch (error) {
      console.error('Error loading all timelines:', error);
      throw error;
    }
  },

  async getTimelineItemById(id) {
    try {
      // Validate id is integer
      const itemId = parseInt(id);
      if (isNaN(itemId) || itemId <= 0) {
        throw new Error('Invalid item ID');
      }

      // Try to find in unified items first
      try {
        const unifiedItem = await unifiedItemService.getById(itemId);
        if (unifiedItem) {
          const services = await serviceService.getAll();
          const service = services.find(s => s.Id === unifiedItem.serviceId);
          
          const projects = await projectService.getAll();
          const project = projects.find(p => p.Id === unifiedItem.projectId);
          
          return {
            ...unifiedItem,
            type: unifiedItem.type || 'task',
            service: service || { name: 'Unknown', color: '#6B7280' },
            projectName: project?.name || 'Unknown Project'
          };
        }
      } catch (err) {
        // Continue to check calendar events
      }

      // Try to find in calendar events
      try {
        const calendarEvent = await calendarEventService.getById(itemId);
        if (calendarEvent) {
          const services = await serviceService.getAll();
          const service = services.find(s => s.Id === calendarEvent.serviceId);
          
          const projects = await projectService.getAll();
          const project = projects.find(p => p.Id === calendarEvent.projectId);
          
          return {
            ...calendarEvent,
            type: 'event',
            service: service || { name: 'Calendar', color: '#3B82F6' },
            projectName: project?.name || 'Unknown Project'
          };
        }
      } catch (err) {
        // Item not found
      }

      return null;

    } catch (error) {
      console.error('Error loading timeline item:', error);
      throw error;
    }
  },

  async getTimelineStats(projectId = null) {
    try {
      let items;
      
      if (projectId) {
        items = await this.getProjectTimeline(projectId);
      } else {
        items = await this.getAllTimelines();
      }

      const stats = {
        total: items.length,
        byType: {},
        byService: {},
        recentActivity: items.slice(0, 5)
      };

      // Count by type
      items.forEach(item => {
        const type = item.type || 'unknown';
        stats.byType[type] = (stats.byType[type] || 0) + 1;
      });

      // Count by service
      items.forEach(item => {
        const serviceName = item.service?.name || 'Unknown';
        stats.byService[serviceName] = (stats.byService[serviceName] || 0) + 1;
      });

      return stats;

    } catch (error) {
      console.error('Error loading timeline stats:', error);
      throw error;
    }
  }
};

export default projectTimelineService;