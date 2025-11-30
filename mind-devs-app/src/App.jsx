import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import LessonPage from './pages/LessonPage';
import LevelMapPage from './pages/LevelMapPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import StorePage from './pages/StorePage';

function App() {
    const [currentPage, setCurrentPage] = useState('landing');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(1);
    const [authInitialView, setAuthInitialView] = useState('login');

    const goToAuth = (view) => {
        setAuthInitialView(view);
        setCurrentPage('auth');
    };

    const goToMap = (course) => {
        setSelectedCourse(course);
        setCurrentPage('map');
    };

    const startLesson = (level) => {
        setSelectedLevel(level);
        setCurrentPage('lesson');
    };
    useEffect(() => {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    return (
        <div>
            {currentPage === 'landing' && <LandingPage navigateTo={setCurrentPage} goToAuth={goToAuth} />}

            {currentPage === 'auth' && <AuthPage navigateTo={setCurrentPage} initialView={authInitialView} />}

            {currentPage === 'store' && <StorePage navigateTo={setCurrentPage} />}

            {/* --- REVISA ESTA LÍNEA CON CUIDADO --- */}
            {currentPage === 'dashboard' && (
                <Dashboard navigateTo={setCurrentPage} onSelectCourse={goToMap} />
            )}
            {/* ----------------------------------- */}

            {currentPage === 'map' && (
                <LevelMapPage
                    course={selectedCourse}
                    navigateTo={setCurrentPage}
                    onLevelSelect={startLesson}
                />
            )}

            {currentPage === 'lesson' && (
                <LessonPage
                    navigateTo={setCurrentPage}
                    course={selectedCourse}
                    level={selectedLevel}
                />
            )}

            {currentPage === 'profile' && <ProfilePage navigateTo={setCurrentPage} />}
        </div>
    );
}

export default App;