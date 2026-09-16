import React from 'react';
import { Calendar, Sparkles } from 'lucide-react';

const EmployeeHolidays = () => {
  const holidays = [
    { name: 'New Year Day', date: 'Jan 01, 2026', day: 'Thursday', type: 'Public Holiday' },
    { name: 'Republic Day', date: 'Jan 26, 2026', day: 'Monday', type: 'National Holiday' },
    { name: 'Good Friday', date: 'Apr 03, 2026', day: 'Friday', type: 'Public Holiday' },
    { name: 'Labor Day', date: 'May 01, 2026', day: 'Friday', type: 'Public Holiday' },
    { name: 'Independence Day', date: 'Aug 15, 2026', day: 'Saturday', type: 'National Holiday' },
    { name: 'Gandhi Jayanti', date: 'Oct 02, 2026', day: 'Friday', type: 'National Holiday' },
    { name: 'Dussehra', date: 'Oct 20, 2026', day: 'Tuesday', type: 'Festive Holiday' },
    { name: 'Diwali', date: 'Nov 08, 2026', day: 'Sunday', type: 'Festive Holiday' },
    { name: 'Christmas Day', date: 'Dec 25, 2026', day: 'Friday', type: 'Public Holiday' }
  ];

  return (
    <div className="employee-page-container">
      <div className="emp-card">
        <div className="emp-card-header">
          <h3>Annual Official Holiday Calendar (2026)</h3>
        </div>
        <div className="emp-card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Holiday Name</th>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {holidays.map((h, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={18} color="#8b5cf6" />
                        <span>{h.name}</span>
                      </div>
                    </td>
                    <td>{h.date}</td>
                    <td>{h.day}</td>
                    <td><span className="badge badge-purple">{h.type}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHolidays;
