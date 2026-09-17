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
    <header className={`h-16 sm:h-18 sticky top-0 z-40 flex items-center justify-between px-3 sm:px-6 lg:px-8 border-b transition-colors duration-200 backdrop-blur-md ${
      dashboardTheme === 'dark' ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white/90 border-slate-200 text-slate-900'
    }`}>
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger Toggle Button */}
        <button 
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition" 
          onClick={toggleMobileSidebar}
          title="Toggle Navigation Menu"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm sm:text-base lg:text-lg font-extrabold truncate tracking-tight text-slate-900 dark:text-white">
            {displayTitle}
          </h1>
          <p className="hidden sm:block text-xs text-slate-500 truncate mt-0.5">
            {displaySubtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Search Bar */}
        <div className="hidden md:flex relative items-center w-44 lg:w-64">
          <Search size={16} className="absolute left-3 text-slate-400 pointer-events-none" />
          <input 
            type="text" 
            placeholder={t('searchKeyword')} 
            onClick={() => addToast('Global Search shortcut activated (Ctrl+K / ⌘K)', 'info')}
            className="w-full pl-9 pr-8 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition"
          />
          <span className="absolute right-2.5 text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-1.5 py-0.5 rounded shadow-xs pointer-events-none">
            ⌘
          </span>
        </div>

        {/* Toolbar Icons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Multi-Language Dropdown */}
          <div className="relative">
            <button 
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition" 
              onClick={() => setIsLangOpen(!isLangOpen)}
              title={t('selectLanguage')}
            >
              <span className="text-base leading-none">{selectedLang.flag}</span>
            </button>

            {isLangOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 py-1 overflow-hidden animate-in fade-in duration-150">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3.5 py-2 border-b border-slate-100 dark:border-slate-700">
                  {t('selectLanguage')}
                </div>
                {languages.map((lang) => (
                  <button 
                    key={lang.code}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-left transition ${
                      selectedLang.code === lang.code 
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold' 
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                    onClick={() => handleLanguageChange(lang)}
                  >
                    <span className="text-sm">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen Toggle */}
          <button 
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition" 
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>

          {/* Theme Toggle */}
          <button 
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition" 
            onClick={toggleDashboardTheme}
            title={`Dashboard Theme: ${dashboardTheme === 'dark' ? 'Dark' : 'Light'}`}
          >
            {dashboardTheme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
          </button>

          {/* Calendar Launcher */}
          <button 
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition" 
            onClick={() => setShowNavCalendar(true)}
            title="Open HR Calendar & Schedule"
          >
            <Calendar size={18} />
          </button>

          {/* Settings Icon */}
          <button 
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition" 
            onClick={handleSettingsClick}
            title="Admin Settings"
          >
            <Settings size={18} />
          </button>
        </div>

        {/* User Profile Badge */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800">
          {user?.profilePhoto ? (
            <img 
              src={user.profilePhoto} 
              alt={user.fullName || 'User'} 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
            />
          ) : (
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-blue-700 to-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              {(user?.fullName || 'User').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
          )}
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.fullName || 'User'}</span>
            <span className="text-[11px] text-slate-400 truncate">{user?.designation || (userRole === 'admin' ? 'System Administrator' : 'Employee')}</span>
          </div>
        </div>
      </div>

      {/* Calendar Modal */}
      {showNavCalendar && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4" 
          onClick={() => setShowNavCalendar(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200" 
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-900 to-blue-600 text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <Calendar size={20} className="text-blue-200" />
                <h3 className="font-bold text-white text-base">HRMS Executive Calendar & Schedule</h3>
              </div>
              <button 
                onClick={() => setShowNavCalendar(false)} 
                className="text-white/80 hover:text-white transition p-1"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
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
                const firstDayOffset = new Date(currentYear, currentMonthIdx, 1).getDay();

                const staffOnLeave = employees ? employees.filter((e) => e.status === 'On Leave') : [];

                return (
                  <>
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <span className="font-extrabold text-slate-900 dark:text-white text-base">{displayMonthYear}</span>
                      <span className="text-xs font-bold px-3 py-1 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-full">{displayTodayBadge}</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                        <div key={day} className="font-extrabold text-slate-400 py-1">{day}</div>
                      ))}
                      
                      {[...Array(firstDayOffset)].map((_, i) => (
                        <div key={`offset-${i}`} />
                      ))}

                      {[...Array(daysInMonth)].map((_, idx) => {
                        const dayNum = idx + 1;
                        const isToday = dayNum === currentDayNum;
                        const hasEvent = (dayNum % 5 === 0 || isToday);
                        return (
                          <div 
                            key={dayNum}
                            className={`py-2 rounded-xl text-xs font-semibold relative cursor-pointer transition ${
                              isToday 
                                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30' 
                                : hasEvent 
                                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40' 
                                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                            }`}
                            onClick={() => addToast(`Events for ${currentShortMonth} ${dayNum}, ${currentYear}: ${isToday ? `${employees ? employees.length : 0} Active Staff & ${staffOnLeave.length} On Leave` : 'Normal Operations Working Day'}`, 'info')}
                          >
                            {dayNum}
                            {hasEvent && !isToday && (
                              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2">
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                        Today's Scheduled Events ({currentShortMonth} {currentDayNum})
                      </h4>
                      <div className="space-y-2 text-xs">
                        {staffOnLeave.length > 0 ? (
                          staffOnLeave.map((emp) => (
                            <div key={emp.id} className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border-l-4 border-amber-500 text-amber-900 dark:text-amber-200">
                              <span className="font-bold">📅 {emp.fullName} ({emp.department}) &bull; Approved Leave</span>
                              <span className="font-semibold text-amber-700 dark:text-amber-400">Approved</span>
                            </div>
                          ))
                        ) : null}

                        {departments && departments.slice(0, 2).map((dept) => (
                          <div key={dept.id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border-l-4 border-blue-500 text-blue-900 dark:text-blue-200">
                            <span className="font-bold">👥 {dept.name} Operations & Workforce Review</span>
                            <span className="font-semibold text-blue-700 dark:text-blue-400">10:00 AM</span>
                          </div>
                        ))}

                        <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border-l-4 border-emerald-500 text-emerald-900 dark:text-emerald-200">
                          <span className="font-bold">💼 System Workforce Attendance & Roster Audit ({employees ? employees.length : 0} Staff)</span>
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400">Active</span>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="flex justify-end p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
              <button 
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 transition shadow-xs" 
                onClick={() => setShowNavCalendar(false)}
              >
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
