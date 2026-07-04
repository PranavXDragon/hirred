import MentorshipClient from './MentorshipClient';
import { getMentors } from '../../lib/actions/mentors';

export const metadata = {
  title: '1:1 Mentorship | hirrd',
  description: 'Book 1:1 sessions with industry leaders.',
};

export const revalidate = 0; // Disable caching for live data

export default async function MentorshipPage() {
  const initialMentors = await getMentors();
  return <MentorshipClient initialMentors={initialMentors} />;
}
