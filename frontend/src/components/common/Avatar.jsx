import './Avatar.css';

function Avatar({ name, src, size = 'md' }) {
    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    const sizeClasses = {
        sm: 'avatar-sm',
        md: 'avatar-md',
        lg: 'avatar-lg',
    };

    return (
        <div className={`avatar ${sizeClasses[size]}`}>
            {src ? (
                <img src={src} alt={name} />
            ) : (
                <span>{getInitials(name)}</span>
            )}
        </div>
    );
}

export default Avatar;
