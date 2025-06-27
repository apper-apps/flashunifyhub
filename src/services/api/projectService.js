class ProjectService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'project';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "description" } },
          { field: { Name: "linked_items" } },
          { field: { Name: "color" } },
          { field: { Name: "created" } }
        ],
        orderBy: [
          {
            fieldName: "created",
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
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const projectId = parseInt(id);
      if (isNaN(projectId) || projectId <= 0) {
        throw new Error('Invalid project ID');
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "description" } },
          { field: { Name: "linked_items" } },
          { field: { Name: "color" } },
          { field: { Name: "created" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, projectId, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching project with ID ${id}:`, error);
      return null;
    }
  }

  async create(project) {
    try {
      const params = {
        records: [
          {
            Name: project.name || project.Name || '',
            Tags: project.Tags || '',
            description: project.description || '',
            linked_items: project.linkedItems || project.linked_items || '',
            color: project.color || '',
            created: project.created || new Date().toISOString()
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
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      const projectId = parseInt(id);
      if (isNaN(projectId) || projectId <= 0) {
        throw new Error('Invalid project ID');
      }

      const params = {
        records: [
          {
            Id: projectId,
            Name: updates.name || updates.Name,
            Tags: updates.Tags,
            description: updates.description,
            linked_items: updates.linkedItems || updates.linked_items,
            color: updates.color,
            created: updates.created
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
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const projectId = parseInt(id);
      if (isNaN(projectId) || projectId <= 0) {
        throw new Error('Invalid project ID');
      }

      const params = {
        RecordIds: [projectId]
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
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  async linkItem(projectId, itemId) {
    try {
      const project = await this.getById(projectId);
      if (!project) {
        throw new Error('Project not found');
      }
      
      const linkedItems = project.linked_items ? project.linked_items.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [];
      const itemIdInt = parseInt(itemId);
      
      if (!linkedItems.includes(itemIdInt)) {
        linkedItems.push(itemIdInt);
      }
      
      return await this.update(projectId, { linked_items: linkedItems.join(',') });
    } catch (error) {
      console.error('Error linking item to project:', error);
      throw error;
    }
  }

  async unlinkItem(projectId, itemId) {
    try {
      const project = await this.getById(projectId);
      if (!project) {
        throw new Error('Project not found');
      }
      
      const linkedItems = project.linked_items ? project.linked_items.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [];
      const itemIdInt = parseInt(itemId);
      const filteredItems = linkedItems.filter(id => id !== itemIdInt);
      
      return await this.update(projectId, { linked_items: filteredItems.join(',') });
    } catch (error) {
      console.error('Error unlinking item from project:', error);
      throw error;
    }
  }
}

export default new ProjectService();