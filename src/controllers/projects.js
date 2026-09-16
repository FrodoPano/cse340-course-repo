// Import any needed model functions
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

// Define any constants
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Helper function to format dates
const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
};

// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    
    // Format dates for display
    const formattedProjects = projects.map(project => ({
        ...project,
        formatted_date: formatDate(project.project_date)
    }));
    
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects: formattedProjects });
};

const showProjectDetailsPage = async (req, res, next) => {
    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);
    
    // If no project found, forward a 404 error
    if (!projectDetails) {
        const err = new Error('Project Not Found');
        err.status = 404;
        return next(err);
    }
    
    // Get the categories for this project
    const categories = await getCategoriesByProjectId(projectId);
    
    // Format the date for display
    const formattedDate = formatDate(projectDetails.project_date);
    
    const title = 'Project Details';

    res.render('project', { 
        title, 
        projectDetails: { 
            ...projectDetails, 
            formatted_date: formattedDate 
        },
        categories
    });
};

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };