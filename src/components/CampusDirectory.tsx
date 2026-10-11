import React from 'react';
import { CAMPUS_OFFICES } from '../data/campusData';
import { Building, MapPin, Mail, Phone, Clock, ExternalLink } from 'lucide-react';

export const CampusDirectory: React.FC = () => {
  return (
    <section id="directory" className="py-16 lg:py-24 bg-slate-50/70 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold uppercase tracking-wider">
            <Building className="w-3.5 h-3.5 text-indigo-600" />
            <span>Escalation & Physical Counters</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Campus Office Directory
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Need in-person document verification, physical card printing, or warden approvals? Find your designated
            campus office locations and active working hours.
          </p>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAMPUS_OFFICES.map((office) => (
            <div
              key={office.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase bg-blue-50 px-2.5 py-1 rounded-md">
                    {office.department}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">{office.name}</h3>

                <div className="space-y-2.5 text-xs text-slate-600 my-4">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-800">{office.location}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{office.hours}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <a
                      href={`mailto:${office.email}`}
                      className="text-blue-600 hover:underline font-mono text-[11px]"
                    >
                      {office.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-mono text-[11px] text-slate-700">{office.phone}</span>
                  </div>
                </div>

                {/* Primary Topics */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Key In-Person Services:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {office.primaryTopics.map((topic, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Emergency Helpline Box */}
          <div className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-3xl p-6 border border-rose-200/80 shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-rose-700 tracking-wider uppercase bg-rose-100 px-2.5 py-1 rounded-md">
                24/7 Urgent Helplines
              </span>
              <h3 className="text-lg font-bold text-rose-950 mt-3 mb-2">Campus Emergency Desk</h3>
              <p className="text-xs text-rose-900/80 leading-relaxed mb-4">
                For urgent campus medical, security, fire, or residential emergency situations that cannot wait for
                general helpdesk queries.
              </p>

              <div className="space-y-2 text-xs font-semibold text-rose-950">
                <div className="p-2.5 bg-white/90 rounded-xl border border-rose-200 flex justify-between items-center">
                  <span>Campus Security Main Gate:</span>
                  <span className="font-mono text-rose-700 font-bold">+1 (555) 019-9911</span>
                </div>
                <div className="p-2.5 bg-white/90 rounded-xl border border-rose-200 flex justify-between items-center">
                  <span>University Health Center:</span>
                  <span className="font-mono text-rose-700 font-bold">+1 (555) 019-9922</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-rose-200/60 text-[11px] text-rose-800">
              Stationed 24/7/365 across East & West campus gates.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
