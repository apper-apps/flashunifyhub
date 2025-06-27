import rulesData from '@/services/mockData/rules.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class RuleService {
  constructor() {
    this.data = [...rulesData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const item = this.data.find(rule => rule.Id === parseInt(id, 10));
    return item ? { ...item } : null;
  }

  async create(rule) {
    await delay(400);
    const maxId = Math.max(...this.data.map(r => r.Id), 0);
    const newRule = {
      ...rule,
      Id: maxId + 1,
      enabled: rule.enabled !== undefined ? rule.enabled : true
    };
    this.data.push(newRule);
    return { ...newRule };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.data.findIndex(rule => rule.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Rule not found');
    }
    
    const updatedRule = {
      ...this.data[index],
      ...updates,
      Id: this.data[index].Id // Prevent Id modification
    };
    
    this.data[index] = updatedRule;
    return { ...updatedRule };
  }

  async delete(id) {
    await delay(250);
    const index = this.data.findIndex(rule => rule.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Rule not found');
    }
    
    const deletedRule = { ...this.data[index] };
    this.data.splice(index, 1);
    return deletedRule;
  }

  async toggle(id) {
    await delay(200);
    const rule = await this.getById(id);
    if (!rule) {
      throw new Error('Rule not found');
    }
    
    return await this.update(id, { enabled: !rule.enabled });
  }

  async test(id) {
    await delay(500);
    // Simulated rule test
    return {
      success: true,
      message: 'Rule test completed successfully',
      matches: Math.floor(Math.random() * 5) + 1
    };
  }
}

export default new RuleService();