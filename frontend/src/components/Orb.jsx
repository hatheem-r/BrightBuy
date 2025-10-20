"use client";
import { useEffect, useRef } from "react";

export default function Orb({
  hoverIntensity = 0.5,
  rotateOnHover = true,
  hue = 0,
  forceHoverState = false,
}) {
  const canvasRef = useRef(null);
  const orbRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let renderer, gl, scene, camera, mesh;
    let mouseX = 0,
      mouseY = 0;
    let isHovering = forceHoverState;

    const init = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Dynamically import OGL
      const OGL = await import("ogl");
      const {
        Renderer,
        Camera,
        Transform,
        Sphere,
        Program,
        Mesh,
        Vec3,
        Color,
      } = OGL;

      // Setup renderer
      renderer = new Renderer({
        canvas,
        width: canvas.offsetWidth,
        height: canvas.offsetHeight,
        dpr: Math.min(window.devicePixelRatio, 2),
        alpha: true,
      });

      gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);

      // Setup camera
      camera = new Camera(gl, { fov: 45 });
      camera.position.set(0, 0, 5);

      // Setup scene
      scene = new Transform();

      // Create sphere geometry
      const geometry = new Sphere(gl, {
        radius: 1.5,
        widthSegments: 64,
        heightSegments: 64,
      });

      // Vertex shader
      const vertex = /* glsl */ `
        attribute vec3 position;
        attribute vec3 normal;
        
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform mat3 normalMatrix;
        uniform vec3 uLightPosition;
        uniform float uTime;
        uniform float uHoverIntensity;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vNoise;
        
        // Simplex noise functions
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          
          // Add noise displacement
          float noise = snoise(position * 0.5 + uTime * 0.2) * 0.3 * uHoverIntensity;
          vec3 displaced = position + normal * noise;
          
          vPosition = (modelViewMatrix * vec4(displaced, 1.0)).xyz;
          vNoise = noise;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        }
      `;

      // Fragment shader
      const fragment = /* glsl */ `
        precision highp float;
        
        uniform vec3 uColor;
        uniform vec3 uLightPosition;
        uniform float uTime;
        uniform float uHoverIntensity;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vNoise;
        
        void main() {
          vec3 normal = normalize(vNormal);
          vec3 lightDir = normalize(uLightPosition - vPosition);
          
          // Diffuse lighting
          float diff = max(dot(normal, lightDir), 0.0);
          
          // Specular lighting
          vec3 viewDir = normalize(-vPosition);
          vec3 reflectDir = reflect(-lightDir, normal);
          float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
          
          // Rim lighting
          float rim = 1.0 - max(dot(viewDir, normal), 0.0);
          rim = pow(rim, 3.0);
          
          // Combine lighting
          vec3 ambient = uColor * 0.3;
          vec3 diffuse = uColor * diff * 0.7;
          vec3 specular = vec3(1.0) * spec * 0.5 * uHoverIntensity;
          vec3 rimLight = uColor * rim * 0.5;
          
          vec3 finalColor = ambient + diffuse + specular + rimLight;
          
          // Add some glow based on noise
          finalColor += uColor * abs(vNoise) * 0.3 * uHoverIntensity;
          
          gl_FragColor = vec4(finalColor, 0.9);
        }
      `;

      // Create program
      const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new Color() },
          uLightPosition: { value: new Vec3(2, 2, 2) },
          uHoverIntensity: { value: isHovering ? hoverIntensity : 0.1 },
        },
        transparent: true,
      });

      // Create mesh
      mesh = new Mesh(gl, { geometry, program });
      mesh.setParent(scene);

      // Set initial color based on hue
      updateColor(hue);

      // Handle resize
      const handleResize = () => {
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        camera.perspective({
          aspect: canvas.offsetWidth / canvas.offsetHeight,
        });
      };

      window.addEventListener("resize", handleResize);

      // Animation loop
      const animate = (t) => {
        if (!mesh) return;

        const time = t * 0.001;
        program.uniforms.uTime.value = time;

        // Smooth hover intensity transition
        const targetIntensity = isHovering ? hoverIntensity : 0.1;
        program.uniforms.uHoverIntensity.value +=
          (targetIntensity - program.uniforms.uHoverIntensity.value) * 0.05;

        // Rotate based on mouse if rotateOnHover is enabled
        if (rotateOnHover) {
          mesh.rotation.y = mouseX * 0.3;
          mesh.rotation.x = mouseY * 0.3;
        } else {
          mesh.rotation.y += 0.003;
        }

        renderer.render({ scene, camera });
        requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);

      // Store refs for cleanup
      orbRef.current = { renderer, handleResize };
    };

    const updateColor = (hueValue) => {
      if (!orbRef.current) return;

      // Convert HSL to RGB
      const h = hueValue / 360;
      const s = 0.7;
      const l = 0.5;

      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      const r = hue2rgb(p, q, h + 1 / 3);
      const g = hue2rgb(p, q, h);
      const b = hue2rgb(p, q, h - 1 / 3);

      if (mesh && mesh.program) {
        mesh.program.uniforms.uColor.value.set(r, g, b);
      }
    };

    const handleMouseMove = (e) => {
      const rect = canvasRef.current.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleMouseEnter = () => {
      isHovering = true;
    };

    const handleMouseLeave = () => {
      isHovering = false;
      mouseX = 0;
      mouseY = 0;
    };

    // Add event listeners
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseenter", handleMouseEnter);
      canvas.addEventListener("mouseleave", handleMouseLeave);
    }

    init();

    // Cleanup
    return () => {
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseenter", handleMouseEnter);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }

      if (orbRef.current) {
        window.removeEventListener("resize", orbRef.current.handleResize);
      }
    };
  }, [hoverIntensity, rotateOnHover, hue, forceHoverState]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
      }}
    />
  );
}
