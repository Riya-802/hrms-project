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
    <div className="payroll-wallet-container">
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">{isAdmin ? 'Enterprise Payroll Wallet' : 'My Payroll Wallet'}</h1>
          <p className="page-subtitle">Manage digital salary payouts, bonus allocations, and instant expense reimbursements</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={handleReimbursement} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} />
            <span>Claim Expense</span>
          </button>
          <button className="btn btn-primary" onClick={handleWithdraw} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpRight size={16} />
            <span>Bank Transfer</span>
          </button>
        </div>
      </div>

      {/* Wallet Balance Hero Card */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)', color: '#ffffff', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#93c5fd', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Wallet size={18} />
              <span>Available Digital Balance</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', marginTop: '0.4rem', letterSpacing: '-0.5px' }}>
              $12,866.00
            </div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} color="#34d399" />
              <span>Verified Account • Auto-linked to Corporate Payroll Pool</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1rem 1.25rem', borderRadius: '12px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div style={{ fontSize: '0.75rem', color: '#93c5fd', textTransform: 'uppercase', fontWeight: '600' }}>Next Salary Date</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', marginTop: '0.25rem' }}>Oct 01, 2026</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1rem 1.25rem', borderRadius: '12px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div style={{ fontSize: '0.75rem', color: '#93c5fd', textTransform: 'uppercase', fontWeight: '600' }}>Pending Claims</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', marginTop: '0.25rem' }}>$450.00</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <StatCard title="Total Disbursed" value="$125,000" icon={DollarSign} color="success" />
        <StatCard title="Total Bonuses" value="$14,500" icon={TrendingUp} color="primary" />
        <StatCard title="Tax Deductions" value="$12,400" icon={FileText} color="warning" />
        <StatCard title="Linked Accounts" value="1 Bank Account" icon={CreditCard} color="info" />
      </div>

      {/* Transactions History */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color="#0ea5e9" />
            <span>Recent Wallet Transactions</span>
          </h3>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('all')}
            >
              All Activity
            </button>
            <button 
              className={`btn btn-sm ${activeTab === 'credits' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('credits')}
            >
              Credits (+)
            </button>
            <button 
              className={`btn btn-sm ${activeTab === 'debits' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('debits')}
            >
              Deductions (-)
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Transaction ID</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Description</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Category</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: '600', color: '#0ea5e9', fontSize: '0.85rem' }}>
                    {t.id}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#475569', fontSize: '0.875rem' }}>
                    {t.date}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: '600', color: '#0f172a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {t.type === 'credit' ? (
                        <ArrowDownLeft size={16} color="#10b981" />
                      ) : (
                        <ArrowUpRight size={16} color="#ef4444" />
                      )}
                      <span>{t.description}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className="status-badge status-secondary" style={{ fontSize: '0.75rem' }}>
                      {t.category}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: '700', color: t.type === 'credit' ? '#10b981' : '#ef4444' }}>
                    {t.type === 'credit' ? '+' : '-'}${t.amount.toLocaleString()}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                    <span className="status-badge status-active" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
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
