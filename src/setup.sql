-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- Verify the data
SELECT * FROM organization;

-- ========================================
-- Service Project Table
-- ========================================
CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,
    FOREIGN KEY (organization_id) REFERENCES organization(organization_id) ON DELETE CASCADE
);

-- ========================================
-- Insert sample data: Service Projects
-- ========================================
INSERT INTO service_project (organization_id, title, description, location, project_date)
VALUES
-- BrightFuture Builders projects (organization_id = 1)
(1, 'Community Garden Build', 'Help construct raised garden beds for a local community garden project.', 'Riverside Park', '2026-09-15'),
(1, 'Playground Renovation', 'Volunteers needed to help renovate and paint the community playground equipment.', 'Lincoln Elementary School', '2026-10-05'),
(1, 'Habitat for Humanity Build Day', 'Join us for a day of home construction for a family in need.', 'Maple Street Development', '2026-10-20'),
(1, 'Park Bench Installation', 'Install new benches along the walking trail at the city park.', 'Central Park', '2026-11-08'),
(1, 'Community Center Repair', 'Help repair and update the community center facilities.', 'Downtown Community Center', '2026-11-25'),

-- GreenHarvest Growers projects (organization_id = 2)
(2, 'Urban Farm Planting Day', 'Plant vegetables and herbs at our urban farm location.', 'GreenHarvest Urban Farm', '2026-09-10'),
(2, 'Farmers Market Setup', 'Help set up and run the weekly farmers market booth.', 'Main Street Market', '2026-09-22'),
(2, 'School Garden Workshop', 'Teach elementary students about gardening and healthy eating.', 'Washington Elementary', '2026-10-12'),
(2, 'Composting Education Session', 'Learn and teach others about composting techniques.', 'Community Center', '2026-10-28'),
(2, 'Harvest Festival', 'Help organize and run our annual harvest festival.', 'GreenHarvest Farm', '2026-11-15'),

-- UnityServe Volunteers projects (organization_id = 3)
(3, 'Food Bank Sorting', 'Sort and organize food donations at the local food bank.', 'Community Food Bank', '2026-09-08'),
(3, 'Senior Center Visit', 'Spend time with seniors and help with activities.', 'Sunshine Senior Center', '2026-09-18'),
(3, 'Clothing Drive', 'Help collect, sort, and distribute clothing donations.', 'UnityServe Center', '2026-10-02'),
(3, 'Thanksgiving Meal Service', 'Prepare and serve Thanksgiving meals to those in need.', 'Community Kitchen', '2026-11-20'),
(3, 'Holiday Toy Drive', 'Sort and wrap toys for children in need.', 'UnityServe Warehouse', '2026-12-10');

-- ========================================
-- Category Table
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================
-- Project-Category Junction Table
-- ========================================
CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES service_project(project_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
);

-- ========================================
-- Insert sample data: Categories
-- ========================================
INSERT INTO category (name)
VALUES
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness');

-- ========================================
-- Associate projects with categories
-- ========================================
-- BrightFuture Builders projects (project_id 1-5)
INSERT INTO project_category (project_id, category_id)
VALUES
-- Community Garden Build (1) - Environmental
(1, 1),
-- Playground Renovation (2) - Community Service
(2, 3),
-- Habitat for Humanity Build Day (3) - Community Service
(3, 3),
-- Park Bench Installation (4) - Environmental
(4, 1),
-- Community Center Repair (5) - Community Service
(5, 3),

-- GreenHarvest Growers projects (project_id 6-10)
-- Urban Farm Planting Day (6) - Environmental, Educational
(6, 1),
(6, 2),
-- Farmers Market Setup (7) - Community Service
(7, 3),
-- School Garden Workshop (8) - Educational
(8, 2),
-- Composting Education Session (9) - Environmental, Educational
(9, 1),
(9, 2),
-- Harvest Festival (10) - Community Service
(10, 3),

-- UnityServe Volunteers projects (project_id 11-15)
-- Food Bank Sorting (11) - Community Service
(11, 3),
-- Senior Center Visit (12) - Community Service, Health and Wellness
(12, 3),
(12, 4),
-- Clothing Drive (13) - Community Service
(13, 3),
-- Thanksgiving Meal Service (14) - Community Service
(14, 3),
-- Holiday Toy Drive (15) - Community Service
(15, 3);
