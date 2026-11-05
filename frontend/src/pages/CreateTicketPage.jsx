import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ticketApi } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const CreateTicketPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('SOFTWARE');
  const [priority, setPriority] = useState('MEDIUM');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const getSlaHours = () => {
    switch (priority) {
      case 'CRITICAL': return 4;
      case 'HIGH': return 8;
      case 'MEDIUM': return 24;
      case 'LOW': return 48;
      default: return 24;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.length > 150) {
      showToast('Title cannot exceed 150 characters', 'error');
      return;
    }

    if (description.length > 2000) {
      showToast('Description cannot exceed 2000 characters', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const res = await ticketApi.create({
        title,
        description,
        category,
        priority,
      });

      if (res.data?.success) {
        showToast('Ticket created successfully!', 'success');
        navigate('/my-tickets?created=true');
      }
    } catch (err) {
      showToast(err.response?.data?.error || err.message || 'Ticket creation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7fb]">
      <Navbar />

      <main className="w-[92%] max-w-[800px] mx-auto py-10 flex-1">
        <div className="mb-6">
          <Link to="/dashboard" className="text-xs text-[#1769aa] font-semibold hover:underline">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-[#12355b] mt-2">
            Create Support Ticket
          </h1>
          <p className="text-sm text-[#718193]">
            Submit a new technical incident. IT support agents will be assigned based on category and priority SLA.
          </p>
        </div>

        <div className="bg-white border border-[#dce5ef] rounded-xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase text-[#263c53] mb-2" htmlFor="title">
                Ticket Title (max 150 characters)
              </label>
              <input
                id="title"
                type="text"
                required
                maxLength={150}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief summary of the issue (e.g. Cannot connect to staging VPN)"
                className="w-full px-3.5 py-2.5 border border-[#b8c4d1] rounded-md text-sm text-[#1f2937] focus:outline-none focus:border-[#1769aa] focus:ring-2 focus:ring-[#1769aa]/15"
              />
              <span className="text-[11px] text-[#64748b] mt-1 block">
                {title.length}/150 characters
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase text-[#263c53] mb-2" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#b8c4d1] rounded-md text-sm text-[#1f2937] bg-white focus:outline-none focus:border-[#1769aa] focus:ring-2 focus:ring-[#1769aa]/15"
                >
                  <option value="HARDWARE">HARDWARE (Laptop, Monitor, Peripherals)</option>
                  <option value="SOFTWARE">SOFTWARE (OS, Applications, Dev Tools)</option>
                  <option value="NETWORK">NETWORK (VPN, WiFi, Firewall)</option>
                  <option value="ACCOUNT_ACCESS">ACCOUNT ACCESS (SSO, Credentials)</option>
                  <option value="OTHER">OTHER (General Request)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#263c53] mb-2" htmlFor="priority">
                  Priority
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#b8c4d1] rounded-md text-sm text-[#1f2937] bg-white focus:outline-none focus:border-[#1769aa] focus:ring-2 focus:ring-[#1769aa]/15"
                >
                  <option value="CRITICAL">CRITICAL (System completely down)</option>
                  <option value="HIGH">HIGH (Major feature blocked)</option>
                  <option value="MEDIUM">MEDIUM (Normal business impact)</option>
                  <option value="LOW">LOW (Minor cosmetic issue)</option>
                </select>
              </div>
            </div>

            {/* SLA Indicator Banner */}
            <div className="p-4 rounded-lg bg-[#f0f7ff] border border-[#d0e4f7] flex items-center justify-between text-xs">
              <span className="text-[#1769aa] font-semibold">
                Priority SLA Deadline Target:
              </span>
              <strong className="text-[#12355b] font-bold text-sm">
                Within {getSlaHours()} hours from creation
              </strong>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#263c53] mb-2" htmlFor="description">
                Detailed Description (max 2000 characters)
              </label>
              <textarea
                id="description"
                required
                rows={6}
                maxLength={2000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed steps to reproduce, error codes, and impacted environment..."
                className="w-full px-3.5 py-2.5 border border-[#b8c4d1] rounded-md text-sm text-[#1f2937] focus:outline-none focus:border-[#1769aa] focus:ring-2 focus:ring-[#1769aa]/15"
              />
              <span className="text-[11px] text-[#64748b] mt-1 block">
                {description.length}/2000 characters
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e0e7ef]">
              <Link
                to="/dashboard"
                className="px-5 py-2.5 text-xs font-semibold text-[#526477] hover:text-[#1769aa]"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-[#1769aa] text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-[#0d4f87] transition-colors disabled:opacity-50"
              >
                {submitting ? 'Creating Ticket...' : 'Submit Ticket'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer portalName="Ticket Creation" />
    </div>
  );
};
