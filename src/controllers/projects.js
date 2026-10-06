// Import any needed model functions
import { 
    getUpcomingProjects, 
    getProjectDetails, 
    createProject,
    updateProject,
    addVolunteer,
    removeVolunteer,
    isUserVolunteer
} from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { body, validationResult } from 'express-validator';

// Define any constants
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define validation rules for project form
const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

// Helper function to format dates for display
const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
};

// Helper function to format dates for HTML date input (YYYY-MM-DD)
const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
    
    // Check if the logged-in user is already a volunteer
    let userIsVolunteer = false;
    if (req.session && req.session.user) {
        userIsVolunteer = await isUserVolunteer(req.session.user.user_id, projectId);
    }
    
    const title = 'Project Details';

    res.render('project', { 
        title, 
        projectDetails: { 
            ...projectDetails, 
            formatted_date: formattedDate,
            input_date: formatDateForInput(projectDetails.project_date)
        },
        categories,
        userIsVolunteer
    });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
}

const processNewProjectForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-project');
    }

    const { title, description, location, date, organizationId } = req.body;

    try {
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
}

const showEditProjectForm = async (req, res, next) => {
    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);

    // If no project found, forward a 404 error
    if (!projectDetails) {
        const err = new Error('Project Not Found');
        err.status = 404;
        return next(err);
    }

    const organizations = await getAllOrganizations();

    // Format the date for the HTML date input
    const projectWithFormattedDate = {
        ...projectDetails,
        input_date: formatDateForInput(projectDetails.project_date)
    };

    const title = 'Edit Service Project';

    res.render('update-project', { title, projectDetails: projectWithFormattedDate, organizations });
};

const processEditProjectForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/edit-project/' + req.params.id);
    }

    const projectId = req.params.id;
    const { title, description, location, date, organizationId } = req.body;

    await updateProject(projectId, title, description, location, date, organizationId);

    req.flash('success', 'Service project updated successfully!');

    res.redirect(`/project/${projectId}`);
};

const processVolunteer = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    await addVolunteer(userId, projectId);

    req.flash('success', 'You are now signed up to volunteer for this project!');
    res.redirect(`/project/${projectId}`);
};

const processRemoveVolunteer = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    await removeVolunteer(userId, projectId);

    req.flash('success', 'You have been removed as a volunteer for this project.');
    res.redirect(`/project/${projectId}`);
};

// Export any controller functions
export { 
    showProjectsPage, 
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm,
    processVolunteer,
    processRemoveVolunteer
};