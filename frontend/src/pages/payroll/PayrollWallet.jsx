import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Plus, 
  ShieldCheck, 
  TrendingUp,
  Building2,
  FileText
} from 'lucide-react';
import { useHRMS, formatCurrency } from '../../context/HRMSContext';
import StatCard from '../../components/StatCard';

const PayrollWallet = () => {
  const { user, employees, addToast } = useHRMS();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const [activeTab, setActiveTab] = useState('all');

  // Sample Wallet Transactions linked to PostgreSQL Employees
  const [transactions, setTransactions] = useState([
    {
      id: 'TXN-9081',
      date: '2026-09-01',
      description: 'Monthly Direct Salary Credit (September 2026)',
      category: 'Salary Credit',
      type: 'credit',
      amount: 10416,
      status: 'Completed',
      recipient: user?.fullName || 'Alexander Pierce'
    },
    {
      id: 'TXN-9080',
      date: '2026-08-28',
      description: 'Travel & Local Conveyance Reimbursement',
      category: 'Reimbursement',
      type: 'credit',
      amount: 450,
      status: 'Completed',
      recipient: user?.fullName || 'Alexander Pierce'
    },
    {
      id: 'TXN-9079',
      date: '2026-08-15',
      description: 'Q3 Performance Incentive Bonus',
      category: 'Bonus',
      type: 'credit',
      amount: 2500,
      status: 'Completed',
      recipient: 'Aarav Sharma'
    },
    {
      id: 'TXN-9078',
      date: '2026-08-01',
      description: 'Monthly Direct Salary Credit (August 2026)',
      category: 'Salary Credit',
      type: 'credit',
      amount: 10416,
      status: 'Completed',
      recipient: user?.fullName || 'Alexander Pierce'
    },
    {
      id: 'TXN-9077',
      date: '2026-07-25',
      description: 'Tax Deducted at Source (TDS)',
      category: 'Tax Deduction',
      type: 'debit',
      amount: 1041,
      status: 'Completed',
      recipient: 'Income Tax Department'
    }
  ]);

  const handleWithdraw = () => {
    addToast('Direct Bank Deposit request initiated successfully.', 'success');
  };

  const handleReimbursement = () => {
    addToast('Reimbursement claim form submitted for approval.', 'info');
  };

  const filteredTransactions = transactions.filter(t => {
    if (activeTab === 'credits') return t.type === 'credit';
    if (activeTab === 'debits') return t.type === 'debit';
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{isAdmin ? 'Enterprise Payroll Wallet' : 'My Payroll Wallet'}</h1>
          <p className="text-sm text-slate-500 mt-1">Manage digital salary payouts, bonus allocations, and instant expense reimbursements</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors shadow-sm" 
            onClick={handleReimbursement}
          >
            <Plus size={16} />
            <span>Claim Expense</span>
          </button>
          <button 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-sm" 
            onClick={handleWithdraw}
          >
            <ArrowUpRight size={16} />
            <span>Bank Transfer</span>
          </button>
        </div>
      </div>

      {/* Wallet Balance Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-600 text-white rounded-2xl p-8 shadow-xl shadow-blue-500/10 border border-slate-800">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Wallet size={18} />
              <span>Available Digital Balance</span>
            </div>
            <div className="text-4xl font-extrabold tracking-tight">
              $12,866.00
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300 pt-1">
              <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
              <span>Verified Account • Auto-linked to Corporate Payroll Pool</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-xl border border-white/15 min-w-[160px]">
              <div className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Next Salary Date</div>
              <div className="text-base font-bold text-white mt-1">Oct 01, 2026</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-xl border border-white/15 min-w-[160px]">
              <div className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Pending Claims</div>
              <div className="text-base font-bold text-white mt-1">$450.00</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Disbursed" value="$125,000" icon={DollarSign} color="success" />
        <StatCard title="Total Bonuses" value="$14,500" icon={TrendingUp} color="primary" />
        <StatCard title="Tax Deductions" value="$12,400" icon={FileText} color="warning" />
        <StatCard title="Linked Accounts" value="1 Bank Account" icon={CreditCard} color="info" />
      </div>

      {/* Transactions History */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock size={20} className="text-sky-500 shrink-0" />
            <span>Recent Wallet Transactions</span>
          </h3>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            <button 
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${activeTab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              onClick={() => setActiveTab('all')}
            >
              All Activity
            </button>
            <button 
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${activeTab === 'credits' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              onClick={() => setActiveTab('credits')}
            >
              Credits (+)
            </button>
            <button 
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${activeTab === 'debits' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              onClick={() => setActiveTab('debits')}
            >
              Deductions (-)
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-sky-600 whitespace-nowrap">
                    {t.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {t.date}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {t.type === 'credit' ? (
                        <ArrowDownLeft size={16} className="text-emerald-500 shrink-0" />
                      ) : (
                        <ArrowUpRight size={16} className="text-rose-500 shrink-0" />
                      )}
                      <span>{t.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {t.category}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-bold text-right whitespace-nowrap ${t.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.type === 'credit' ? '+' : '-'}${t.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      <CheckCircle2 size={12} />
                      <span>{t.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PayrollWallet;
