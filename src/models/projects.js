import db from './db.js'

const getAllProjects = async() => {
    const query = `
        SELECT 
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date,
            o.name as organization_name,
            o.organization_id
        FROM service_project sp
        INNER JOIN organization o ON sp.organization_id = o.organization_id
        ORDER BY sp.project_date;
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllProjects}