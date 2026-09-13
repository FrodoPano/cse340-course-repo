// Import any needed model functions
import { getAllProjects } from '../models/projects.js';

// Helper function to format dates
const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
};

// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getAllProjects();
    
    // Format dates for display
    const formattedProjects = projects.map(project => ({
        ...project,
        formatted_date: formatDate(project.project_date)
    }));
    
    const title = 'Service Projects';

    res.render('projects', { title, projects: formattedProjects });
};

// Export any controller functions
export { showProjectsPage };