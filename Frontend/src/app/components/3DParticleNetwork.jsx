import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 70;
const CONNECTION_DISTANCE = 120;
const MOUSE_LERP = 0.05;
const DEPTH_Z_RANGE = 800;

export function ThreeDParticleNetwork() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener('resize', resize);

    const getPrimaryColor = () => {
      const style = getComputedStyle(document.documentElement);
      const primary = style.getPropertyValue('--primary').trim();
      if (primary && primary !== '') return primary;
      return '#00BAE2';
    };

    const primaryColor = getPrimaryColor();
    const lineColor = `rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.25)`;
    const glowColor = `rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.5)`;

    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: (Math.random() - 0.5) * DEPTH_Z_RANGE,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.2,
        radius: 0,
        alpha: 0,
      });
    }

    const project3Dto2D = (x, y, z) => {
      const fov = 500;
      const scale = fov / (fov + z + 400);
      const px = width / 2 + (x - width / 2) * scale;
      const py = height / 2 + (y - height / 2) * scale;
      return { x: px, y: py, scale };
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * MOUSE_LERP;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * MOUSE_LERP;

      const rotationX = (mouseRef.current.y - height / 2) * 0.0003;
      const rotationY = (mouseRef.current.x - width / 2) * 0.0003;

      const currentPrimary = getPrimaryColor();
      const currentLineColor = `rgba(${parseInt(currentPrimary.slice(1, 3), 16)}, ${parseInt(currentPrimary.slice(3, 5), 16)}, ${parseInt(currentPrimary.slice(5, 7), 16)}, 0.25)`;
      const currentGlowColor = `rgba(${parseInt(currentPrimary.slice(1, 3), 16)}, ${parseInt(currentPrimary.slice(3, 5), 16)}, ${parseInt(currentPrimary.slice(5, 7), 16)}, 0.5)`;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        if (p.z < -DEPTH_Z_RANGE / 2) p.z = DEPTH_Z_RANGE / 2;
        if (p.z > DEPTH_Z_RANGE / 2) p.z = -DEPTH_Z_RANGE / 2;

        const rotatedX = p.x + rotationY * 100;
        const rotatedY = p.y + rotationX * 100;

        const projected = project3Dto2D(rotatedX, rotatedY, p.z);
        
        const normalizedZ = (p.z + DEPTH_Z_RANGE / 2) / DEPTH_Z_RANGE;
        p.radius = 0.5 + normalizedZ * 1.5;
        p.alpha = 0.15 + normalizedZ * 0.55;
        
        p.projected = projected;
      });

      ctx.lineWidth = 1;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        ctx.beginPath();
        ctx.arc(p1.projected.x, p1.projected.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = currentPrimary;
        ctx.globalAlpha = p1.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dz = p1.z - p2.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < CONNECTION_DISTANCE) {
            const opacity = (1 - distance / CONNECTION_DISTANCE) * 0.4;
            const avgAlpha = (p1.alpha + p2.alpha) / 2;

            const p1Projected = p1.projected;
            const p2Projected = p2.projected;

            ctx.beginPath();
            ctx.moveTo(p1Projected.x, p1Projected.y);
            ctx.lineTo(p2Projected.x, p2Projected.y);
            
            ctx.shadowBlur = 12;
            ctx.shadowColor = currentGlowColor;
            ctx.strokeStyle = currentLineColor;
            ctx.globalAlpha = opacity * avgAlpha;
            ctx.stroke();
            
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}