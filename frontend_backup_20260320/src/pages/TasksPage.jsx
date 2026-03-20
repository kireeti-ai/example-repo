import { useState, useEffect } from 'react';
import taskService from '../services/taskService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './TasksPage.css';

function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadTasks();
    }, [filter]);

    const loadTasks = async () => {
        try {
            const params = filter !== 'all' ? { status: filter } : {};
            const response = await taskService.getMyTasks(params);
            setTasks(response.data || []);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const config = {
            backlog: 'badge-gray',
            todo: 'badge-info',
            in_progress: 'badge-warning',
            in_review: 'badge-primary',
            done: 'badge-success',
        };
        return <span className={`badge ${config[status] || 'badge-gray'}`}>{status.replace('_', ' ')}</span>;
    };

    if (loading) {
        return <div className="tasks-loading"><LoadingSpinner size="lg" /></div>;
    }

    return (
        <div className="tasks-page animate-fade-in">
            <div className="page-header">
                <h1>My Tasks</h1>
                <div className="filter-tabs">
                    {['all', 'todo', 'in_progress', 'done'].map((f) => (
                        <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                            {f === 'all' ? 'All' : f.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>
            <div className="tasks-list">
                {tasks.length === 0 ? (
                    <div className="empty-state"><p>No tasks found</p></div>
                ) : (
                    tasks.map((task) => (
                        <div key={task.id} className="task-card">
                            <div className="task-card-main">
                                <span className="task-number">{task.taskNumber}</span>
                                <span className="task-title">{task.title}</span>
                            </div>
                            <div className="task-card-meta">{getStatusBadge(task.status)}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default TasksPage;
