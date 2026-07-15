import React from 'react';
import SessionClient from './SessionClient';

export default async function MentorshipSessionPage({ params }) {
  const { id: sessionId } = await params;
  return <SessionClient sessionId={sessionId} />;
}
