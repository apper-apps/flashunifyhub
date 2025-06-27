import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import ProjectsList from "@/components/organisms/ProjectsList";
import Button from "@/components/atoms/Button";

const Projects = () => {
  const navigate = useNavigate();
  const handleCreateProject = () => {
    // This would open a modal to create a new project
    console.log('Create new project');
  };

const handleEditProject = (project) => {
    // This would open a modal to edit the project
    console.log('Edit project:', project);
  };

  const handleViewTimeline = (project) => {
    // Navigate to specific project timeline
    navigate(`/projects/${project.id}/timeline`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6 max-w-full overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="FolderOpen" className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          </div>
<p className="text-gray-600">
            Organize and link related items from different services into unified project workspaces.
          </p>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-4">
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => navigate('/projects/timeline')}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Timeline" size={16} />
              View All Timelines
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <ProjectsList 
          onCreateProject={handleCreateProject}
          onEditProject={handleEditProject}
          onViewTimeline={handleViewTimeline}
        />
      </div>
    </motion.div>
  );
};

export default Projects;