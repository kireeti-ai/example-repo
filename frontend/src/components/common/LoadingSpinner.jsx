import './LoadingSpinner.css';

function LoadingSpinner({ size = 'md', text }) {
    const sizeClasses = {
        sm: 'spinner-sm',
        md: 'spinner-md',
        lg: 'spinner-lg',
    };

    return (
        <div className="loading-container">
            <div className={`spinner ${sizeClasses[size]}`}></div>
            {text && <p className="loading-text">{text}</p>}
        </div>
    );
}

export default LoadingSpinner;
