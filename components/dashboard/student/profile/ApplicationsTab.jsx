import React from 'react';
import { X } from 'lucide-react';

const ApplicationsTab = ({ applications, handleWithdraw }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-2">Active Applications</h3>
      {applications.length === 0 ? (
        <div className="border-2 border-dashed border-slate-300 p-8 text-center bg-slate-50">
          <p className="text-xs font-black uppercase text-slate-400 tracking-wider">No active job transmissions found in registry.</p>
        </div>
      ) : (
        <div className="border-2 border-black overflow-hidden bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="bg-black text-white text-[10px] uppercase font-black tracking-widest">
                <tr>
                  <th className="p-3 border-r border-slate-700">Role</th>
                  <th className="p-3 border-r border-slate-700">Company</th>
                  <th className="p-3 border-r border-slate-700">Date Applied</th>
                  <th className="p-3 border-r border-slate-700">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black font-bold text-xs uppercase text-slate-700">
                {applications.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50 divide-x-2 divide-black">
                    <td className="p-3 font-black text-black">{app.jobTitle}</td>
                    <td className="p-3">{app.companyName}</td>
                    <td className="p-3">{app.dateApplied}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-[10px] border-2 border-black ${
                        app.status === 'Shortlisted' ? 'bg-green-400 text-black' : 
                        app.status === 'Rejected' ? 'bg-red-400 text-black' : 
                        'bg-yellow-400 text-black'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button 
                        onClick={() => handleWithdraw(app.id)}
                        className="p-1.5 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors"
                        title="Withdraw Application"
                      >
                        <X size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsTab;
