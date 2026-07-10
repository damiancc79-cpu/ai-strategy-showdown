"use client";

import { useEffect, useRef } from "react";

const vertexSource = `#version 300 es
in vec2 aPosition;
out vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const fragmentSource = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 outColor;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uPointer;
uniform float uScroll;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

vec3 rotateY(vec3 p, float a) {
  float s = sin(a);
  float c = cos(a);
  return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
}

vec3 rotateX(vec3 p, float a) {
  float s = sin(a);
  float c = cos(a);
  return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
}

float segmentDistance(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

void main() {
  vec2 p = (gl_FragCoord.xy * 2.0 - uResolution.xy) / uResolution.y;
  float t = uTime * 0.0006;
  float scrollTilt = clamp(uScroll * 0.00016, -0.32, 0.32);
  vec3 color = vec3(0.003, 0.004, 0.012);

  float horizon = exp(-abs(p.y + 0.25) * 3.0) * 0.07;
  color += vec3(0.10, 0.04, 0.18) * horizon;
  color += vec3(0.01, 0.03, 0.07) * exp(-length(p - vec2(0.55, -0.05)) * 1.5);

  vec2 nodes[5];
  vec3 nodeColors[5];

  nodeColors[0] = vec3(0.55, 0.25, 1.0);
  nodeColors[1] = vec3(0.05, 0.55, 1.0);
  nodeColors[2] = vec3(0.22, 0.95, 0.66);
  nodeColors[3] = vec3(1.0, 0.18, 0.63);
  nodeColors[4] = vec3(1.0, 0.53, 0.08);

  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float angle = t * (0.45 + fi * 0.045) + fi * 1.2566;
    vec3 q = vec3(cos(angle) * (0.92 + fi * 0.08), sin(angle * 1.13) * (0.62 + fi * 0.035), sin(angle) * 0.75);
    q = rotateY(q, uPointer.x * 0.48 + scrollTilt);
    q = rotateX(q, uPointer.y * 0.35 - scrollTilt * 0.5);
    q.z += 2.35;
    nodes[i] = q.xy / q.z * 1.55;
  }

  for (int i = 0; i < 5; i++) {
    for (int j = i + 1; j < 5; j++) {
      float line = 1.0 - smoothstep(0.006, 0.026, segmentDistance(p, nodes[i], nodes[j]));
      float pulse = 0.42 + 0.58 * sin(t * 8.0 + float(i + j) * 1.9 + length(p) * 3.0);
      color += mix(nodeColors[i], nodeColors[j], 0.5) * line * pulse * 0.18;
    }
  }

  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float d = length(p - nodes[i]);
    float scale = 0.075 + 0.012 * sin(t * 3.0 + fi);
    float glow = exp(-d * d / (scale * scale * 1.6));
    float core = 1.0 - smoothstep(scale * 0.12, scale * 0.62, d);
    float ring = 1.0 - smoothstep(0.004, 0.015, abs(d - scale * 1.55));
    color += nodeColors[i] * glow * 0.46;
    color += nodeColors[i] * core * 1.2;
    color += nodeColors[i] * ring * (0.24 + 0.12 * sin(t * 4.0 + fi));
  }

  float centerDistance = length(p - vec2(0.0, 0.02));
  float centerGlow = exp(-centerDistance * centerDistance * 10.0);
  color += vec3(0.88, 0.22, 0.82) * centerGlow * 0.20;
  color += vec3(0.80, 0.65, 1.0) * (1.0 - smoothstep(0.006, 0.018, abs(centerDistance - 0.19))) * 0.22;

  float gridA = abs(sin((p.x + p.y * 0.65 + t * 0.7) * 12.0));
  float gridB = abs(sin((p.x * 0.55 - p.y + t * 0.28) * 18.0));
  color += vec3(0.08, 0.18, 0.34) * (1.0 - smoothstep(0.0, 0.035, min(gridA, gridB))) * 0.08;

  vec2 starCell = floor((p + vec2(t * 0.15, -t * 0.06)) * 34.0);
  float star = step(0.992, hash21(starCell));
  float starPulse = 0.35 + 0.65 * sin(t * 16.0 + hash21(starCell + 2.0) * 6.28);
  color += vec3(0.63, 0.78, 1.0) * star * starPulse * 0.78;

  float vignette = 1.0 - smoothstep(0.55, 1.55, length(p * vec2(0.88, 0.95)));
  color *= 0.70 + vignette * 0.75;
  color += (hash21(gl_FragCoord.xy + t) - 0.5) * 0.012;
  color = pow(max(color, 0.0), vec3(0.85));

  outColor = vec4(color, 1.0);
}`;

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function StrategyOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });

    if (!gl) {
      canvas.dataset.fallback = "true";
      return;
    }

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertexShader || !fragmentShader) {
      canvas.dataset.fallback = "true";
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      canvas.dataset.fallback = "true";
      return;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const position = gl.getAttribLocation(program, "aPosition");
    const timeLocation = gl.getUniformLocation(program, "uTime");
    const resolutionLocation = gl.getUniformLocation(program, "uResolution");
    const pointerLocation = gl.getUniformLocation(program, "uPointer");
    const scrollLocation = gl.getUniformLocation(program, "uScroll");
    const pointer = { x: 0, y: 0 };
    let scroll = 0;
    let animationFrame = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * ratio));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2.0;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * -2.0;
    };

    const onScroll = () => {
      scroll = window.scrollY;
    };

    const draw = (now: number) => {
      resize();
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1f(timeLocation, now);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(pointerLocation, pointer.x, pointer.y);
      gl.uniform1f(scrollLocation, scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const loop = (now: number) => {
      draw(now);
      if (!reduceMotion) animationFrame = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    animationFrame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div className="orb-stage" aria-hidden="true">
      <canvas ref={canvasRef} className="orb-canvas" />
      <div className="orb-fallback">
        <span className="fallback-ring fallback-ring-a" />
        <span className="fallback-ring fallback-ring-b" />
        <span className="fallback-core" />
      </div>
    </div>
  );
}
