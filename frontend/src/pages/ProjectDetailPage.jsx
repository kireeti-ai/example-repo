import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Avatar from '../components/common/Avatar';
import './ProjectDetailPage.css';

function ProjectDetailPage() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [board, setBoard] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('board');

    const columns = [
        { key: 'backlog', label: 'Backlog', color: '#6B7280' },
        { key: 'todo', label: 'To Do', color: '#3B82F6' },
        { key: 'in_progress', label: 'In Progress', color: '#F59E0B' },
        { key: 'in_review', label: 'In Review', color: '#8B5CF6' },
        { key: 'done', label: 'Done', color: '#10B981' },
    ];

    useEffect(() => {
        loadProjectData();
    }, [id]);

    const loadProjectData = async () => {
        try {
            const [projectRes, boardRes] = await Promise.all([
                projectService.getProjectById(id),
                taskService.getTaskBoard(id),
            ]);
            setProject(projectRes.data.project);
            setBoard(boardRes.data.board || {});
        } catch (error) {
            console.error('Failed to load project:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: '#6B7280',
            medium: '#3B82F6',
            high: '#F59E0B',
            urgent: '#EF4444',
        };
        return colors[priority] || colors.medium;
    };

    if (loading) {
        return (
            <div className="project-detail-loading">
                <LoadingSpinner size="lg" text="Loading project..." />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="empty-state">
                <h2>Project not found</h2>
                <Link to="/projects" className="btn btn-primary mt-4">
                    Back to Projects
                </Link>
            </div>
        );
    }

    return (
        <div className="project-detail animate-fade-in">
            {/* Header */}
            <div className="project-detail-header">
                <div className="project-detail-info">
                    <div className="project-detail-icon">{project.key.charAt(0)}</div>
                    <div>
                        <h1>{project.name}</h1>
                        <p className="project-detail-key">{project.key}</p>
                    </div>
                </div>
                <div className="project-detail-actions">
                    <button className="btn btn-primary">+ Add Task</button>
                </div>
            </div>

            {/* Tabs */}
            <div className="project-tabs">
                <button
                    className={`tab ${activeTab === 'board' ? 'active' : ''}`}
                    onClick={() => setActiveTab('board')}
                >
                    Board
                </button>
                <button
                    className={`tab ${activeTab === 'list' ? 'active' : ''}`}
                    onClick={() => setActiveTab('list')}
                >
                    List
                </button>
                <button
                    className={`tab ${activeTab === 'members' ? 'active' : ''}`}
                    onClick={() => setActiveTab('members')}
                >
                    Members ({project.members?.length || 0})
                </button>
            </div>

            {/* Board View */}
            {activeTab === 'board' && (
                <div className="kanban-board">
                    {columns.map((column) => (
                        <div key={column.key} className="kanban-column">
                            <div className="kanban-column-header">
                                <span
                                    className="column-indicator"
                                    style={{ backgroundColor: column.color }}
                                />
                                <span className="column-title">{column.label}</span>
                                <span className="column-count">
                                    {board[column.key]?.length || 0}
                                </span>
                            </div>
                            <div className="kanban-column-body">
                                {(board[column.key] || []).map((task) => (
                                    <div key={task._id || task.id} className="kanban-card">
                                        <div className="kanban-card-header">
                                            <span className="task-type-icon">
                                                {task.type === 'bug' ? '🐛' : '✨'}
                                            </span>
                                            <span className="task-number">{task.taskNumber}</span>
                                        </div>
                                        <h4 className="kanban-card-title">{task.title}</h4>
                                        <div className="kanban-card-footer">
                                            <span
                                                className="priority-dot"
                                                style={{ backgroundColor: getPriorityColor(task.priority) }}
                                                title={task.priority}
                                            />
                                            {task.assignee && (
                                                <Avatar
                                                    name={`${task.assignee.firstName} ${task.assignee.lastName}`}
                                                    src={task.assignee.avatar}
                                                    size="sm"
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* List View */}
            {activeTab === 'list' && (
                <div className="task-list-view">
                    <table className="task-table">
                        <thead>
                            <tr>
                                <th>Task</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Assignee</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(board)
                                .flat()
                                .map((task) => (
                                    <tr key={task._id || task.id}>
                                        <td>
                                            <div className="task-cell">
                                                <span className="task-number">{task.taskNumber}</span>
                                                <span className="task-title">{task.title}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge badge-${task.status === 'done' ? 'success' :
                                                    task.status === 'in_progress' ? 'warning' : 'info'
                                                }`}>
                                                {task.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className="priority-dot"
                                                style={{ backgroundColor: getPriorityColor(task.priority) }}
                                            />
                                            {task.priority}
                                        </td>
                                        <td>
                                            {task.assignee ? (
                                                <div className="assignee-cell">
                                                    <Avatar
                                                        name={`${task.assignee.firstName} ${task.assignee.lastName}`}
                                                        src={task.assignee.avatar}
                                                        size="sm"
                                                    />
                                                    <span>{task.assignee.firstName} {task.assignee.lastName}</span>
                                                </div>
                                            ) : (
                                                <span className="text-muted">Unassigned</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Members View */}
            {activeTab === 'members' && (
                <div className="members-view">
                    <div className="members-grid">
                        {project.members?.map((member) => (
                            <div key={member.user.id || member.user._id} className="member-card">
                                <Avatar
                                    name={`${member.user.firstName} ${member.user.lastName}`}
                                    src={member.user.avatar}
                                    size="lg"
                                />
                                <div className="member-info">
                                    <h4>{member.user.firstName} {member.user.lastName}</h4>
                                    <p className="member-email">{member.user.email}</p>
                                    <span className={`badge badge-${member.role === 'owner' ? 'primary' : 'gray'}`}>
                                        {member.role}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProjectDetailPage;
