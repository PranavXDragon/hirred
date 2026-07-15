'use client';

import React, { useState, useEffect } from 'react';

export default function DelayedSkeleton({ children, delay = 200 }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;

  return <>{children}</>;
}
