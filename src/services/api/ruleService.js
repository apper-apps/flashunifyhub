class RuleService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'rule';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "conditions" } },
          { field: { Name: "actions" } },
          { field: { Name: "enabled" } }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching rules:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const ruleId = parseInt(id);
      if (isNaN(ruleId) || ruleId <= 0) {
        throw new Error('Invalid rule ID');
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "conditions" } },
          { field: { Name: "actions" } },
          { field: { Name: "enabled" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, ruleId, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching rule with ID ${id}:`, error);
      return null;
    }
  }

  async create(rule) {
    try {
      const params = {
        records: [
          {
            Name: rule.name || rule.Name || '',
            Tags: rule.Tags || '',
            conditions: rule.conditions || '',
            actions: rule.actions || '',
            enabled: rule.enabled !== undefined ? rule.enabled : true
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
      console.error('Error creating rule:', error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      const ruleId = parseInt(id);
      if (isNaN(ruleId) || ruleId <= 0) {
        throw new Error('Invalid rule ID');
      }

      const params = {
        records: [
          {
            Id: ruleId,
            Name: updates.name || updates.Name,
            Tags: updates.Tags,
            conditions: updates.conditions,
            actions: updates.actions,
            enabled: updates.enabled
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
      console.error('Error updating rule:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const ruleId = parseInt(id);
      if (isNaN(ruleId) || ruleId <= 0) {
        throw new Error('Invalid rule ID');
      }

      const params = {
        RecordIds: [ruleId]
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
      console.error('Error deleting rule:', error);
      throw error;
    }
  }

  async toggle(id) {
    try {
      const rule = await this.getById(id);
      if (!rule) {
        throw new Error('Rule not found');
      }
      
      return await this.update(id, { enabled: !rule.enabled });
    } catch (error) {
      console.error('Error toggling rule:', error);
      throw error;
    }
  }

  async test(id) {
    try {
      // Simulated rule test - in real implementation this would test against actual data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        message: 'Rule test completed successfully',
        matches: Math.floor(Math.random() * 5) + 1
      };
    } catch (error) {
      console.error('Error testing rule:', error);
      throw error;
    }
  }
}

export default new RuleService();