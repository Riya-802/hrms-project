import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, 
  Menu, 
  Sun, 
  Moon, 
  Maximize, 
  Minimize, 
  Calendar, 
  Settings, 
  Globe, 
  ChevronDown,
  X
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';

const languages = [
  { code: 'EN', name: 'English (US)', flag: '🇺🇸' },
  { code: 'ES', name: 'Español', flag: '🇪🇸' },
  { code: 'FR', name: 'Français', flag: '🇫🇷' },
  { code: 'DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'HI', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
];

const Navbar = ({ title, subtitle }) => {
  const { 
    user,
    userRole,
    addToast, 
    toggleMobileSidebar, 
    dashboardTheme, 
    toggleDashboardTheme,
    currentLanguage,
    changeLanguage,
    t,
    currentFormattedDate,
    employees,
    departments 
  } = useHRMS();
  
  const selectedLang = languages.find((l) => l.code === currentLanguage) || languages[0];
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNavCalendar, setShowNavCalendar] = useState(false);

  const displayTitle = title || t('adminDashboard');
  const displaySubtitle = subtitle || t('welcomeBack');

  const handleLanguageChange = (lang) => {
    changeLanguage(lang.code);
    setIsLangOpen(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
      addToast('Entered fullscreen mode', 'info');
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
      addToast('Exited fullscreen mode', 'info');
    }
  };

  const handleSettingsClick = () => {
    addToast('Admin System Preferences panel opened.', 'info');
  };

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Mobile Hamburger Toggle Button */}
        <button 
          className="btn-icon mobile-menu-toggle" 
          onClick={toggleMobileSidebar}
          title="Toggle Navigation Menu"
        >
          <Menu size={22} />
        </button>

        <div className="navbar-title-group">
          <h1>{displayTitle}</h1>
          <p className="navbar-subtitle-text">{displaySubtitle}</p>
        </div>
      </div>

      <div className="navbar-actions">
        {/* Search Bar with ⌘K Badge */}
        <div className="navbar-search">
          <Search className="navbar-search-icon" />
          <input 
            type="text" 
            placeholder={t('searchKeyword')} 
            onClick={() => addToast('Global Search shortcut activated (Ctrl+K / ⌘K)', 'info')}
          />
          <span className="navbar-search-shortcut">⌘</span>
        </div>

        {/* Toolbar Icons Matching Reference Header */}
        <div className="navbar-toolbar">
          {/* Multi-Language Dropdown Toggle */}
          <div className="lang-dropdown-wrapper" style={{ position: 'relative' }}>
            <button 
              className="navbar-tool-btn lang-btn" 
              onClick={() => setIsLangOpen(!isLangOpen)}
              title={t('selectLanguage')}
            >
              <span className="flag-icon">{selectedLang.flag}</span>
            </button>

            {isLangOpen && (
              <div className="lang-menu">
                <div className="lang-menu-header">{t('selectLanguage')}</div>
                {languages.map((lang) => (
                  <div 
                    key={lang.code}
                    className={`lang-option ${selectedLang.code === lang.code ? 'active' : ''}`}
                    onClick={() => handleLanguageChange(lang)}
                  >
                    <span className="flag-icon">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen Toggle */}
          <button 
            className="navbar-tool-btn" 
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>

          {/* Dark / Light Dashboard Theme Toggle */}
          <button 
            className="navbar-tool-btn" 
            onClick={toggleDashboardTheme}
            title={`Dashboard Theme: ${dashboardTheme === 'dark' ? 'Dark' : 'Light'}`}
          >
            {dashboardTheme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#475569" />}
          </button>

          {/* Calendar Quick View Launcher */}
          <button 
            className="navbar-tool-btn" 
            onClick={() => setShowNavCalendar(true)}
            title="Open HR Calendar & Schedule"
          >
            <Calendar size={18} />
          </button>

          {/* Note: Notification bell removed per explicit user instruction */}

          {/* Settings / Gear Icon */}
          <button 
            className="navbar-tool-btn" 
            onClick={handleSettingsClick}
            title="Admin Settings"
          >
            <Settings size={18} />
          </button>
        </div>

        {/* User Profile Badge */}
        <div className="user-profile-badge">
          {user?.profilePhoto ? (
            <img 
              src={user.profilePhoto} 
              alt={user.fullName || 'User'} 
              className="user-avatar-img"
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div className="user-avatar">
              {(user?.fullName || 'User').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
          )}
          <div className="user-info">
            <span className="user-name">{user?.fullName || 'User'}</span>
            <span className="user-role">{user?.designation || (userRole === 'admin' ? 'System Administrator' : 'Employee')}</span>
          </div>
        </div>
      </div>

      {/* Interactive Quick Calendar Modal (Portaled directly to document.body for top z-index) */}
      {showNavCalendar && createPortal(
        <div 
          className="modal-overlay" 
          onClick={() => setShowNavCalendar(false)}
          style={{ zIndex: 999999, position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(5px)', padding: '1rem' }}
        >
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxWidth: '520px', maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', zIndex: 1000000 }}
          >
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', color: '#ffffff', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Calendar size={20} color="#93c5fd" />
                <h3 style={{ color: '#ffffff', margin: 0 }}>HRMS Executive Calendar & Schedule</h3>
              </div>
              <button className="toast-close" onClick={() => setShowNavCalendar(false)} style={{ color: '#ffffff', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            
            <div className="modal-body" style={{ padding: '1.25rem', overflowY: 'auto', flex: 1 }}>
              {(() => {
                const now = new Date();
                const currentYear = now.getFullYear();
                const currentMonthIdx = now.getMonth();
                const currentDayNum = now.getDate();

                const monthNames = {
                  EN: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                  ES: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                  FR: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
                  DE: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
                  HI: ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर']
                };

                const shortMonthNames = {
                  EN: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                  ES: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                  FR: ['Janv', 'Févr', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
                  DE: ['Jan', 'Feb', 'März', 'Apr', 'Mai', 'Juni', 'Juli', 'Aug', 'Sept', 'Okt', 'Nov', 'Dez'],
                  HI: ['जन', 'फर', 'मार्च', 'अप', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितं', 'अक्टू', 'नवं', 'दिसं']
                };

                const currentMonthName = (monthNames[currentLanguage] || monthNames['EN'])[currentMonthIdx];
                const currentShortMonth = (shortMonthNames[currentLanguage] || shortMonthNames['EN'])[currentMonthIdx];
                const displayMonthYear = `${currentMonthName} ${currentYear}`;
                const displayTodayBadge = `Today: ${currentShortMonth} ${currentDayNum}`;

                const daysInMonth = new Date(currentYear, currentMonthIdx + 1, 0).getDate();
                const firstDayOffset = new Date(currentYear, currentMonthIdx, 1).getDay(); // 0 = Sun

                const staffOnLeave = employees.filter((e) => e.status === 'On Leave');

                return (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '1rem' }}>{displayMonthYear}</span>
                      <span style={{ fontSize: '0.8rem', background: '#eff6ff', color: '#1d4ed8', fontWeight: '700', padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-full)' }}>{displayTodayBadge}</span>
                    </div>

                    {/* Monthly Mini Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.35rem', textAlign: 'center', fontSize: '0.78rem', marginBottom: '1.25rem' }}>
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                        <div key={day} style={{ fontWeight: '800', color: 'var(--text-muted)', padding: '0.3rem 0' }}>{day}</div>
                      ))}
                      
                      {/* First Day Offset Slots */}
                      {[...Array(firstDayOffset)].map((_, i) => (
                        <div key={`offset-${i}`} />
                      ))}

                      {/* Month Days */}
                      {[...Array(daysInMonth)].map((_, idx) => {
                        const dayNum = idx + 1;
                        const isToday = dayNum === currentDayNum;
                        const hasEvent = (dayNum % 5 === 0 || isToday);
                        return (
                          <div 
                            key={dayNum}
                            style={{
                              padding: '0.5rem 0',
                              borderRadius: 'var(--radius-sm)',
                              fontWeight: isToday ? '800' : '600',
                              backgroundColor: isToday ? '#2563eb' : hasEvent ? '#eff6ff' : '#ffffff',
                              color: isToday ? '#ffffff' : hasEvent ? '#1d4ed8' : 'var(--text-main)',
                              border: isToday ? 'none' : '1px solid var(--border-color)',
                              cursor: 'pointer',
                              position: 'relative'
                            }}
                            onClick={() => addToast(`Events for ${currentShortMonth} ${dayNum}, ${currentYear}: ${isToday ? `${employees.length} Active Staff & ${staffOnLeave.length} On Leave` : 'Normal Operations Working Day'}`, 'info')}
                          >
                            {dayNum}
                            {hasEvent && !isToday && (
                              <span style={{ position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', backgroundColor: '#2563eb', borderRadius: '50%' }} />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Schedule Highlights */}
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: '800', marginBottom: '0.75rem', color: 'var(--text-main)' }}>Today's Scheduled Events ({currentShortMonth} {currentDayNum})</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {staffOnLeave.length > 0 ? (
                          staffOnLeave.map((emp) => (
                            <div key={emp.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: '#fffbeb', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #f59e0b' }}>
                              <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#92400e' }}>
                                📅 {emp.fullName} ({emp.department}) &bull; Approved Leave
                              </span>
                              <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: '600' }}>Approved</span>
                            </div>
                          ))
                        ) : null}

                        {departments.slice(0, 2).map((dept) => (
                          <div key={dept.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: '#eff6ff', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #2563eb' }}>
                            <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#1e40af' }}>
                              👥 {dept.name} Operations & Workforce Review
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: '600' }}>10:00 AM</span>
                          </div>
                        ))}

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: '#ecfdf5', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #10b981' }}>
                          <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#047857' }}>
                            💼 System Workforce Attendance & Roster Audit ({employees.length} Active Staff)
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '600' }}>Active</span>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="modal-footer" style={{ flexShrink: 0 }}>
              <button className="btn btn-secondary" onClick={() => setShowNavCalendar(false)}>
                Close Calendar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};

export default Navbar;
