import unifiedItemsData from '@/services/mockData/unifiedItems.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UnifiedItemService {
  constructor() {
    this.data = [...unifiedItemsData];
  }

  async getAll() {
    await delay(300);
    return [...this.data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async getById(id) {
    await delay(200);
    const item = this.data.find(item => item.Id === parseInt(id, 10));
    return item ? { ...item } : null;
  }

  async getByServiceId(serviceId) {
    await delay(250);
    return this.data
      .filter(item => item.serviceId === serviceId.toString())
      .map(item => ({ ...item }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async getByType(type) {
    await delay(250);
    return this.data
      .filter(item => item.type === type)
      .map(item => ({ ...item }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async create(item) {
    await delay(400);
    const maxId = Math.max(...this.data.map(i => i.Id), 0);
    const newItem = {
      ...item,
      Id: maxId + 1,
      timestamp: new Date().toISOString()
    };
    this.data.push(newItem);
    return { ...newItem };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.data.findIndex(item => item.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Item not found');
    }
    
    const updatedItem = {
      ...this.data[index],
      ...updates,
      Id: this.data[index].Id // Prevent Id modification
    };
    
    this.data[index] = updatedItem;
    return { ...updatedItem };
  }

  async delete(id) {
    await delay(250);
    const index = this.data.findIndex(item => item.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Item not found');
    }
    
    const deletedItem = { ...this.data[index] };
    this.data.splice(index, 1);
    return deletedItem;
  }
}

export default new UnifiedItemService();