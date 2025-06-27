class UnifiedItemService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'unified_item';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "type" } },
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "metadata" } },
          { field: { Name: "service_id" } },
          { field: { Name: "project_id" } }
        ],
        orderBy: [
          {
            fieldName: "timestamp",
            sorttype: "DESC"
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
      console.error('Error fetching unified items:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const itemId = parseInt(id);
      if (isNaN(itemId) || itemId <= 0) {
        throw new Error('Invalid item ID');
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "type" } },
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "metadata" } },
          { field: { Name: "service_id" } },
          { field: { Name: "project_id" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, itemId, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching unified item with ID ${id}:`, error);
      return null;
    }
  }

  async getByServiceId(serviceId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "type" } },
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "metadata" } },
          { field: { Name: "service_id" } },
          { field: { Name: "project_id" } }
        ],
        where: [
          {
            FieldName: "service_id",
            Operator: "EqualTo",
            Values: [parseInt(serviceId)]
          }
        ],
        orderBy: [
          {
            fieldName: "timestamp",
            sorttype: "DESC"
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
      console.error('Error fetching items by service ID:', error);
      throw error;
    }
  }

  async getByType(type) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "type" } },
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "metadata" } },
          { field: { Name: "service_id" } },
          { field: { Name: "project_id" } }
        ],
        where: [
          {
            FieldName: "type",
            Operator: "EqualTo",
            Values: [type]
          }
        ],
        orderBy: [
          {
            fieldName: "timestamp",
            sorttype: "DESC"
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
      console.error('Error fetching items by type:', error);
      throw error;
    }
  }

  async create(item) {
    try {
      const params = {
        records: [
          {
            Name: item.title || item.Name || '',
            Tags: item.Tags || '',
            type: item.type || '',
            title: item.title || '',
            content: item.content || '',
            timestamp: item.timestamp || new Date().toISOString(),
            metadata: item.metadata || '',
            service_id: item.serviceId ? parseInt(item.serviceId) : null,
            project_id: item.projectId ? parseInt(item.projectId) : null
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
      console.error('Error creating unified item:', error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      const itemId = parseInt(id);
      if (isNaN(itemId) || itemId <= 0) {
        throw new Error('Invalid item ID');
      }

      const params = {
        records: [
          {
            Id: itemId,
            Name: updates.title || updates.Name,
            Tags: updates.Tags,
            type: updates.type,
            title: updates.title,
            content: updates.content,
            timestamp: updates.timestamp,
            metadata: updates.metadata,
            service_id: updates.serviceId ? parseInt(updates.serviceId) : undefined,
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
      console.error('Error updating unified item:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const itemId = parseInt(id);
      if (isNaN(itemId) || itemId <= 0) {
        throw new Error('Invalid item ID');
      }

      const params = {
        RecordIds: [itemId]
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
      console.error('Error deleting unified item:', error);
      throw error;
    }
  }
}

export default new UnifiedItemService();