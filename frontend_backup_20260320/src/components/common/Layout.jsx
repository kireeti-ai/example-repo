import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './Layout.css';

function Layout() {
    return (
        <div className="layout">
            <Navbar />
            <div className="layout-body">
                <Sidebar />
                <main className="layout-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout;
