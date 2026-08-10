export const crtVertexShader = `
  attribute vec2 a_position;
  varying vec2 v_texcoord;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texcoord = a_position * 0.5 + 0.5;
  }
`;

export const crtFragmentShader = `
  precision highp float;
  varying vec2 v_texcoord;

  uniform float u_time;
  uniform int u_channel;
  uniform float u_powerTransition;
  uniform float u_volume;
  uniform int u_hasSignal;

  float rand(vec2 co){
      return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float snoise(float x) {
      return fract(sin(x * 12.9898) * 43758.5453);
  }

  vec3 getSignal(vec2 uv, float time, int channel) {
      vec3 color = vec3(0.0);
      
      if (channel == 0 || channel == 6 || channel == 10) {
          float n = rand(uv * time * 0.1);
          color = vec3(n * 0.8 + 0.1);
          float band = sin(uv.y * 10.0 + time * 5.0);
          if (band > 0.9) color += vec3(0.1);
      } else if (channel == 2 || channel == 8) {
          if (uv.y > 0.25) {
              if (uv.x < 1.0/7.0) color = vec3(0.7, 0.7, 0.7);
              else if (uv.x < 2.0/7.0) color = vec3(0.7, 0.7, 0.0);
              else if (uv.x < 3.0/7.0) color = vec3(0.0, 0.7, 0.7);
              else if (uv.x < 4.0/7.0) color = vec3(0.0, 0.7, 0.0);
              else if (uv.x < 5.0/7.0) color = vec3(0.7, 0.0, 0.7);
              else if (uv.x < 6.0/7.0) color = vec3(0.7, 0.0, 0.0);
              else color = vec3(0.0, 0.0, 0.7);
          } else if (uv.y > 0.1) {
              if (uv.x < 1.0/7.0) color = vec3(0.0, 0.0, 0.7);
              else if (uv.x < 2.0/7.0) color = vec3(0.0, 0.0, 0.0);
              else if (uv.x < 3.0/7.0) color = vec3(0.7, 0.0, 0.7);
              else if (uv.x < 4.0/7.0) color = vec3(0.0, 0.0, 0.0);
              else if (uv.x < 5.0/7.0) color = vec3(0.0, 0.7, 0.7);
              else if (uv.x < 6.0/7.0) color = vec3(0.0, 0.0, 0.0);
              else color = vec3(0.7, 0.7, 0.7);
          } else {
              if (uv.x < 0.16) color = vec3(0.0, 0.2, 0.4);
              else if (uv.x < 0.33) color = vec3(1.0, 1.0, 1.0);
              else if (uv.x < 0.5) color = vec3(0.0, 0.0, 0.3);
              else color = vec3(0.1);
          }
          color += (rand(uv * time) - 0.5) * 0.1;
      } else if (channel == 4 || channel == 11) {
          vec2 pos = vec2(0.5 + 0.3 * sin(time * 1.5), 0.5 + 0.2 * cos(time * 1.1));
          float d = length(uv - pos);
          if (d < 0.08) {
              color = vec3(1.0, 0.9, 0.2);
          } else if (d < 0.1) {
               color = vec3(0.8, 0.2, 0.2);
          } else {
              color = vec3(0.1, 0.15, 0.2);
          }
          color += (rand(uv * time) - 0.5) * 0.15;
      } else {
          float n = rand(uv * vec2(time * 0.01, 1.0));
          color = vec3(n * 0.3);
          color += sin(uv.y * 20.0 - time * 2.0) * 0.05;
      }
      return color;
  }

  void main() {
    vec2 uv = v_texcoord;
    uv.y = 1.0 - uv.y;

    if (u_powerTransition < 0.001) {
        gl_FragColor = vec4(0.01, 0.01, 0.01, 1.0);
        return;
    }

    vec2 centered = uv * 2.0 - 1.0;
    float r2 = dot(centered, centered);
    vec2 curved = centered * (1.0 + r2 * 0.12);
    vec2 crtUv = curved * 0.5 + 0.5;

    if (u_powerTransition < 1.0) {
        float t = u_powerTransition;
        float scaleY = smoothstep(0.0, 0.2, t);
        float scaleX = smoothstep(0.2, 1.0, t);

        crtUv -= 0.5;
        if (scaleY > 0.0) crtUv.y /= scaleY;
        if (scaleX > 0.0) crtUv.x /= scaleX;
        crtUv += 0.5;

        if (scaleY < 0.99 || scaleX < 0.99) {
            if (abs(crtUv.x - 0.5) > 0.5 || abs(crtUv.y - 0.5) > 0.5) {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                return;
            } else {
                float intensity = (1.0 - t) * 3.0;
                gl_FragColor = vec4(intensity, intensity, intensity, 1.0);
                return;
            }
        }
    }

    if (crtUv.x < 0.0 || crtUv.x > 1.0 || crtUv.y < 0.0 || crtUv.y > 1.0) {
        gl_FragColor = vec4(0.02, 0.02, 0.02, 1.0);
        return;
    }

    float jitter = snoise(u_time * 15.0) * 0.003;
    vec2 distUv = crtUv + vec2(jitter, 0.0);

    // True Chromatic Aberration
    float shift = 0.003 * length(centered);
    vec3 colorR = getSignal(distUv + vec2(shift, 0.0), u_time, u_channel);
    vec3 colorG = getSignal(distUv, u_time, u_channel);
    vec3 colorB = getSignal(distUv - vec2(shift, 0.0), u_time, u_channel);

    vec3 finalColor = vec3(colorR.r, colorG.g, colorB.b);

    // Volume brightness modulation
    finalColor *= (0.8 + u_volume * 0.4);
    
    // Scanlines
    float scanline = sin(crtUv.y * 800.0) * 0.08;
    finalColor -= scanline;
    
    // Vignette
    float vignette = length(centered);
    finalColor *= smoothstep(1.3, 0.6, vignette);
    
    // Screen glare from inside
    finalColor += vec3(0.05, 0.06, 0.07) * smoothstep(1.0, 0.0, vignette);

    float alpha = 0.15;
    float staticNoise = snoise(u_time * 20.0 + uv.y * 100.0) * 0.03;
    finalColor = vec3(0.0) - (scanline * 0.5) + (vec3(0.05, 0.06, 0.07) * smoothstep(1.0, 0.0, vignette)) + staticNoise;
    
    if (u_hasSignal == 0) {
        alpha = 1.0;
        float n = rand(uv * u_time * 0.1);
        finalColor = vec3(n * 0.8 + 0.1);
        float band = sin(uv.y * 10.0 + u_time * 5.0);
        if (band > 0.9) finalColor += vec3(0.1);
        finalColor *= smoothstep(1.3, 0.6, vignette);
    } else {
        if (mod(float(u_channel), 3.0) == 0.0) {
            finalColor += rand(uv * u_time) * 0.02;
        }
        finalColor *= alpha; // Premultiply alpha
    }

    gl_FragColor = vec4(finalColor, alpha);
  }
`;
