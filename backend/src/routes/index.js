/**
 * @fileoverview API routes index
 * Aggregates all module routes.
 */

const express = require('express');

const authRoutes = require('../modules/auth/routes/auth.routes');
const userRoutes = require('../modules/users/routes/user.routes');
const projectRoutes = require('../modules/projects/routes/project.routes');
const taskRoutes = require('../modules/tasks/routes/task.routes');
const commentRoutes = require('../modules/comments/routes/comment.routes');
const labelRoutes = require('../modules/labels/routes/label.routes');
const activityRoutes = require('../modules/activity/routes/activity.routes');

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/comments', commentRoutes);
router.use('/labels', labelRoutes);
router.use('/activities', activityRoutes);

module.exports = router;
