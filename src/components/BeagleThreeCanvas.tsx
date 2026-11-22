import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface BeagleThreeCanvasProps {
  scrollProgressRef: React.MutableRefObject<number>;
}

// Pre-allocated math helpers outside render loop (zero GC)
const _pointerTarget = new THREE.Vector2(0, 0);
const _pointerCurrent = new THREE.Vector2(0, 0);
const _dummy = new THREE.Object3D();

export default function BeagleThreeCanvas({
  scrollProgressRef,
}: BeagleThreeCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Detect software WebGL cleanly from GPU renderer string
    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas');
        const gl = probe.getContext('webgl2') || probe.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param) || '');
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xe9f3f7, 0.032);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 9.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    // Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envRT = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pmremGenerator.dispose();

    // Warm/cool 3-point lighting rig
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0xfce7ec, 1.1);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff5eb, 2.0);
    keyLight.position.set(6, 9, 7);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x93c5fd, 1.2);
    rimLight.position.set(-7, 3, -5);
    scene.add(rimLight);

    // ------------------------------------------------------------
    // 1. Beagle Channel Animated Wave Horizon
    // ------------------------------------------------------------
    const waveGeo = new THREE.PlaneGeometry(36, 18, 48, 28);
    waveGeo.rotateX(-Math.PI / 2);
    const wavePosAttr = waveGeo.attributes.position as THREE.BufferAttribute;
    const baseWaveY = new Float32Array(wavePosAttr.count);
    for (let i = 0; i < wavePosAttr.count; i++) {
      baseWaveY[i] = wavePosAttr.getY(i);
    }

    const waveMat = new THREE.MeshStandardMaterial({
      color: 0x7fb3c8,
      roughness: 0.3,
      metalness: 0.35,
      wireframe: false,
      transparent: true,
      opacity: 0.36,
    });
    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    waveMesh.position.set(0, -3.1, -2.5);
    scene.add(waveMesh);

    // Wireframe crest overlay for modern maritime depth
    const crestMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });
    const crestMesh = new THREE.Mesh(waveGeo, crestMat);
    crestMesh.position.set(0, -3.06, -2.5);
    scene.add(crestMesh);

    // ------------------------------------------------------------
    // 2. Composite 3D Procedural Centolla Emblem & Astrolabe Group
    //    (12 distinct parts across 3 silhouette scales)
    // ------------------------------------------------------------
    const centollaGroup = new THREE.Group();
    centollaGroup.position.set(3.25, 0.15, 0.5);

    const coralShellMat = new THREE.MeshPhysicalMaterial({
      color: 0xd1495b,
      roughness: 0.32,
      metalness: 0.18,
      clearcoat: 0.75,
      clearcoatRoughness: 0.25,
    });

    const carapaceTrimMat = new THREE.MeshStandardMaterial({
      color: 0xf4c2cc,
      roughness: 0.55,
      metalness: 0.08,
    });

    const brassRingMat = new THREE.MeshStandardMaterial({
      color: 0xd4a373,
      roughness: 0.22,
      metalness: 0.88,
    });

    // Primary silhouette: Beveled King Crab Carapace Shield (ExtrudeGeometry)
    const carapaceShape = new THREE.Shape();
    carapaceShape.moveTo(0, 0.72);
    carapaceShape.bezierCurveTo(0.62, 0.68, 0.88, 0.22, 0.76, -0.35);
    carapaceShape.bezierCurveTo(0.55, -0.78, -0.55, -0.78, -0.76, -0.35);
    carapaceShape.bezierCurveTo(-0.88, 0.22, -0.62, 0.68, 0, 0.72);

    const carapaceGeo = new THREE.ExtrudeGeometry(carapaceShape, {
      depth: 0.28,
      bevelEnabled: true,
      bevelThickness: 0.14,
      bevelSize: 0.12,
      bevelSegments: 4,
      curveSegments: 24,
    });
    carapaceGeo.center();
    const carapaceMesh = new THREE.Mesh(carapaceGeo, coralShellMat);
    carapaceMesh.rotation.x = -0.35;
    centollaGroup.add(carapaceMesh);

    // Secondary silhouette: Dorsal Ridge Crest (LatheGeometry)
    const ridgePts = [
      new THREE.Vector2(0.01, 0),
      new THREE.Vector2(0.42, 0.08),
      new THREE.Vector2(0.32, 0.22),
      new THREE.Vector2(0.12, 0.3),
      new THREE.Vector2(0.01, 0.32),
    ];
    const ridgeGeo = new THREE.LatheGeometry(ridgePts, 24);
    const ridgeMesh = new THREE.Mesh(ridgeGeo, carapaceTrimMat);
    ridgeMesh.position.set(0, 0.05, 0.14);
    ridgeMesh.rotation.x = Math.PI / 2 - 0.35;
    centollaGroup.add(ridgeMesh);

    // 6 Articulated Legs + 2 Front Pincers (TubeGeometry along CatmullRomCurve3)
    const legSpecs = [
      { side: 1, zOff: 0.3, angle: 0.45, reach: 1.55, drop: -0.45 },
      { side: 1, zOff: 0.0, angle: 0.08, reach: 1.7, drop: -0.52 },
      { side: 1, zOff: -0.3, angle: -0.35, reach: 1.5, drop: -0.48 },
      { side: -1, zOff: 0.3, angle: 0.45, reach: 1.55, drop: -0.45 },
      { side: -1, zOff: 0.0, angle: 0.08, reach: 1.7, drop: -0.52 },
      { side: -1, zOff: -0.3, angle: -0.35, reach: 1.5, drop: -0.48 },
    ];

    const createdGeos: THREE.BufferGeometry[] = [waveGeo, carapaceGeo, ridgeGeo];

    legSpecs.forEach((leg) => {
      const s = leg.side;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(s * 0.52, -0.05, leg.zOff),
        new THREE.Vector3(s * (leg.reach * 0.65), 0.32, leg.zOff + leg.angle * 0.45),
        new THREE.Vector3(s * leg.reach, 0.04, leg.zOff + leg.angle * 0.8),
        new THREE.Vector3(s * (leg.reach * 0.92), leg.drop, leg.zOff + leg.angle * 1.05),
      ]);
      const legGeo = new THREE.TubeGeometry(curve, 18, 0.068, 10, false);
      createdGeos.push(legGeo);
      const legMesh = new THREE.Mesh(legGeo, coralShellMat);
      centollaGroup.add(legMesh);
    });

    // Front Pincer Arms (2 beveled curved claws)
    [-1, 1].forEach((side) => {
      const armCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(side * 0.45, 0.15, 0.45),
        new THREE.Vector3(side * 0.88, 0.38, 0.85),
        new THREE.Vector3(side * 0.62, 0.28, 1.25),
      ]);
      const armGeo = new THREE.TubeGeometry(armCurve, 16, 0.085, 10, false);
      createdGeos.push(armGeo);
      const armMesh = new THREE.Mesh(armGeo, coralShellMat);
      centollaGroup.add(armMesh);

      const clawTipGeo = new THREE.ConeGeometry(0.11, 0.34, 12);
      createdGeos.push(clawTipGeo);
      const clawTip = new THREE.Mesh(clawTipGeo, carapaceTrimMat);
      clawTip.position.set(side * 0.56, 0.25, 1.34);
      clawTip.rotation.x = Math.PI / 2;
      clawTip.rotation.z = side * 0.45;
      centollaGroup.add(clawTip);
    });

    // Accent detail: Outer Maritime Astrolabe Compass Ring
    const ringGeo = new THREE.TorusGeometry(2.05, 0.03, 14, 72);
    createdGeos.push(ringGeo);
    const outerRing = new THREE.Mesh(ringGeo, brassRingMat);
    outerRing.rotation.x = 0.25;
    centollaGroup.add(outerRing);

    const innerRingGeo = new THREE.TorusGeometry(1.88, 0.014, 12, 64);
    createdGeos.push(innerRingGeo);
    const innerRing = new THREE.Mesh(innerRingGeo, brassRingMat);
    innerRing.rotation.y = 0.4;
    centollaGroup.add(innerRing);

    scene.add(centollaGroup);

    // ------------------------------------------------------------
    // 3. Instanced Bioluminescent Sea-Spray & Marine Bubbles
    // ------------------------------------------------------------
    const bubbleCount = isSoftwareGl ? 48 : 96;
    const bubbleGeo = new THREE.IcosahedronGeometry(0.055, 1);
    createdGeos.push(bubbleGeo);
    const bubbleMat = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      roughness: 0.18,
      metalness: 0.35,
      transparent: true,
      opacity: 0.68,
    });

    const bubbles = new THREE.InstancedMesh(bubbleGeo, bubbleMat, bubbleCount);
    bubbles.frustumCulled = false;

    const bubbleSeeds = new Float32Array(bubbleCount * 4);
    for (let i = 0; i < bubbleCount; i++) {
      bubbleSeeds[i * 4 + 0] = (Math.random() - 0.5) * 18; // x
      bubbleSeeds[i * 4 + 1] = (Math.random() - 0.5) * 9; // y
      bubbleSeeds[i * 4 + 2] = (Math.random() - 0.5) * 8 - 1.5; // z
      bubbleSeeds[i * 4 + 3] = 0.5 + Math.random() * 1.1; // scale + speed
    }
    scene.add(bubbles);

    // Pre-warm shaders once on real GPUs
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Responsive sizing
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(
        isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
      );

      // Keep 3D Centolla nicely framed on narrow viewports
      if (w < 768) {
        centollaGroup.position.set(0, -1.15, -0.8);
        centollaGroup.scale.setScalar(0.68);
      } else {
        centollaGroup.position.set(3.25, 0.15, 0.5);
        centollaGroup.scale.setScalar(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handlePointerMove = (e: PointerEvent) => {
      _pointerTarget.x = (e.clientX / window.innerWidth - 0.5) * 2;
      _pointerTarget.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Animation loop with software WebGL pacing
    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function tick() {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const scroll = scrollProgressRef.current;

      // Exponentially damped pointer parallax
      _pointerCurrent.x = THREE.MathUtils.damp(
        _pointerCurrent.x,
        _pointerTarget.x,
        4.5,
        delta
      );
      _pointerCurrent.y = THREE.MathUtils.damp(
        _pointerCurrent.y,
        _pointerTarget.y,
        4.5,
        delta
      );

      if (!prefersReducedMotion) {
        // Animate Beagle Channel wave vertices
        for (let i = 0; i < wavePosAttr.count; i++) {
          const vx = wavePosAttr.getX(i);
          const vz = wavePosAttr.getZ(i);
          const wave =
            Math.sin(vx * 0.42 + elapsed * 1.15) * 0.24 +
            Math.cos(vz * 0.55 + elapsed * 0.9) * 0.18;
          wavePosAttr.setY(i, baseWaveY[i] + wave);
        }
        wavePosAttr.needsUpdate = true;
        waveGeo.computeVertexNormals();

        // Float & rotate 3D Centolla Emblem based on time + scroll + mouse
        centollaGroup.rotation.y =
          elapsed * 0.35 + scroll * Math.PI * 1.4 + _pointerCurrent.x * 0.35;
        centollaGroup.rotation.x =
          Math.sin(elapsed * 0.7) * 0.08 + _pointerCurrent.y * 0.18;
        outerRing.rotation.z = elapsed * 0.22;
        innerRing.rotation.x = -elapsed * 0.28;

        // Update instanced marine particles
        for (let i = 0; i < bubbleCount; i++) {
          const bx = bubbleSeeds[i * 4 + 0];
          const by = bubbleSeeds[i * 4 + 1];
          const bz = bubbleSeeds[i * 4 + 2];
          const s = bubbleSeeds[i * 4 + 3];

          const floatY = ((by + elapsed * 0.28 * s + 4.5) % 9) - 4.5;
          const swayX = bx + Math.sin(elapsed * 0.7 + i) * 0.28;
          _dummy.position.set(swayX, floatY, bz);
          _dummy.scale.setScalar(s * 0.75);
          _dummy.rotation.set(elapsed * 0.4, elapsed * 0.3, 0);
          _dummy.updateMatrix();
          bubbles.setMatrixAt(i, _dummy.matrix);
        }
        bubbles.instanceMatrix.needsUpdate = true;
      }

      // Smooth camera parallax with scroll
      camera.position.x = THREE.MathUtils.damp(
        camera.position.x,
        _pointerCurrent.x * 0.45,
        3.5,
        delta
      );
      camera.position.y = THREE.MathUtils.damp(
        camera.position.y,
        1.4 - scroll * 0.8 + _pointerCurrent.y * 0.25,
        3.5,
        delta
      );
      camera.lookAt(0, -0.2, 0);

      renderer.render(scene, camera);

      if (prefersReducedMotion) return;
      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);

      createdGeos.forEach((g) => g.dispose());
      waveMat.dispose();
      crestMat.dispose();
      coralShellMat.dispose();
      carapaceTrimMat.dispose();
      brassRingMat.dispose();
      bubbleMat.dispose();
      envRT.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [scrollProgressRef]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 h-full w-full"
    />
  );
}
