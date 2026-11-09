export type VisaType = 'D7' | 'D8' | 'Other';
export type TaskDraft = { title: string; detail: string; due_date: string | null; category: string };
const dateBefore = (iso: string, days: number) => {
  const d = new Date(iso + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
};
export function generateAppointmentTasks(visa: VisaType, appointment: string, married: boolean): TaskDraft[] {
  // Planning offsets only: not official deadlines; users must confirm with consulate/VFS.
  const tasks: TaskDraft[] = [
    { title: 'Confirm VFS appointment requirements', detail: 'Check the current VFS/consulate checklist for your jurisdiction. Suggested planning date, not a legal deadline.', due_date: dateBefore(appointment, 30), category: 'Application' },
    { title: 'Review passport and photo requirements', detail: 'Verify passport validity and current photo requirements.', due_date: dateBefore(appointment, 21), category: 'Documents' },
    { title: 'Prepare financial and accommodation evidence', detail: 'Confirm which evidence applies to your visa and consulate.', due_date: dateBefore(appointment, 21), category: 'Documents' },
    { title: 'Organize final application packet', detail: 'Review translations, certifications, apostilles and originals against official requirements.', due_date: dateBefore(appointment, 7), category: 'Application' },
    { title: 'Attend VFS appointment', detail: 'Bring your appointment confirmation and the currently required documents.', due_date: appointment, category: 'Appointment' },
  ];
  if (married) tasks.splice(2, 0, { title: 'Check marriage certificate requirements', detail: 'Where was the marriage registered? Confirm issuer, certified-copy rules, apostille/translation requirements, and processing times. The app must verify official links before providing forms.', due_date: dateBefore(appointment, 45), category: 'Civil records' });
  if (visa === 'D7') tasks.splice(2, 0, { title: 'Prepare D7 income evidence', detail: 'Check the current passive-income and financial-document requirements for your consulate.', due_date: dateBefore(appointment, 21), category: 'Financial' });
  if (visa === 'D8') tasks.splice(2, 0, { title: 'Prepare D8 remote-work evidence', detail: 'Review current digital-nomad income and employment documentation requirements.', due_date: dateBefore(appointment, 21), category: 'Financial' });
  return tasks;
}
