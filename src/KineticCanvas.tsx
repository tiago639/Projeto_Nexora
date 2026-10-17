import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

type Point = { x0: number; y0: number; x: number; y: number; phase: number; speed: number; accent: boolean };

/** Low density hero mesh; pauses when off-screen and becomes a still illustration for reduced motion. */
export function KineticCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !host || !ctx) return;

    const reduced = Boolean(reduceMotion) || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    let width = 0; let height = 0; let dpr = 1; let cols = 0; let rows = 0;
    let points: Point[] = []; let frame = 0; let visible = true; let lastPaint = 0; let time = 0;
    let mouseX = -1000; let mouseY = -1000; let targetX = -1000; let targetY = -1000;

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      width = Math.max(1, bounds.width); height = Math.max(1, bounds.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1.35);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.max(7, Math.min(width < 700 ? 12 : 22, Math.floor(width / (width < 700 ? 48 : 54))));
      rows = Math.max(5, Math.min(13, Math.floor(height / 50)));
      points = [];
      const dx = width / (cols + 1); const dy = height / (rows + 1);
      for (let col = 0; col <= cols; col++) for (let row = 0; row <= rows; row++) {
        const x0 = (col + 0.5) * dx; const y0 = (row + 0.5) * dy;
        points.push({ x0, y0, x: x0, y: y0, phase: Math.random() * Math.PI * 2, speed: 0.012 + Math.random() * 0.012, accent: (col + row) % 8 === 0 });
      }
      if (reduced) draw(0);
    };

    const draw = (elapsed: number) => {
      if (!width || !height) return;
      time += elapsed;
      mouseX += (targetX - mouseX) * 0.06; mouseY += (targetY - mouseY) * 0.06;
      ctx.clearRect(0, 0, width, height);
      const accentPath = new Path2D(); const basePath = new Path2D();
      points.forEach((p, index) => {
        p.phase += elapsed * p.speed * 60;
        const wave = reduced ? 0 : Math.sin(time + p.x0 * 0.005 + p.y0 * 0.003) * 9;
        const dx = mouseX - p.x0; const dy = mouseY - p.y0; const distance = Math.hypot(dx, dy);
        const force = !reduced && finePointer && distance > 0 && distance < 170 ? (1 - distance / 170) * 23 : 0;
        p.x = p.x0 - (distance ? dx / distance : 0) * force;
        p.y = p.y0 + wave - (distance ? dy / distance : 0) * force;
        const right = index + rows + 1; const below = index + 1;
        for (const next of [right < points.length && index % (rows + 1) <= rows ? right : -1, below < points.length && index % (rows + 1) < rows ? below : -1]) {
          if (next < 0) continue;
          const q = points[next];
          const near = finePointer && Math.hypot(mouseX - (p.x + q.x) / 2, mouseY - (p.y + q.y) / 2) < 155;
          const path = near && (p.accent || q.accent) ? accentPath : basePath;
          path.moveTo(p.x, p.y); path.lineTo(q.x, q.y);
        }
      });
      ctx.strokeStyle = 'rgba(235,240,225,.075)'; ctx.lineWidth = 0.7; ctx.stroke(basePath);
      ctx.strokeStyle = 'rgba(196,243,106,.38)'; ctx.lineWidth = 1; ctx.stroke(accentPath);
      points.forEach(p => {
        const near = finePointer && Math.hypot(mouseX - p.x, mouseY - p.y) < 130;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.accent ? (near ? 2.3 : 1.5) : (near ? 1.5 : 0.9), 0, Math.PI * 2);
        ctx.fillStyle = p.accent ? (near ? 'rgba(196,243,106,.9)' : 'rgba(196,243,106,.5)') : (near ? 'rgba(255,255,255,.6)' : 'rgba(255,255,255,.2)');
        ctx.fill();
      });
    };

    const loop = (now: number) => {
      if (!visible || document.hidden) return;
      if (now - lastPaint >= 33) { const elapsed = lastPaint ? Math.min((now - lastPaint) / 1000, 0.08) : 0.033; draw(elapsed); lastPaint = now; }
      frame = requestAnimationFrame(loop);
    };
    const start = () => { cancelAnimationFrame(frame); if (!reduced && visible && !document.hidden) frame = requestAnimationFrame(loop); };
    const onPointer = (event: PointerEvent) => { const rect = canvas.getBoundingClientRect(); targetX = event.clientX - rect.left; targetY = event.clientY - rect.top; };
    const onVisibility = () => { if (document.hidden) cancelAnimationFrame(frame); else start(); };
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); else cancelAnimationFrame(frame); }, { threshold: 0 }) : null;
    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(resize) : null;
    resizeObserver?.observe(host); observer?.observe(canvas); window.addEventListener('resize', resize); document.addEventListener('visibilitychange', onVisibility);
    if (finePointer) window.addEventListener('pointermove', onPointer, { passive: true });
    resize(); start();
    return () => { cancelAnimationFrame(frame); observer?.disconnect(); resizeObserver?.disconnect(); window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', onVisibility); window.removeEventListener('pointermove', onPointer); };
  }, [reduceMotion]);

  return <canvas ref={ref} className="kinetic-canvas" aria-hidden="true" />;
}
