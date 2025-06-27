import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, parseISO, isSameDay } from 'date-fns';
import { toast } from 'react-toastify';
import projectTimelineService from '@/services/api/projectTimelineService';
import projectService from '@/services/api/projectService';
import ApperIcon from '@/components/ApperIcon';
import ItemCard from '@/components/molecules/ItemCard';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';

const ProjectTimeline = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [timelineItems, setTimelineItems] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (projectId && projects.length > 0) {
      const project = projects.find(p => p.Id === parseInt(projectId));
      if (project) {
        setSelectedProject(project);
        loadTimelineItems(project.Id);
      }
    } else if (!projectId && projects.length > 0) {
      loadAllTimelineItems();
    }
  }, [projectId, projects]);

  const loadProjects = async () => {
    try {
      const projectData = await projectService.getAll();
      setProjects(projectData);
    } catch (err) {
      setError('Failed to load projects');
      toast.error('Failed to load projects');
    }
  };

  const loadTimelineItems = async (pId) => {
    try {
      setLoading(true);
      const items = await projectTimelineService.getProjectTimeline(pId);
      setTimelineItems(items);
      setError(null);
    } catch (err) {
      setError('Failed to load timeline items');
      toast.error('Failed to load timeline items');
    } finally {
      setLoading(false);
    }
  };

  const loadAllTimelineItems = async () => {
    try {
      setLoading(true);
      const items = await projectTimelineService.getAllTimelines();
      setTimelineItems(items);
      setError(null);
    } catch (err) {
      setError('Failed to load timeline items');
      toast.error('Failed to load timeline items');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectChange = (newProjectId) => {
    if (newProjectId === 'all') {
      navigate('/projects/timeline');
      setSelectedProject(null);
    } else {
      const project = projects.find(p => p.Id === parseInt(newProjectId));
      navigate(`/projects/timeline/${newProjectId}`);
      setSelectedProject(project);
    }
  };

  const handleItemSelect = (item) => {
    // Handle item selection based on type
    toast.info(`Selected ${item.type}: ${item.title}`);
  };

  const filteredItems = timelineItems.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    const dateA = new Date(a.date || a.createdAt);
    const dateB = new Date(b.date || b.createdAt);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  // Group items by date
  const groupedItems = sortedItems.reduce((groups, item) => {
    const itemDate = new Date(item.date || item.createdAt);
    const dateKey = format(itemDate, 'yyyy-MM-dd');
    
    if (!groups[dateKey]) {
      groups[dateKey] = {
        date: itemDate,
        items: []
      };
    }
    
    groups[dateKey].items.push(item);
    return groups;
  }, {});

  const dateGroups = Object.values(groupedItems).sort((a, b) => 
    sortOrder === 'desc' ? b.date - a.date : a.date - b.date
  );

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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/projects')}
                className="flex items-center gap-2"
              >
                <ApperIcon name="ArrowLeft" size={16} />
                Back to Projects
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <Select
                value={selectedProject ? selectedProject.Id.toString() : 'all'}
                onChange={handleProjectChange}
                className="min-w-48"
              >
                <option value="all">All Projects</option>
                {projects.map(project => (
                  <option key={project.Id} value={project.Id.toString()}>
                    {project.name}
                  </option>
                ))}
              </Select>
              
              <Select
                value={filterType}
                onChange={setFilterType}
                className="min-w-32"
              >
                <option value="all">All Types</option>
                <option value="task">Tasks</option>
                <option value="email">Emails</option>
                <option value="event">Events</option>
                <option value="document">Documents</option>
              </Select>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="flex items-center gap-2"
              >
                <ApperIcon 
                  name={sortOrder === 'desc' ? 'ArrowDown' : 'ArrowUp'} 
                  size={16} 
                />
                {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Timeline" className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedProject ? `${selectedProject.name} Timeline` : 'Project Timeline'}
            </h1>
          </div>
          <p className="text-gray-600">
            {selectedProject 
              ? `All interactions and activities related to ${selectedProject.name}, organized chronologically.`
              : 'All project interactions and activities across all projects, organized chronologically.'
            }
          </p>
        </div>

        {/* Timeline Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              onClick={() => selectedProject ? loadTimelineItems(selectedProject.Id) : loadAllTimelineItems()}
              variant="primary"
            >
              Try Again
            </Button>
          </div>
        ) : dateGroups.length === 0 ? (
          <div className="text-center py-12">
            <ApperIcon name="Clock" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No timeline items found</p>
            <p className="text-gray-500 text-sm">
              {selectedProject 
                ? `No activities have been recorded for ${selectedProject.name} yet.`
                : 'No activities have been recorded for any projects yet.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {dateGroups.map((group, groupIndex) => (
              <motion.div
                key={format(group.date, 'yyyy-MM-dd')}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: groupIndex * 0.1 }}
                className="relative"
              >
                {/* Date Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0">
                    <div className="bg-primary/10 rounded-lg px-4 py-2">
                      <p className="text-sm font-medium text-primary">
                        {format(group.date, 'MMM dd, yyyy')}
                      </p>
                      <p className="text-xs text-primary/70">
                        {format(group.date, 'EEEE')}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <div className="text-sm text-gray-500">
                    {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                  </div>
                </div>

                {/* Timeline Items */}
                <div className="space-y-4 ml-8">
                  {group.items.map((item, itemIndex) => (
                    <motion.div
                      key={`${item.Id}-${item.type}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: itemIndex * 0.05 }}
                      className="relative"
                    >
                      {/* Timeline connector */}
                      <div className="absolute -left-8 top-4 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-sm"></div>
                      {itemIndex < group.items.length - 1 && (
                        <div className="absolute -left-6 top-8 w-px h-16 bg-gray-200"></div>
                      )}
                      
                      {/* Item Card */}
                      <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                        <ItemCard
                          item={item}
                          service={item.service}
                          onSelect={handleItemSelect}
                          showProject={!selectedProject}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectTimeline;