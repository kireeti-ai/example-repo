/**
 * @fileoverview Database seed script
 * Creates deterministic demo data for development and testing.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { connectDatabase, disconnectDatabase } = require('../config/database');

// Models
const User = require('../modules/users/User.model');
const Project = require('../modules/projects/Project.model');
const Task = require('../modules/tasks/Task.model');
const Comment = require('../modules/comments/Comment.model');
const Label = require('../modules/labels/Label.model');

const logger = console;

/**
 * Demo users data
 */
const users = [
    {
        email: 'admin@example.com',
        password: 'Admin123!',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
    },
    {
        email: 'john.doe@example.com',
        password: 'JohnDoe123!',
        firstName: 'John',
        lastName: 'Doe',
        role: 'member',
    },
    {
        email: 'jane.smith@example.com',
        password: 'JaneSmith123!',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'member',
    },
    {
        email: 'bob.wilson@example.com',
        password: 'BobWilson123!',
        firstName: 'Bob',
        lastName: 'Wilson',
        role: 'viewer',
    },
];

/**
 * Demo labels data
 */
const labels = [
    { name: 'Bug', color: '#EF4444', description: 'Something isn\'t working' },
    { name: 'Feature', color: '#3B82F6', description: 'New feature request' },
    { name: 'Enhancement', color: '#8B5CF6', description: 'Improvement to existing feature' },
    { name: 'Documentation', color: '#10B981', description: 'Documentation improvements' },
    { name: 'High Priority', color: '#F59E0B', description: 'High priority item' },
    { name: 'Good First Issue', color: '#EC4899', description: 'Good for newcomers' },
];

/**
 * Demo projects data
 */
const projects = [
    {
        name: 'E-Commerce Platform',
        description: 'Full-stack e-commerce platform with React and Node.js',
        key: 'ECOM',
        status: 'active',
        visibility: 'private',
    },
    {
        name: 'Mobile App Backend',
        description: 'REST API backend for mobile application',
        key: 'MOBILE',
        status: 'active',
        visibility: 'private',
    },
    {
        name: 'Documentation Site',
        description: 'Technical documentation website',
        key: 'DOCS',
        status: 'active',
        visibility: 'public',
    },
];

/**
 * Task templates for each project
 */
const taskTemplates = [
    // ECOM tasks
    [
        { title: 'Setup project structure', description: 'Initialize project with required dependencies', status: 'done', priority: 'high', type: 'task' },
        { title: 'Implement user authentication', description: 'Add JWT-based authentication with login and registration', status: 'done', priority: 'high', type: 'feature' },
        { title: 'Create product listing page', description: 'Display products with filtering and sorting', status: 'in_progress', priority: 'high', type: 'feature' },
        { title: 'Shopping cart functionality', description: 'Add, remove, update items in cart', status: 'in_progress', priority: 'high', type: 'feature' },
        { title: 'Fix checkout button not working', description: 'Button doesn\'t respond on mobile devices', status: 'todo', priority: 'urgent', type: 'bug' },
        { title: 'Implement payment gateway', description: 'Integrate Stripe for payments', status: 'todo', priority: 'high', type: 'feature' },
        { title: 'Add product search', description: 'Full-text search for products', status: 'backlog', priority: 'medium', type: 'feature' },
        { title: 'Optimize image loading', description: 'Implement lazy loading for product images', status: 'backlog', priority: 'low', type: 'improvement' },
    ],
    // MOBILE tasks
    [
        { title: 'Design API architecture', description: 'Design RESTful API structure', status: 'done', priority: 'high', type: 'task' },
        { title: 'Implement user endpoints', description: 'CRUD operations for users', status: 'done', priority: 'high', type: 'feature' },
        { title: 'Push notification service', description: 'Firebase integration for push notifications', status: 'in_progress', priority: 'medium', type: 'feature' },
        { title: 'Rate limiting bug', description: 'Rate limiter not resetting properly', status: 'in_review', priority: 'high', type: 'bug' },
        { title: 'Add caching layer', description: 'Redis caching for frequently accessed data', status: 'todo', priority: 'medium', type: 'improvement' },
        { title: 'API documentation', description: 'Generate OpenAPI documentation', status: 'todo', priority: 'medium', type: 'task' },
    ],
    // DOCS tasks
    [
        { title: 'Setup documentation framework', description: 'Initialize with Docusaurus', status: 'done', priority: 'high', type: 'task' },
        { title: 'Write getting started guide', description: 'Beginner-friendly tutorial', status: 'done', priority: 'high', type: 'task' },
        { title: 'API reference section', description: 'Document all API endpoints', status: 'in_progress', priority: 'high', type: 'task' },
        { title: 'Add code examples', description: 'Include code snippets for common use cases', status: 'todo', priority: 'medium', type: 'task' },
        { title: 'Fix broken links', description: 'Several internal links are broken', status: 'todo', priority: 'high', type: 'bug' },
    ],
];

/**
 * Comment templates
 */
const commentTemplates = [
    'This looks good to me! Ready for review.',
    'I\'ve started working on this. Should be done by EOD.',
    'Can we discuss this in the next standup?',
    'Updated the PR with the requested changes.',
    'Great progress! Let me know if you need any help.',
    'I found a potential edge case we should handle.',
];

/**
 * Seed function
 */
async function seed() {
    try {
        logger.log('🌱 Starting database seed...\n');

        await connectDatabase();

        // Clear existing data
        logger.log('🗑️  Clearing existing data...');
        await Promise.all([
            User.deleteMany({}),
            Project.deleteMany({}),
            Task.deleteMany({}),
            Comment.deleteMany({}),
            Label.deleteMany({}),
        ]);

        // Create users
        logger.log('👤 Creating users...');
        const createdUsers = await User.create(users);
        const userMap = {};
        createdUsers.forEach((user) => {
            userMap[user.email] = user;
        });
        logger.log(`   Created ${createdUsers.length} users`);

        // Create global labels
        logger.log('🏷️  Creating labels...');
        const createdLabels = await Label.create(
            labels.map((label) => ({
                ...label,
                project: null,
                createdBy: createdUsers[0]._id,
            }))
        );
        logger.log(`   Created ${createdLabels.length} labels`);

        // Create projects
        logger.log('📁 Creating projects...');
        const createdProjects = [];
        for (let i = 0; i < projects.length; i++) {
            const project = await Project.create({
                ...projects[i],
                owner: createdUsers[0]._id,
                members: [
                    { user: createdUsers[1]._id, role: 'admin' },
                    { user: createdUsers[2]._id, role: 'member' },
                    { user: createdUsers[3]._id, role: 'viewer' },
                ],
            });
            createdProjects.push(project);
        }
        logger.log(`   Created ${createdProjects.length} projects`);

        // Create tasks
        logger.log('📋 Creating tasks...');
        let totalTasks = 0;
        for (let i = 0; i < createdProjects.length; i++) {
            const project = createdProjects[i];
            const templates = taskTemplates[i];

            for (let j = 0; j < templates.length; j++) {
                const template = templates[j];
                const assigneeIndex = j % 4;

                await Task.create({
                    ...template,
                    project: project._id,
                    reporter: createdUsers[0]._id,
                    assignee: assigneeIndex < createdUsers.length ? createdUsers[assigneeIndex]._id : null,
                    labels: j % 3 === 0 ? [createdLabels[j % createdLabels.length]._id] : [],
                    dueDate: j % 2 === 0 ? new Date(Date.now() + (j + 1) * 24 * 60 * 60 * 1000) : null,
                });
                totalTasks++;
            }
        }
        logger.log(`   Created ${totalTasks} tasks`);

        // Create comments
        logger.log('💬 Creating comments...');
        const allTasks = await Task.find({});
        let totalComments = 0;
        for (const task of allTasks.slice(0, 10)) {
            const numComments = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < numComments; i++) {
                await Comment.create({
                    content: commentTemplates[Math.floor(Math.random() * commentTemplates.length)],
                    task: task._id,
                    author: createdUsers[Math.floor(Math.random() * createdUsers.length)]._id,
                });
                totalComments++;
            }
        }
        logger.log(`   Created ${totalComments} comments`);

        logger.log('\n✅ Database seeded successfully!\n');

        // Print credentials
        logger.log('📝 Demo Credentials:');
        logger.log('───────────────────────────────────────');
        users.forEach((user) => {
            logger.log(`   ${user.role.padEnd(8)} | ${user.email.padEnd(25)} | ${user.password}`);
        });
        logger.log('───────────────────────────────────────\n');

    } catch (error) {
        logger.error('❌ Seed failed:', error);
        throw error;
    } finally {
        await disconnectDatabase();
    }
}

// Run seed
seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
