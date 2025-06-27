class ServiceService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'service';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "type" } },
          { field: { Name: "status" } },
          { field: { Name: "icon" } },
          { field: { Name: "color" } },
          { field: { Name: "last_sync" } },
          { field: { Name: "config" } }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const serviceId = parseInt(id);
      if (isNaN(serviceId) || serviceId <= 0) {
        throw new Error('Invalid service ID');
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "type" } },
          { field: { Name: "status" } },
          { field: { Name: "icon" } },
          { field: { Name: "color" } },
          { field: { Name: "last_sync" } },
          { field: { Name: "config" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, serviceId, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching service with ID ${id}:`, error);
      return null;
    }
  }

  async create(service) {
    try {
      const params = {
        records: [
          {
            Name: service.name || service.Name || '',
            Tags: service.Tags || '',
            type: service.type || '',
            status: service.status || 'disconnected',
            icon: service.icon || '',
            color: service.color || '',
            last_sync: service.lastSync || service.last_sync || new Date().toISOString(),
            config: service.config || ''
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
      console.error('Error creating service:', error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      const serviceId = parseInt(id);
      if (isNaN(serviceId) || serviceId <= 0) {
        throw new Error('Invalid service ID');
      }

      const params = {
        records: [
          {
            Id: serviceId,
            Name: updates.name || updates.Name,
            Tags: updates.Tags,
            type: updates.type,
            status: updates.status,
            icon: updates.icon,
            color: updates.color,
            last_sync: updates.lastSync || updates.last_sync,
            config: updates.config
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
      console.error('Error updating service:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const serviceId = parseInt(id);
      if (isNaN(serviceId) || serviceId <= 0) {
        throw new Error('Invalid service ID');
      }

      const params = {
        RecordIds: [serviceId]
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
      console.error('Error deleting service:', error);
      throw error;
    }
  }

  async sync(id) {
    try {
      const service = await this.update(id, {
        last_sync: new Date().toISOString(),
        status: 'connected'
      });
      return service;
    } catch (error) {
      console.error('Error syncing service:', error);
      throw error;
    }
  }

  async updateConfig(id, config) {
    try {
      const service = await this.getById(id);
      if (!service) {
        throw new Error('Service not found');
      }

      const currentConfig = service.config ? JSON.parse(service.config) : {};
      const updatedConfig = { ...currentConfig, ...config };
      
      const updatedService = await this.update(id, {
        config: JSON.stringify(updatedConfig)
      });
      return updatedService;
    } catch (error) {
      console.error('Error updating service config:', error);
      throw error;
    }
  }

  async getConfig(id) {
    try {
      const service = await this.getById(id);
      if (!service) {
        return null;
      }
      
      return service.config ? JSON.parse(service.config) : {};
    } catch (error) {
      console.error('Error getting service config:', error);
      return {};
    }
  }
}

export default new ServiceService();