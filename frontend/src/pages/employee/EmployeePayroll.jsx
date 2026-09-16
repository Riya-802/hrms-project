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
    <div className="employee-page-container">
      <div className="emp-metrics-grid">
        <div className="emp-metric-card">
          <div className="metric-icon-box bg-blue">
            <DollarSign size={22} color="#2563eb" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Annual Gross Package</span>
            <h3 className="metric-value">{breakdown.formattedGrossAnnual}</h3>
            <span className="metric-subtext">Base + Allowances</span>
          </div>
        </div>

        <div className="emp-metric-card">
          <div className="metric-icon-box bg-green">
            <DollarSign size={22} color="#10b981" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Monthly Take-Home (Net)</span>
            <h3 className="metric-value">{breakdown.formattedNetPayable}</h3>
            <span className="metric-subtext">Direct Deposit</span>
          </div>
        </div>

        <div className="emp-metric-card">
          <div className="metric-icon-box bg-amber">
            <FileText size={22} color="#d97706" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Tax & Deductions</span>
            <h3 className="metric-value">{breakdown.formattedTaxDeductions} / mo</h3>
            <span className="metric-subtext">Standard Withholding</span>
          </div>
        </div>
      </div>

      <div className="emp-card" style={{ marginTop: '1.5rem' }}>
        <div className="emp-card-header">
          <h3>Monthly Payslips & Statements</h3>
        </div>
        <div className="emp-card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Pay Period</th>
                  <th>Payment Date</th>
                  <th>Gross Salary</th>
                  <th>Net Payable</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {payslips.map((ps, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{ps.month}</td>
                    <td>{ps.date}</td>
                    <td>{ps.gross}</td>
                    <td style={{ color: '#10b981', fontWeight: 600 }}>{ps.net}</td>
                    <td><span className="badge badge-success">{ps.status}</span></td>
                    <td>
                      <button className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.825rem' }} onClick={() => handleDownloadPayslip(ps.month)}>
                        <Download size={14} style={{ marginRight: '0.3rem' }} /> PDF
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
