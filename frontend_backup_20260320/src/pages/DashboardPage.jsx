import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './DashboardPage.css';

function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [myTasks, setMyTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [tasksRes, projectsRes] = await Promise.all([
                taskService.getMyTasks({ limit: 5 }),
                projectService.getProjects({ limit: 5 }),
            ]);

            setMyTasks(tasksRes.data || []);
            setProjects(projectsRes.data || []);

            // Calculate stats
            const allTasks = tasksRes.data || [];
            setStats({
                totalTasks: tasksRes.meta?.pagination?.total || allTasks.length,
                todoTasks: allTasks.filter((t) => t.status === 'todo').length,
                inProgressTasks: allTasks.filter((t) => t.status === 'in_progress').length,
                doneTasks: allTasks.filter((t) => t.status === 'done').length,
                totalProjects: projectsRes.meta?.pagination?.total || projectsRes.data?.length || 0,
            });
        } catch (error) {
            console.error('Failed to load dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            backlog: { class: 'badge-gray', label: 'Backlog' },
            todo: { class: 'badge-info', label: 'To Do' },
            in_progress: { class: 'badge-warning', label: 'In Progress' },
            in_review: { class: 'badge-primary', label: 'In Review' },
            done: { class: 'badge-success', label: 'Done' },
            cancelled: { class: 'badge-error', label: 'Cancelled' },
        };
        const config = statusConfig[status] || statusConfig.todo;
        return <span className={`badge ${config.class}`}>{config.label}</span>;
    };

    const getPriorityBadge = (priority) => {
        const priorityConfig = {
            low: { class: 'badge-gray', label: 'Low' },
            medium: { class: 'badge-info', label: 'Medium' },
            high: { class: 'badge-warning', label: 'High' },
            urgent: { class: 'badge-error', label: 'Urgent' },
        };
        const config = priorityConfig[priority] || priorityConfig.medium;
        return <span className={`badge ${config.class}`}>{config.label}</span>;
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <LoadingSpinner size="lg" text="Loading dashboard..." />
            </div>
        );
    }

    return (
        <div className="dashboard animate-fade-in">
            <div className="dashboard-header">
                <h1>Welcome back, {user?.firstName}! 👋</h1>
                <p>Here's what's happening with your projects today.</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon stat-icon-primary">📊</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats?.totalProjects || 0}</div>
                        <div className="stat-label">Projects</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-info">📋</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats?.todoTasks || 0}</div>
                        <div className="stat-label">To Do</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-warning">⏳</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats?.inProgressTasks || 0}</div>
                        <div className="stat-label">In Progress</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-success">✅</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats?.doneTasks || 0}</div>
                        <div className="stat-label">Completed</div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                {/* Recent Tasks */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2 className="card-title">My Tasks</h2>
                        <Link to="/tasks" className="btn btn-ghost btn-sm">
                            View All →
                        </Link>
                    </div>
                    <div className="task-list">
                        {myTasks.length === 0 ? (
                            <div className="empty-state-small">
                                <p>No tasks assigned to you</p>
                            </div>
                        ) : (
                            myTasks.map((task) => (
                                <div key={task.id} className="task-item">
                                    <div className="task-item-content">
                                        <div className="task-item-header">
                                            <span className="task-number">{task.taskNumber}</span>
                                            <span className="task-title">{task.title}</span>
                                        </div>
                                        <div className="task-item-meta">
                                            {getStatusBadge(task.status)}
                                            {getPriorityBadge(task.priority)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Projects */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2 className="card-title">Projects</h2>
                        <Link to="/projects" className="btn btn-ghost btn-sm">
                            View All →
                        </Link>
                    </div>
                    <div className="project-list">
                        {projects.length === 0 ? (
                            <div className="empty-state-small">
                                <p>No projects yet</p>
                                <Link to="/projects" className="btn btn-primary btn-sm mt-2">
                                    Create Project
                                </Link>
                            </div>
                        ) : (
                            projects.map((project) => (
                                <Link
                                    key={project.id}
                                    to={`/projects/${project.id}`}
                                    className="project-item"
                                >
                                    <div className="project-icon">{project.key.charAt(0)}</div>
                                    <div className="project-info">
                                        <div className="project-name">{project.name}</div>
                                        <div className="project-key">{project.key}</div>
                                    </div>
                                    <div className="project-stats">
                                        <span className="project-task-count">
                                            {project.taskCount || 0} tasks
                                        </span>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
