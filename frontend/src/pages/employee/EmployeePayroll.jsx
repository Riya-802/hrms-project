import React from 'react';
import { DollarSign, Download, FileText, CheckCircle2 } from 'lucide-react';
import { useHRMS, formatCurrency, getSalaryBreakdown } from '../../context/HRMSContext';

const EmployeePayroll = () => {
  const { user, addToast } = useHRMS();
  const salaryVal = user?.salary || '95000';
  const breakdown = getSalaryBreakdown(salaryVal);

  const payslips = [
    { month: 'August 2026', gross: breakdown.formattedMonthlyGross, net: breakdown.formattedNetPayable, status: 'Paid', date: 'Aug 31, 2026' },
    { month: 'July 2026', gross: breakdown.formattedMonthlyGross, net: breakdown.formattedNetPayable, status: 'Paid', date: 'Jul 31, 2026' },
    { month: 'June 2026', gross: breakdown.formattedMonthlyGross, net: breakdown.formattedNetPayable, status: 'Paid', date: 'Jun 30, 2026' },
    { month: 'May 2026', gross: breakdown.formattedMonthlyGross, net: breakdown.formattedNetPayable, status: 'Paid', date: 'May 31, 2026' }
  ];

  const handleDownloadPayslip = (month) => {
    addToast(`Downloaded PDF Payslip for ${month}`, 'success');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <DollarSign size={22} className="text-blue-600" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Annual Gross Package</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{breakdown.formattedGrossAnnual}</h3>
            <span className="text-xs text-slate-500 mt-0.5 block">Base + Allowances</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign size={22} className="text-emerald-500" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Monthly Take-Home (Net)</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{breakdown.formattedNetPayable}</h3>
            <span className="text-xs text-slate-500 mt-0.5 block">Direct Deposit</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <FileText size={22} className="text-amber-600" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Tax & Deductions</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{breakdown.formattedTaxDeductions} / mo</h3>
            <span className="text-xs text-slate-500 mt-0.5 block">Standard Withholding</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Monthly Payslips & Statements</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pay Period</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment Date</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Salary</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Payable</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payslips.map((ps, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 whitespace-nowrap">{ps.month}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{ps.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{ps.gross}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-emerald-600 whitespace-nowrap">{ps.net}</td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {ps.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <button 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                        onClick={() => handleDownloadPayslip(ps.month)}
                      >
                        <Download size={14} /> PDF
                      </button>
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

export default EmployeePayroll;
