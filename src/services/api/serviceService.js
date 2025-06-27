import servicesData from '@/services/mockData/services.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ServiceService {
  constructor() {
    this.data = [...servicesData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const item = this.data.find(service => service.Id === parseInt(id, 10));
    return item ? { ...item } : null;
  }

  async create(service) {
    await delay(400);
    const maxId = Math.max(...this.data.map(s => s.Id), 0);
    const newService = {
      ...service,
      Id: maxId + 1,
      lastSync: new Date().toISOString()
    };
    this.data.push(newService);
    return { ...newService };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.data.findIndex(service => service.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Service not found');
    }
    
    const updatedService = {
      ...this.data[index],
      ...updates,
      Id: this.data[index].Id // Prevent Id modification
    };
    
    this.data[index] = updatedService;
    return { ...updatedService };
  }

  async delete(id) {
    await delay(250);
    const index = this.data.findIndex(service => service.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Service not found');
    }
    
    const deletedService = { ...this.data[index] };
    this.data.splice(index, 1);
    return deletedService;
  }

  async sync(id) {
    await delay(1000);
    const service = await this.update(id, {
      lastSync: new Date().toISOString(),
      status: 'connected'
    });
return service;
  }

  async updateConfig(id, config) {
    await delay(300);
    const service = await this.getById(id);
    if (!service) {
      throw new Error('Service not found');
    }

    const updatedService = await this.update(id, {
      config: { ...service.config, ...config }
    });
    return updatedService;
  }

  async getConfig(id) {
    await delay(200);
    const service = await this.getById(id);
    return service ? service.config || {} : null;
  }
}

export default new ServiceService();