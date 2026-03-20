import { motion, useSpring } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Cursor() {
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const cursorX = useSpring(0, { stiffness: 500, damping: 40 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 40 });

  useEffect(() => {
    const move = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const over = (e) => {
      const el = e.target;
      if (el.tagName === 'A' || el.tagName === 'BUTTON' || el.closest('a') || el.closest('button')) {
        setHovering(true);
      }
    };
    const out = () => setHovering(false);

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    window.addEventListener('mouseout', out);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      window.removeEventListener('mouseout', out);
    };
  }, [visible, cursorX, cursorY]);

  if (!visible) return null;

  const size = hovering ? 32 : 8;

  return (
    <motion.div
      className={`custom-cursor${hovering ? ' hovering' : ''}`}
      style={{
        x: cursorX,
        y: cursorY,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    />
  );
}
