'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

export default function AnimatedCounter({
  end,
  suffix = '',
  duration = 2,
  label = '',
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let startTime;
    const startVal = 0;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(startVal + (end - startVal) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [inView, end, duration]);

  const format = (n) => {
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K+';
    return n + '+';
  };

  return (
    <div ref={ref} className="text-center">
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-black"
      >
        {format(count)}{suffix}
      </motion.span>
      {label && (
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">
          {label}
        </p>
      )}
    </div>
  );
}
