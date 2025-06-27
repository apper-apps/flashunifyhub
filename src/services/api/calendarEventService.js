class CalendarEventService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'calendar_event';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "service_id" } },
          { field: { Name: "title" } },
          { field: { Name: "start" } },
          { field: { Name: "end" } },
          { field: { Name: "attendees" } },
          { field: { Name: "project_id" } }
        ],
        orderBy: [
          {
            fieldName: "start",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const eventId = parseInt(id);
      if (isNaN(eventId) || eventId <= 0) {
        throw new Error('Invalid event ID');
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "service_id" } },
          { field: { Name: "title" } },
          { field: { Name: "start" } },
          { field: { Name: "end" } },
          { field: { Name: "attendees" } },
          { field: { Name: "project_id" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, eventId, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching calendar event with ID ${id}:`, error);
      return null;
    }
  }

  async getByDateRange(startDate, endDate) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "service_id" } },
          { field: { Name: "title" } },
          { field: { Name: "start" } },
          { field: { Name: "end" } },
          { field: { Name: "attendees" } },
          { field: { Name: "project_id" } }
        ],
        where: [
          {
            FieldName: "start",
            Operator: "GreaterThanOrEqualTo",
            Values: [startDate]
          },
          {
            FieldName: "start",
            Operator: "LessThanOrEqualTo",
            Values: [endDate]
          }
        ],
        orderBy: [
          {
            fieldName: "start",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching events by date range:', error);
      throw error;
    }
  }

  async create(event) {
    try {
      const params = {
        records: [
          {
            Name: event.title || event.Name || '',
            Tags: event.Tags || '',
            service_id: event.serviceId ? parseInt(event.serviceId) : null,
            title: event.title || '',
            start: event.start || new Date().toISOString(),
            end: event.end || new Date().toISOString(),
            attendees: Array.isArray(event.attendees) ? event.attendees.join(',') : (event.attendees || ''),
            project_id: event.projectId ? parseInt(event.projectId) : null
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords[0]?.data || null;
      }

      return null;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      const eventId = parseInt(id);
      if (isNaN(eventId) || eventId <= 0) {
        throw new Error('Invalid event ID');
      }

      const params = {
        records: [
          {
            Id: eventId,
            Name: updates.title || updates.Name,
            Tags: updates.Tags,
            service_id: updates.serviceId ? parseInt(updates.serviceId) : undefined,
            title: updates.title,
            start: updates.start,
            end: updates.end,
            attendees: Array.isArray(updates.attendees) ? updates.attendees.join(',') : updates.attendees,
            project_id: updates.projectId ? parseInt(updates.projectId) : undefined
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulUpdates[0]?.data || null;
      }

      return null;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const eventId = parseInt(id);
      if (isNaN(eventId) || eventId <= 0) {
        throw new Error('Invalid event ID');
      }

      const params = {
        RecordIds: [eventId]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }

  async checkConflicts(start, end, excludeId = null) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "start" } },
          { field: { Name: "end" } }
        ],
        where: [
          {
            FieldName: "start",
            Operator: "LessThan",
            Values: [end]
          },
          {
            FieldName: "end",
            Operator: "GreaterThan",
            Values: [start]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const events = response.data || [];
      
      // Filter out excluded event if provided
      if (excludeId) {
        const excludeIdInt = parseInt(excludeId);
        return events.filter(event => event.Id !== excludeIdInt);
      }
      
      return events;
    } catch (error) {
      console.error('Error checking event conflicts:', error);
      throw error;
    }
  }
}

export default new CalendarEventService();