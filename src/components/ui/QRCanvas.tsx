'use client';

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCanvasProps {
  value: string;
  size?: number;
}

export default function QRCanvas({ value, size = 180 }: QRCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current || !value) return;
    QRCode.toCanvas(ref.current, value, {
      width: size,
      margin: 1,
      color: { dark: '#1A1A2E', light: '#ffffff' },
    });
  }, [value, size]);

  return <canvas ref={ref} />;
}
