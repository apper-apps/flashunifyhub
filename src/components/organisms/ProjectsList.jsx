import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import projectService from '@/services/api/projectService';
import unifiedItemService from '@/services/api/unifiedItemService';
import ProjectCard from '@/components/molecules/ProjectCard';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ProjectsList = ({ onCreateProject, onEditProject }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const projectsData = await projectService.getAll();
      setProjects(projectsData);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (project) => {
    if (!confirm(`Are you sure you want to delete "${project.name}"?`)) {
      return;
    }

    try {
      await projectService.delete(project.Id);
      setProjects(prev => prev.filter(p => p.Id !== project.Id));
      toast.success('Project deleted successfully');
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  const getLinkedItemsCount = (project) => {
    return project.linkedItems ? project.linkedItems.length : 0;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface rounded-lg p-4 shadow-sm"
          >
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface rounded-lg p-8 text-center">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load projects</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={loadProjects}>
          Try again
        </Button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-surface rounded-lg p-8 text-center">
        <ApperIcon name="FolderOpen" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
        <p className="text-gray-600 mb-6">
          Create your first project to start organizing related items across services.
        </p>
        <Button onClick={onCreateProject}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Create Project
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {projects.length} Projects
        </h2>
        <Button onClick={onCreateProject}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProjectCard
              project={project}
              itemCount={getLinkedItemsCount(project)}
              onEdit={onEditProject}
              onDelete={handleDeleteProject}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsList;