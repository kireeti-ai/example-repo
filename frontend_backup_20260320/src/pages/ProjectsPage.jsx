import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import projectService from '../services/projectService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './ProjectsPage.css';

function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        key: '',
        visibility: 'private',
    });
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const response = await projectService.getProjects();
            setProjects(response.data || []);
        } catch (error) {
            console.error('Failed to load projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        setError('');
        setCreating(true);

        try {
            await projectService.createProject(newProject);
            setShowCreateModal(false);
            setNewProject({ name: '', description: '', key: '', visibility: 'private' });
            loadProjects();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create project');
        } finally {
            setCreating(false);
        }
    };

    const generateKey = (name) => {
        return name
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .split(' ')
            .map((word) => word.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 4);
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setNewProject((prev) => ({
            ...prev,
            name,
            key: prev.key || generateKey(name),
        }));
    };

    if (loading) {
        return (
            <div className="projects-loading">
                <LoadingSpinner size="lg" text="Loading projects..." />
            </div>
        );
    }

    return (
        <div className="projects-page animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>Projects</h1>
                    <p>Manage and organize your team's work</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowCreateModal(true)}
                >
                    + New Project
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📁</div>
                    <h2 className="empty-state-title">No projects yet</h2>
                    <p className="empty-state-text">
                        Create your first project to start organizing your work.
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowCreateModal(true)}
                    >
                        Create Project
                    </button>
                </div>
            ) : (
                <div className="projects-grid">
                    {projects.map((project) => (
                        <Link
                            key={project.id}
                            to={`/projects/${project.id}`}
                            className="project-card"
                        >
                            <div className="project-card-header">
                                <div className="project-card-icon">
                                    {project.key.charAt(0)}
                                </div>
                                <span className={`badge badge-${project.status === 'active' ? 'success' : 'gray'}`}>
                                    {project.status}
                                </span>
                            </div>
                            <h3 className="project-card-title">{project.name}</h3>
                            <p className="project-card-key">{project.key}</p>
                            {project.description && (
                                <p className="project-card-description">{project.description}</p>
                            )}
                            <div className="project-card-footer">
                                <span className="project-card-stat">
                                    📋 {project.taskCount || 0} tasks
                                </span>
                                <span className="project-card-stat">
                                    👥 {project.members?.length || 0} members
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Create New Project</h2>
                            <button
                                className="modal-close"
                                onClick={() => setShowCreateModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleCreateProject}>
                            <div className="modal-body">
                                {error && <div className="auth-error">{error}</div>}

                                <div className="form-group">
                                    <label className="form-label">Project Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={newProject.name}
                                        onChange={handleNameChange}
                                        placeholder="My Awesome Project"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Project Key</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={newProject.key}
                                        onChange={(e) =>
                                            setNewProject((prev) => ({
                                                ...prev,
                                                key: e.target.value.toUpperCase(),
                                            }))
                                        }
                                        placeholder="PROJ"
                                        maxLength={10}
                                        pattern="^[A-Z][A-Z0-9]{1,9}$"
                                        required
                                    />
                                    <small className="form-hint">
                                        2-10 uppercase letters/numbers, starting with a letter
                                    </small>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description (optional)</label>
                                    <textarea
                                        className="form-input"
                                        value={newProject.description}
                                        onChange={(e) =>
                                            setNewProject((prev) => ({
                                                ...prev,
                                                description: e.target.value,
                                            }))
                                        }
                                        placeholder="What's this project about?"
                                        rows={3}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Visibility</label>
                                    <select
                                        className="form-input form-select"
                                        value={newProject.visibility}
                                        onChange={(e) =>
                                            setNewProject((prev) => ({
                                                ...prev,
                                                visibility: e.target.value,
                                            }))
                                        }
                                    >
                                        <option value="private">Private</option>
                                        <option value="public">Public</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={creating}
                                >
                                    {creating ? 'Creating...' : 'Create Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProjectsPage;
