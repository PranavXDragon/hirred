import React from 'react';
import { MapPin, Mail, Phone, Globe, Linkedin, Github } from 'lucide-react';

export default function ResumePreviewDummy({ template, font, accent, customCss }) {
  const fontClass = font === 'serif' ? 'font-serif' : font === 'mono' ? 'font-mono' : 'font-sans';
  
  const resumeData = {
    fullName: 'Jayswita Dipak Gurde',
    jobTitle: 'Full Stack Engineer',
    profilePicture: 'https://i.pravatar.cc/300', // Dummy avatar
    location: 'Ramagao, Tq. Darwha',
    email: 'pranavnavgharelp@gmail.com',
    phone: '+91-9558459461',
    portfolio: 'https://portfolio.dev',
    linkedin: 'linkedin.com/in/job-seeker',
    github: 'github.com/job-seeker',
    summary: 'A passionate and self-motivated computer science student with a strong interest in software development, problem-solving, and continuous learning. Possessing strong communication, teamwork, and leadership abilities, committed to delivering quality work.',
    skillsString: 'CSS, C, HTML, C++, JAVASCRIPT',
    experiences: [
      {
        id: 1,
        title: 'Senior Software Engineer',
        company: 'Cloudflare',
        dates: '2024 - Present',
        description: 'Led development of low-latency edge caching APIs. Managed distributed cluster state configuration handling 1M+ req/sec.'
      }
    ],
    projects: [
      {
        id: 1,
        title: 'Neuron-Gate Router',
        tech: 'Rust, WebAssembly',
        link: 'github.com/engine',
        description: 'High-performance signaling router for peer-to-peer data mesh synchronization.'
      }
    ],
    educations: [
      {
        id: 1,
        degree: 'Bachelor of Technology in CS',
        school: 'Indian Institute of Technology',
        dates: '2018 - 2022',
        details: 'GPA: 9.4/10'
      }
    ]
  };

  return (
    <div className="w-full h-full bg-slate-200 p-4 overflow-y-auto flex justify-center items-start">
      <style dangerouslySetInnerHTML={{__html: customCss}} />
      
      {/* Scaled down container so it fits in the modal visually */}
      <div className="transform scale-[0.6] origin-top md:scale-[0.8] lg:scale-[1]">
        <div 
          id="cv-print-area"
          className={`w-[210mm] min-h-[297mm] bg-white border-[4px] border-black p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] ${fontClass} text-slate-800 transition-all duration-300 relative`}
        >
          {/* Template accent bar for corporate and mono */}
          {template === 'corporate' && (
            <div className="absolute top-0 left-0 right-0 h-4" style={{ backgroundColor: accent }} />
          )}

          {/* CV HEADER */}
          <div className={`border-b-4 border-black pb-6 mb-6 ${template === 'brutalist' ? 'bg-slate-50 -mx-12 -mt-12 p-12 border-t-0' : ''}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div className="flex items-center gap-4">
                {/* CV Photo in Preview */}
                {resumeData.profilePicture && (
                  <div className={`shrink-0 overflow-hidden border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                    ${template === 'minimalist' ? 'rounded-full w-32 h-32 shadow-none' : 'w-32 h-32'}`}>
                    <img src={resumeData.profilePicture} alt="CV Avatar" className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900 leading-none">
                    {resumeData.fullName}
                  </h2>
                  <p className="text-xs uppercase tracking-widest font-black mt-2" style={{ color: accent }}>
                    {resumeData.jobTitle}
                  </p>
                </div>
              </div>
              
              {/* Contact Nodes */}
              <div className="space-y-1 text-[10px] font-bold uppercase tracking-wide text-slate-600 text-left md:text-right">
                <div className="flex items-center md:justify-end gap-1.5">
                  <MapPin size={11} className="text-black" />
                  <span>{resumeData.location}</span>
                </div>
                {resumeData.email && (
                  <div className="flex items-center md:justify-end gap-1.5">
                    <Mail size={11} className="text-black" />
                    <span className="lowercase">{resumeData.email}</span>
                  </div>
                )}
                {resumeData.phone && (
                  <div className="flex items-center md:justify-end gap-1.5">
                    <Phone size={11} className="text-black" />
                    <span>{resumeData.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links Row */}
            <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t-2 border-dashed border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
              {resumeData.portfolio && (
                <div className="flex items-center gap-1">
                  <Globe size={11} /> <span>{resumeData.portfolio}</span>
                </div>
              )}
              {resumeData.linkedin && (
                <div className="flex items-center gap-1">
                  <Linkedin size={11} /> <span>{resumeData.linkedin}</span>
                </div>
              )}
              {resumeData.github && (
                <div className="flex items-center gap-1">
                  <Github size={11} /> <span>{resumeData.github}</span>
                </div>
              )}
            </div>
          </div>

          {/* CV BODY */}
          <div className="space-y-6">
            
            {/* Summary / Bio */}
            {resumeData.summary && (
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 mb-2.5 flex items-center gap-2">
                  <span className="w-2 h-2" style={{ backgroundColor: accent }} />
                  Professional Summary
                </h3>
                <p className="text-xs font-medium leading-relaxed text-slate-700 uppercase">
                  {resumeData.summary}
                </p>
              </div>
            )}

            {/* Skills Matrix */}
            {resumeData.skillsString && (
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 mb-2.5 flex items-center gap-2">
                  <span className="w-2 h-2" style={{ backgroundColor: accent }} />
                  Skills Matrix
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {resumeData.skillsString.split(',').map((skill, i) => {
                    const trimmed = skill.trim();
                    if (!trimmed) return null;
                    return (
                      <span 
                        key={i}
                        className={`text-[9px] font-black uppercase tracking-wider border-2 border-black px-2 py-0.5
                          ${template === 'brutalist' ? 'bg-sky-50' : template === 'monotech' ? 'bg-amber-50 font-mono' : 'bg-slate-50'}`}
                        style={template === 'brutalist' ? { backgroundColor: `${accent}15` } : {}}
                      >
                        {trimmed}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {resumeData.experiences.length > 0 && (
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 mb-3.5 flex items-center gap-2">
                  <span className="w-2 h-2" style={{ backgroundColor: accent }} />
                  Employment Experience
                </h3>
                <div className="space-y-4">
                  {resumeData.experiences.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{exp.title}</h4>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{exp.company}</p>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5">{exp.dates}</span>
                      </div>
                      <p className="text-[11px] font-medium leading-relaxed text-slate-600 uppercase pt-0.5">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Pipeline */}
            {resumeData.projects.length > 0 && (
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 mb-3.5 flex items-center gap-2">
                  <span className="w-2 h-2" style={{ backgroundColor: accent }} />
                  Project Deployments
                </h3>
                <div className="space-y-4">
                  {resumeData.projects.map((proj) => (
                    <div key={proj.id} className="space-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">
                            {proj.title} <span className="text-[9px] font-medium text-slate-400 normal-case ml-2">({proj.link})</span>
                          </h4>
                          <p className="text-[9px] font-bold uppercase tracking-wider mt-0.5" style={{ color: accent }}>{proj.tech}</p>
                        </div>
                      </div>
                      <p className="text-[11px] font-medium leading-relaxed text-slate-600 uppercase pt-0.5">
                        {proj.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Log */}
            {resumeData.educations.length > 0 && (
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 mb-3.5 flex items-center gap-2">
                  <span className="w-2 h-2" style={{ backgroundColor: accent }} />
                  Academic Records
                </h3>
                <div className="space-y-3">
                  {resumeData.educations.map((edu) => (
                    <div key={edu.id} className="space-y-0.5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{edu.degree}</h4>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{edu.school}</p>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5">{edu.dates}</span>
                      </div>
                      {edu.details && (
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-600">
                          {edu.details}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
          
        </div>
      </div>
    </div>
  );
}
