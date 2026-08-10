import React, { useRef, useEffect } from 'react';
import { crtVertexShader, crtFragmentShader } from '../utils/shaders';

interface CRTScreenProps {
  channel: number;
  power: boolean;
  volume: number;
  hasSignal: boolean;
}

export const CRTScreen = ({ channel, power, volume, hasSignal }: CRTScreenProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reqIdRef = useRef<number>(0);
  const startTimeRef = useRef(Date.now());
  
  const stateRef = useRef({
    channel,
    power,
    volume,
    hasSignal,
    powerTrans: power ? 1 : 0
  });

  useEffect(() => {
    stateRef.current.channel = channel;
    stateRef.current.power = power;
    stateRef.current.volume = volume;
    stateRef.current.hasSignal = hasSignal;
  }, [channel, power, volume, hasSignal]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const gl = canvas.getContext('webgl', { alpha: true });
    if (!gl) return;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, crtVertexShader);
    const fs = compileShader(gl.FRAGMENT_SHADER, crtFragmentShader);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const channelLoc = gl.getUniformLocation(program, 'u_channel');
    const powerTransLoc = gl.getUniformLocation(program, 'u_powerTransition');
    const volumeLoc = gl.getUniformLocation(program, 'u_volume');
    const hasSignalLoc = gl.getUniformLocation(program, 'u_hasSignal');

    const render = () => {
      const s = stateRef.current;
      const targetPower = s.power ? 1 : 0;
      const diff = targetPower - s.powerTrans;
      
      if (Math.abs(diff) > 0.001) {
         s.powerTrans += diff * 0.08;
      } else {
         s.powerTrans = targetPower;
      }

      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.useProgram(program);

      const time = (Date.now() - startTimeRef.current) / 1000;
      gl.uniform1f(timeLoc, time);
      gl.uniform1i(channelLoc, s.channel);
      gl.uniform1f(powerTransLoc, s.powerTrans);
      gl.uniform1f(volumeLoc, s.volume);
      gl.uniform1i(hasSignalLoc, s.hasSignal ? 1 : 0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      reqIdRef.current = requestAnimationFrame(render);
    };

    reqIdRef.current = requestAnimationFrame(render);

    return () => cancelAnimationFrame(reqIdRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={1024}
      height={768}
      className="w-full h-full object-cover"
      style={{
         filter: 'contrast(1.1) brightness(1.05)',
      }}
    />
  );
};
