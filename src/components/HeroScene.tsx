import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

type HeroSceneProps = {
  reducedMotion?: boolean;
  exploded?: boolean;
};

/** A real, locally rendered product sculpture. No remote textures or models. */
export default function HeroScene({ reducedMotion = false, exploded = false }: HeroSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const explodeRef = useRef(exploded);
  const requestRenderRef = useRef<(() => void) | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    explodeRef.current = exploded;
    requestRenderRef.current?.();
  }, [exploded]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      setUnavailable(true);
      return;
    }

    setUnavailable(false);
    const renderPixelRatio = () => Math.min(Math.max(window.devicePixelRatio || 1, 1) * 1.5, 2.5);
    renderer.setPixelRatio(renderPixelRatio());
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;outline:none;';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 60);
    camera.position.set(0, 0.3, 13.2);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xfff6e7, 1.7));
    const hemi = new THREE.HemisphereLight(0xffffff, 0x555a42, 2.5);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 5);
    key.position.set(-4, 7, 7);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -5;
    key.shadow.camera.right = 5;
    key.shadow.camera.top = 5;
    key.shadow.camera.bottom = -5;
    key.shadow.normalBias = 0.04;
    key.shadow.bias = -0.0001;
    key.shadow.radius = 5;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xff662e, 3.5);
    rim.position.set(4, 2, -2);
    scene.add(rim);
    const front = new THREE.DirectionalLight(0xffffff, 1.1);
    front.position.set(5, -1, 6);
    scene.add(front);

    // The three-dimensional composition is deliberately abstract: a food-system object.
    const sculpture = new THREE.Group();
    sculpture.position.set(0.15, 0.1, 0);
    scene.add(sculpture);

    const orange = new THREE.MeshPhysicalMaterial({ color: 0xff4b12, roughness: 0.24, metalness: 0.08, clearcoat: 0.8, clearcoatRoughness: 0.28 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x20241c, roughness: 0.5, metalness: 0.15 });
    const darkEdge = new THREE.MeshStandardMaterial({ color: 0x393c31, roughness: 0.48, metalness: 0.2 });
    const cream = new THREE.MeshStandardMaterial({ color: 0xf0eccf, roughness: 0.5 });

    const orbit = new THREE.Group();
    orbit.rotation.set(0.68, -0.32, -0.32);
    orbit.position.set(0.05, 0.1, -0.17);
    const torus = new THREE.Mesh(new THREE.TorusGeometry(2.25, 0.43, 32, 128), orange);
    torus.scale.set(1.14, 1, 1);
    torus.castShadow = true;
    orbit.add(torus);

    // A thin repeating seam gives the orange object a manufactured, tactile finish.
    const seam = new THREE.Mesh(new THREE.TorusGeometry(2.25, 0.014, 6, 128), new THREE.MeshBasicMaterial({ color: 0xffb48e, transparent: true, opacity: 0.65 }));
    seam.scale.set(1.14, 1, 1);
    seam.position.z = 0.435;
    orbit.add(seam);
    sculpture.add(orbit);

    const capsule = new THREE.Group();
    capsule.rotation.set(-0.11, -0.33, -0.24);
    capsule.position.set(0, 0.16, 0.3);
    sculpture.add(capsule);

    const tray = new THREE.Mesh(new RoundedBoxGeometry(2.62, 3.72, 0.58, 5, 0.22), dark);
    tray.castShadow = true;
    tray.receiveShadow = true;
    capsule.add(tray);
    const trayRim = new THREE.Mesh(new RoundedBoxGeometry(2.73, 3.83, 0.09, 5, 0.25), darkEdge);
    trayRim.position.z = 0.28;
    capsule.add(trayRim);

    // Restrained geometric contents are revealed when the user opens the capsule.
    const contents = new THREE.Group();
    contents.position.z = 0.34;
    capsule.add(contents);
    const insertMaterial = new THREE.MeshStandardMaterial({ color: 0x727b3c, roughness: 0.7 });
    const inserts = [
      { x: -0.6, y: 0.71, w: 1.08, h: 1.6, material: insertMaterial },
      { x: 0.57, y: 0.71, w: 1.04, h: 1.6, material: orange },
      { x: 0, y: -0.88, w: 2.24, h: 1.2, material: cream },
    ];
    for (const insert of inserts) {
      const mesh = new THREE.Mesh(new RoundedBoxGeometry(insert.w, insert.h, 0.13, 3, 0.12), insert.material);
      mesh.position.set(insert.x, insert.y, 0);
      contents.add(mesh);
    }

    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 768;
    labelCanvas.height = 1080;
    const ctx = labelCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#25291f';
      ctx.fillRect(0, 0, 768, 1080);
      ctx.strokeStyle = '#6c7258';
      ctx.lineWidth = 2;
      ctx.strokeRect(39, 40, 690, 1000);
      ctx.fillStyle = '#ecefd7';
      ctx.font = 'bold 28px Arial, sans-serif';
      ctx.fillText('FUTURE FUEL.', 74, 112);
      ctx.font = '18px Arial, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('EST. 2026', 690, 109);
      ctx.textAlign = 'left';
      ctx.fillStyle = '#fbf9e9';
      ctx.font = 'bold 236px Arial, sans-serif';
      ctx.fillText('F76', 57, 380);
      ctx.fillStyle = '#fe5d28';
      ctx.fillRect(75, 420, 612, 8);
      ctx.fillStyle = '#eef0d9';
      ctx.font = 'bold 46px Arial, sans-serif';
      ctx.fillText('GOOD FOOD.', 76, 511);
      ctx.fillText('ZERO FRICTION.', 76, 570);
      ctx.font = '22px Arial, sans-serif';
      ctx.fillStyle = '#bfc6aa';
      ctx.fillText('CHEF-MADE. LIFE-READY.', 76, 635);
      ctx.fillText('COLOMBO, SRI LANKA', 76, 670);
      ctx.strokeStyle = '#737959';
      ctx.beginPath();
      ctx.moveTo(76, 755);
      ctx.lineTo(690, 755);
      ctx.stroke();
      ctx.font = 'bold 58px Arial, sans-serif';
      ctx.fillStyle = '#f0efd5';
      ctx.fillText('02:00', 76, 846);
      ctx.font = '18px Arial, sans-serif';
      ctx.fillStyle = '#bfc6aa';
      ctx.fillText('MINUTES TO YOUR NEXT MOVE', 77, 882);
      ctx.font = '16px Arial, sans-serif';
      ctx.fillText('CONCEPT PACK / PRIVATE DEMO', 77, 988);
      // A custom barcode-like mark, purely decorative.
      for (let i = 0; i < 26; i += 1) {
        ctx.fillStyle = '#cdd3b8';
        ctx.fillRect(513 + i * 6.5, 930, i % 3 === 0 ? 4 : 2, 64);
      }
    }
    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    labelTexture.colorSpace = THREE.SRGBColorSpace;
    labelTexture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 16);
    const labelMaterial = new THREE.MeshStandardMaterial({ map: labelTexture, roughness: 0.58, metalness: 0.03 });
    const lid = new THREE.Group();
    lid.position.z = 0.39;
    const lidPlate = new THREE.Mesh(new RoundedBoxGeometry(2.68, 3.78, 0.09, 5, 0.22), dark);
    lidPlate.castShadow = true;
    lid.add(lidPlate);
    const label = new THREE.Mesh(new THREE.PlaneGeometry(2.46, 3.53), labelMaterial);
    label.position.z = 0.047;
    lid.add(label);
    capsule.add(lid);

    // Foil pull-tab catches light at the top of the dark capsule.
    const tab = new THREE.Mesh(new RoundedBoxGeometry(0.43, 0.31, 0.035, 3, 0.07), cream);
    tab.position.set(0.93, 1.82, 0.025);
    tab.rotation.z = -0.18;
    lid.add(tab);

    const satellites = new THREE.Group();
    sculpture.add(satellites);
    const satellitePositions = [
      [-2.65, 1.92, 0.8, 0.22],
      [2.65, -1.82, 0.65, 0.32],
      [1.55, 2.77, -0.8, 0.095],
      [-1.75, -2.28, 1.0, 0.1],
    ];
    for (const [x, y, z, radius] of satellitePositions) {
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 32), orange);
      sphere.position.set(x, y, z);
      sphere.castShadow = true;
      satellites.add(sphere);
    }
    const wireMaterial = new THREE.MeshBasicMaterial({ color: 0x79826a, transparent: true, opacity: 0.5 });
    const smallRing = new THREE.Mesh(new THREE.TorusGeometry(0.49, 0.008, 5, 64), wireMaterial);
    smallRing.position.set(2.57, 2.15, 0);
    smallRing.rotation.set(0.7, 0.4, 0.25);
    satellites.add(smallRing);
    const lowerRing = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.009, 5, 64), wireMaterial);
    lowerRing.position.set(-2.8, -1.2, 0.2);
    lowerRing.rotation.set(0.3, 0.55, -0.3);
    satellites.add(lowerRing);

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ color: 0x394122, opacity: 0.12 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -3.02;
    ground.receiveShadow = true;
    scene.add(ground);

    // A soft contact halo grounds the floating object without an opaque background.
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const shadowContext = shadowCanvas.getContext('2d');
    if (shadowContext) {
      const gradient = shadowContext.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(49, 56, 26, 0.21)');
      gradient.addColorStop(0.55, 'rgba(49, 56, 26, 0.07)');
      gradient.addColorStop(1, 'rgba(49, 56, 26, 0)');
      shadowContext.fillStyle = gradient;
      shadowContext.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const contactShadow = new THREE.Mesh(new THREE.PlaneGeometry(5.8, 1.25), new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false }));
    contactShadow.position.set(0.1, -2.98, -0.8);
    scene.add(contactShadow);

    const pointer = new THREE.Vector2();
    const easedPointer = new THREE.Vector2();
    let visible = true;
    let disposed = false;
    let frameId = 0;
    let lastTime = 0;
    let elapsed = 0;
    let scrollOffset = 0;
    let opening = explodeRef.current ? 1 : 0;

    const render = (timestamp: number) => {
      frameId = 0;
      if (disposed || !visible || document.hidden) return;
      const delta = lastTime ? Math.min((timestamp - lastTime) / 1000, 0.05) : 0;
      lastTime = timestamp;
      if (!reducedMotion) elapsed += delta;
      const target = explodeRef.current ? 1 : 0;
      opening = reducedMotion ? target : THREE.MathUtils.damp(opening, target, 5, delta || 0.016);
      easedPointer.lerp(pointer, reducedMotion ? 1 : 0.045);
      const t = elapsed;
      sculpture.rotation.y = reducedMotion ? 0 : Math.sin(t * 0.23) * 0.085 + easedPointer.x * 0.18;
      sculpture.rotation.x = reducedMotion ? 0 : easedPointer.y * 0.09;
      sculpture.rotation.z = reducedMotion ? 0 : scrollOffset * 0.05;
      sculpture.position.y = 0.1 + (reducedMotion ? 0 : Math.sin(t * 0.8) * 0.105);
      orbit.rotation.z = -0.32 + (reducedMotion ? 0 : Math.sin(t * 0.3) * 0.1) - opening * 0.15;
      orbit.scale.setScalar(1 + opening * 0.09);
      lid.position.set(opening * 1.4, opening * 0.9, 0.39 + opening * 0.65);
      lid.rotation.set(-opening * 0.32, opening * 0.38, opening * 0.14);
      satellites.rotation.z = reducedMotion ? 0 : Math.sin(t * 0.3) * 0.06;
      smallRing.rotation.y = 0.4 + (reducedMotion ? 0 : t * 0.22);
      lowerRing.rotation.x = 0.3 + (reducedMotion ? 0 : t * 0.18);
      renderer.render(scene, camera);
      if (!reducedMotion) frameId = requestAnimationFrame(render);
    };

    const requestRender = () => {
      if (!frameId && !disposed && visible && !document.hidden) frameId = requestAnimationFrame(render);
    };
    requestRenderRef.current = requestRender;

    const resize = () => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      const pixelRatio = renderPixelRatio();
      if (renderer.getPixelRatio() !== pixelRatio) renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      // Keep the entire orbital sculpture in frame on narrow mobile stages.
      camera.position.z = Math.max(12.7, 12.2 / camera.aspect);
      camera.updateProjectionMatrix();
      requestRender();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    const onPointerMove = (event: PointerEvent) => {
      if (reducedMotion) return;
      const bounds = host.getBoundingClientRect();
      pointer.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 2, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2);
    };
    const onPointerLeave = () => pointer.set(0, 0);
    const onScroll = () => {
      if (reducedMotion || !visible) return;
      const bounds = host.getBoundingClientRect();
      scrollOffset = THREE.MathUtils.clamp((window.innerHeight * 0.5 - bounds.top - bounds.height * 0.5) / window.innerHeight, -1, 1);
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frameId);
        frameId = 0;
        lastTime = 0;
      } else requestRender();
    };
    const onContextLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(frameId);
      frameId = 0;
      setUnavailable(true);
    };
    const onContextRestored = () => {
      setUnavailable(false);
      requestRender();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) requestRender();
      else {
        cancelAnimationFrame(frameId);
        frameId = 0;
        lastTime = 0;
      }
    }, { rootMargin: '100px' });
    observer.observe(host);
    host.addEventListener('pointermove', onPointerMove);
    host.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);
    resize();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      observer.disconnect();
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      requestRenderRef.current = null;
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          geometries.add(object.geometry);
          const meshMaterials = Array.isArray(object.material) ? object.material : [object.material];
          meshMaterials.forEach((material) => materials.add(material));
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      labelTexture.dispose();
      shadowTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reducedMotion]);

  return (
    <div className="hero-webgl-host" ref={hostRef} aria-hidden="true" style={{ position: 'relative', width: '100%', height: '100%', minHeight: 300, isolation: 'isolate' }}>
      {unavailable && (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: '77%', aspectRatio: '1', border: 'clamp(28px, 5vw, 64px) solid #ff541e', borderRadius: '50%', transform: 'rotate(-28deg) rotateX(35deg)', boxShadow: 'inset 8px 10px 12px #e8430b, 12px 18px 20px #343b2218' }} />
          <div style={{ width: '42%', aspectRatio: '0.7', borderRadius: 24, background: '#262b21', transform: 'rotate(-14deg)', color: '#f2f2da', padding: '7% 4%', boxShadow: '12px 18px 0 #161c14, 24px 35px 35px #2f351329', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, letterSpacing: 3 }}>FUTURE FUEL.</span>
            <strong style={{ fontSize: 'clamp(60px, 9vw, 122px)', lineHeight: 1, letterSpacing: '-.09em' }}>F76</strong>
            <div style={{ height: 5, background: '#ff5a24', margin: '12px 0' }} />
            <strong style={{ fontSize: 'clamp(11px, 1.8vw, 22px)', lineHeight: 1.3 }}>GOOD FOOD.<br />ZERO FRICTION.</strong>
            <span style={{ fontSize: 9, marginTop: 20 }}>COLOMBO, SRI LANKA</span>
          </div>
        </div>
      )}
    </div>
  );
}
