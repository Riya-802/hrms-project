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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Annual Official Holiday Calendar (2026)</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Holiday Name</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Day</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {holidays.map((h, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <Calendar size={18} className="text-purple-600 shrink-0" />
                        <span>{h.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{h.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{h.day}</td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {h.type}
                      </span>
                    </td>
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
