import projectsData from '@/services/mockData/projects.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProjectService {
  constructor() {
    this.data = [...projectsData];
  }

  async getAll() {
    await delay(300);
    return [...this.data].sort((a, b) => new Date(b.created) - new Date(a.created));
  }

  async getById(id) {
    await delay(200);
    const item = this.data.find(project => project.Id === parseInt(id, 10));
    return item ? { ...item } : null;
  }

  async create(project) {
    await delay(400);
    const maxId = Math.max(...this.data.map(p => p.Id), 0);
    const newProject = {
      ...project,
      Id: maxId + 1,
      created: new Date().toISOString(),
      linkedItems: project.linkedItems || []
    };
    this.data.push(newProject);
    return { ...newProject };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.data.findIndex(project => project.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Project not found');
    }
    
    const updatedProject = {
      ...this.data[index],
      ...updates,
      Id: this.data[index].Id // Prevent Id modification
    };
    
    this.data[index] = updatedProject;
    return { ...updatedProject };
  }

  async delete(id) {
    await delay(250);
    const index = this.data.findIndex(project => project.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Project not found');
    }
    
    const deletedProject = { ...this.data[index] };
    this.data.splice(index, 1);
    return deletedProject;
  }

  async linkItem(projectId, itemId) {
    await delay(300);
    const project = await this.getById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    
    const linkedItems = [...(project.linkedItems || [])];
    if (!linkedItems.includes(parseInt(itemId, 10))) {
      linkedItems.push(parseInt(itemId, 10));
    }
    
    return await this.update(projectId, { linkedItems });
  }

  async unlinkItem(projectId, itemId) {
    await delay(300);
    const project = await this.getById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    
    const linkedItems = (project.linkedItems || []).filter(id => id !== parseInt(itemId, 10));
    return await this.update(projectId, { linkedItems });
  }
}

export default new ProjectService();