import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { playClick, playHover } from '../../audio/soundEffects';

interface ActiveNodeData {
  id: string;
  name: string;
  zone: string;
  gpu: string;
  status: 'IN_SESSION' | 'AVAILABLE' | 'BILLING' | 'OFFLINE';
  rate: string;
  user: string;
}

type StatusVisual = {
  color: number;
  glow: boolean;
  glowOpacity: number;
};

const STATUS_VISUALS: Record<ActiveNodeData['status'], StatusVisual> = {
  IN_SESSION: { color: 0xccff00, glow: true, glowOpacity: 0.55 }, // active session -> lime
  AVAILABLE: { color: 0x00f0ff, glow: true, glowOpacity: 0.42 }, // idle / available -> cyan
  BILLING: { color: 0xff9900, glow: true, glowOpacity: 0.5 }, // ending soon (<5 min) -> amber
  OFFLINE: { color: 0x4a4e55, glow: false, glowOpacity: 0.0 }, // offline -> unlit gray
};

function buildDashboardTexture(total: number, active: number, idle: number, endingSoon: number, offline: number) {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#0a0a0c';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(204, 255, 0, 0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

  ctx.font = '600 20px "JetBrains Mono", monospace';
  ctx.fillStyle = 'rgba(220, 224, 210, 0.55)';
  ctx.fillText('ARENA · LIVE STATUS', 36, 64);

  ctx.font = '700 42px "JetBrains Mono", monospace';
  ctx.fillStyle = '#eef2e6';
  ctx.fillText(`${total} rigs · ${active} active · ${idle} idle`, 36, 148);

  const extraParts: string[] = [];
  if (endingSoon > 0) extraParts.push(`${endingSoon} ending soon`);
  if (offline > 0) extraParts.push(`${offline} offline`);

  if (extraParts.length > 0) {
    ctx.font = '500 26px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255, 153, 0, 0.85)';
    ctx.fillText(extraParts.join(' · '), 36, 200);
  }

  ctx.font = '400 16px "JetBrains Mono", monospace';
  ctx.fillStyle = 'rgba(0, 240, 255, 0.55)';
  ctx.fillText('UPDATED IN REAL TIME', 36, canvas.height - 32);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export const Hero3DScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<ActiveNodeData | null>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);

  const stationsInfo: ActiveNodeData[] = [
    { id: 'RIG_01', name: 'TITAN-01', zone: 'VIP ARENA', gpu: 'RTX 4090 24GB', status: 'IN_SESSION', rate: '₹180/hr', user: 'phantom_99' },
    { id: 'RIG_02', name: 'TITAN-02', zone: 'VIP ARENA', gpu: 'RTX 4090 24GB', status: 'IN_SESSION', rate: '₹180/hr', user: 'vortex_fps' },
    { id: 'RIG_03', name: 'TITAN-03', zone: 'VIP ARENA', gpu: 'RTX 4090 24GB', status: 'AVAILABLE', rate: '₹180/hr', user: 'READY' },
    { id: 'RIG_04', name: 'STAGE-01', zone: 'TOURNAMENT POD', gpu: 'RTX 4080 Super', status: 'IN_SESSION', rate: '₹150/hr', user: 'blitz_k' },
    { id: 'RIG_05', name: 'STAGE-02', zone: 'TOURNAMENT POD', gpu: 'RTX 4080 Super', status: 'BILLING', rate: '₹150/hr', user: 'kryptic' },
    { id: 'RIG_06', name: 'STAGE-03', zone: 'TOURNAMENT POD', gpu: 'RTX 4080 Super', status: 'IN_SESSION', rate: '₹150/hr', user: 'zenith_pro' },
    { id: 'RIG_07', name: 'GRID-01', zone: 'MAIN BATTLEFLOOR', gpu: 'RTX 4070 Ti', status: 'IN_SESSION', rate: '₹110/hr', user: 'shadow_in' },
    { id: 'RIG_08', name: 'GRID-02', zone: 'MAIN BATTLEFLOOR', gpu: 'RTX 4070 Ti', status: 'OFFLINE', rate: '₹110/hr', user: '—' },
    { id: 'RIG_09', name: 'GRID-03', zone: 'MAIN BATTLEFLOOR', gpu: 'RTX 4070 Ti', status: 'IN_SESSION', rate: '₹110/hr', user: 'cypher_x' },
    { id: 'RIG_10', name: 'SIM-01', zone: 'RACING RIGS', gpu: 'FANATEC DD2 + RTX 4080', status: 'IN_SESSION', rate: '₹250/hr', user: 'apex_driver' },
    { id: 'RIG_11', name: 'SIM-02', zone: 'RACING RIGS', gpu: 'FANATEC DD2 + RTX 4080', status: 'AVAILABLE', rate: '₹250/hr', user: 'READY' },
    { id: 'RIG_12', name: 'CONSOLE-01', zone: 'PS5 LOUNGE', gpu: 'PS5 PRO 4K OLED', status: 'IN_SESSION', rate: '₹140/hr', user: 'ea_fc_squad' },
  ];

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08080a, 0.045);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    const startCamPos = new THREE.Vector3(0, 4.6, 14);
    const settleCamPos = new THREE.Vector3(0, 3.6, 9.5);
    const lookAtTarget = new THREE.Vector3(0, 1.3, -0.5);
    camera.position.copy(reducedMotion ? settleCamPos : startCamPos);
    camera.lookAt(lookAtTarget);

    // Opaque canvas on purpose: an alpha-blended WebGL canvas compositing every
    // frame with the CSS backdrop-blur layers around/over it (this container,
    // and the node-inspector card that mounts on hover/click) is a known GPU
    // process crash combo on several drivers. A solid clear color avoids it.
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setClearColor(0x08080a, 1);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group to hold all arena objects
    const arenaGroup = new THREE.Group();
    scene.add(arenaGroup);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(30, 30, 0x3a3f2e, 0x1a1b22);
    gridHelper.position.y = -0.49;
    arenaGroup.add(gridHelper);

    // Low-opacity dark floor plane. Real-time mirror reflections (three's Reflector)
    // rely on a multisampled half-float render target that crashes the GPU process on
    // some drivers, so soft reflections are faked cheaply below with glow-pool decals
    // placed directly under each light source instead.
    const floorMat = new THREE.MeshBasicMaterial({
      color: 0x08080a,
      transparent: true,
      opacity: 0.85,
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.5;
    arenaGroup.add(floor);

    const floorGlowGeo = new THREE.CircleGeometry(0.55, 24);
    const floorGlowY = -0.495;
    const addFloorGlow = (x: number, z: number, color: number, opacity: number) => {
      const glowMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const glow = new THREE.Mesh(floorGlowGeo, glowMat);
      glow.rotation.x = -Math.PI / 2;
      glow.position.set(x, floorGlowY, z);
      arenaGroup.add(glow);
      return glowMat;
    };

    // ---- Central floating dashboard panel (replaces the old "crystal") ----
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 2.0, -3.6);
    coreGroup.rotation.x = THREE.MathUtils.degToRad(-8);
    arenaGroup.add(coreGroup);

    const panelGeo = new THREE.BoxGeometry(3.6, 2.0, 0.14);
    const panelMat = new THREE.MeshPhysicalMaterial({
      color: 0x101116,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.85,
    });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    coreGroup.add(panel);

    // Wireframe cage around the panel (keeps the original "crystal" visual language)
    const panelWireGeo = new THREE.WireframeGeometry(panelGeo);
    const panelWireMat = new THREE.LineBasicMaterial({ color: 0xccff00 });
    const panelWireframe = new THREE.LineSegments(panelWireGeo, panelWireMat);
    coreGroup.add(panelWireframe);

    // Live aggregate stats rendered onto the panel as a glowing screen
    const activeCount = stationsInfo.filter((s) => s.status === 'IN_SESSION').length;
    const idleCount = stationsInfo.filter((s) => s.status === 'AVAILABLE').length;
    const endingSoonCount = stationsInfo.filter((s) => s.status === 'BILLING').length;
    const offlineCount = stationsInfo.filter((s) => s.status === 'OFFLINE').length;

    const dashboardTexture = buildDashboardTexture(
      stationsInfo.length,
      activeCount,
      idleCount,
      endingSoonCount,
      offlineCount
    );
    const screenGeo = new THREE.PlaneGeometry(3.3, 1.75);
    const screenMat = new THREE.MeshBasicMaterial({
      map: dashboardTexture ?? undefined,
      color: dashboardTexture ? 0xffffff : 0xccff00,
      transparent: true,
      opacity: 0.92,
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.z = 0.08;
    coreGroup.add(screen);

    // Halo orbit rings around the dashboard panel
    const ringGeo = new THREE.TorusGeometry(2.0, 0.025, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.55 });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2.3;
    coreGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.x = Math.PI / 1.8;
    ring2.rotation.y = Math.PI / 5;
    coreGroup.add(ring2);

    // Floor glow pool beneath the dashboard panel
    const dashboardPoolMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.14,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dashboardPool = new THREE.Mesh(new THREE.CircleGeometry(1.6, 32), dashboardPoolMat);
    dashboardPool.rotation.x = -Math.PI / 2;
    dashboardPool.position.set(0, floorGlowY, coreGroup.position.z + 0.6);
    arenaGroup.add(dashboardPool);

    // ---- Rig floor plan: straight rows receding into depth, aisle down the middle ----
    const interactiveMeshes: THREE.Mesh[] = [];
    const pulsingGlows: { material: THREE.MeshBasicMaterial; baseOpacity: number; phase: number }[] = [];

    const deskGeo = new THREE.BoxGeometry(1.3, 0.07, 0.65);
    const monitorGeo = new THREE.BoxGeometry(0.85, 0.5, 0.04);
    const screenPanelGeo = new THREE.PlaneGeometry(0.64, 0.34);
    const uiLineGeo = new THREE.PlaneGeometry(0.5, 0.02);
    const towerGeo = new THREE.BoxGeometry(0.22, 0.85, 0.45);
    const edgeStripGeo = new THREE.BoxGeometry(0.02, 0.85, 0.02);

    const darkBodyMat = new THREE.MeshStandardMaterial({ color: 0x14161f, roughness: 0.4, metalness: 0.6 });
    const bezelMat = new THREE.MeshStandardMaterial({ color: 0x0c0d10, roughness: 0.35, metalness: 0.5 });

    const cols = [-4, -1.4, 1.4, 4];
    const rows = [6.5, 2.5, -1.5];

    stationsInfo.forEach((info, index) => {
      const row = Math.floor(index / cols.length);
      const col = index % cols.length;
      const x = cols[col];
      const z = rows[row];

      const visual = STATUS_VISUALS[info.status];
      const rig = new THREE.Group();
      rig.position.set(x, 0, z);
      // All rigs face the camera down the aisle, like real rows of café PCs
      arenaGroup.add(rig);

      // a) desk
      const desk = new THREE.Mesh(deskGeo, darkBodyMat);
      desk.position.set(0, 0.5, 0);
      desk.userData = info;
      interactiveMeshes.push(desk);
      rig.add(desk);

      // b) monitor tilted back ~10deg, emissive UI-panel front face
      const monitor = new THREE.Mesh(monitorGeo, bezelMat);
      monitor.position.set(0, 0.85, -0.3);
      monitor.rotation.x = THREE.MathUtils.degToRad(-10);
      monitor.userData = info;
      interactiveMeshes.push(monitor);
      rig.add(monitor);

      const screenGlowOpacity = visual.glow ? visual.glowOpacity : 0.06;
      const screenMatRig = new THREE.MeshBasicMaterial({
        color: visual.color,
        transparent: true,
        opacity: screenGlowOpacity,
      });
      const screenPanel = new THREE.Mesh(screenPanelGeo, screenMatRig);
      screenPanel.position.z = 0.022;
      monitor.add(screenPanel);

      if (visual.glow) {
        pulsingGlows.push({ material: screenMatRig, baseOpacity: visual.glowOpacity, phase: index });

        const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22 });
        const line1 = new THREE.Mesh(uiLineGeo, lineMat);
        line1.position.set(0, 0.08, 0.001);
        screenPanel.add(line1);
        const line2 = new THREE.Mesh(uiLineGeo, lineMat.clone());
        line2.position.set(0, -0.06, 0.001);
        screenPanel.add(line2);
      }

      // c) vertical tower beside the desk, ONE thin emissive RGB underglow edge
      const tower = new THREE.Mesh(towerGeo, darkBodyMat);
      tower.position.set(0.65, 0.425, -0.05);
      rig.add(tower);

      const edgeOpacity = visual.glow ? 0.85 : 0.12;
      const edgeMat = new THREE.MeshBasicMaterial({ color: visual.color, transparent: true, opacity: edgeOpacity });
      const edgeStrip = new THREE.Mesh(edgeStripGeo, edgeMat);
      edgeStrip.position.set(0.76, 0.425, 0.17);
      rig.add(edgeStrip);

      if (visual.glow) {
        pulsingGlows.push({ material: edgeMat, baseOpacity: edgeOpacity, phase: index + 0.5 });

        // Soft floor glow "reflection" pool beneath this rig's light sources
        const poolOpacity = 0.16;
        const pool = addFloorGlow(x + 0.2, z - 0.1, visual.color, poolOpacity);
        pulsingGlows.push({ material: pool, baseOpacity: poolOpacity, phase: index + 0.25 });
      }
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xccff00, 1.2, 20);
    pointLight.position.set(0, 4, -2);
    scene.add(pointLight);

    // Mouse Parallax & Raycasting
    let parallaxX = 0;
    let parallaxY = 0;
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2(-10, -10);

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / height) * 2 - 1);

      mouseVector.x = x;
      mouseVector.y = y;

      if (!reducedMotion) {
        parallaxX = x * 0.8;
        parallaxY = y * 0.4;
      }
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Raycast on hover
    let lastHoveredId: string | null = null;
    const checkIntersection = () => {
      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const data = hit.userData as ActiveNodeData;
        if (data && data.id !== lastHoveredId) {
          lastHoveredId = data.id;
          setHoveredNode(data);
          playHover();
        }
      } else {
        if (lastHoveredId !== null) {
          lastHoveredId = null;
          setHoveredNode(null);
        }
      }
    };

    // Render loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    const introDuration = 3.2;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      if (!reducedMotion) {
        // Camera: drift forward down the center aisle, then settle into a gentle idle orbit
        const basePos = new THREE.Vector3();
        if (elapsedTime < introDuration) {
          const t = easeOutCubic(elapsedTime / introDuration);
          basePos.copy(startCamPos).lerp(settleCamPos, t);
        } else {
          const idleT = elapsedTime - introDuration;
          basePos.copy(settleCamPos);
          basePos.x += Math.sin(idleT * 0.25) * 0.7;
          basePos.y += Math.sin(idleT * 0.18) * 0.25;
          basePos.z += Math.cos(idleT * 0.2) * 0.4;
        }

        camera.position.x += (basePos.x + parallaxX - camera.position.x) * 0.06;
        camera.position.y += (basePos.y + parallaxY - camera.position.y) * 0.06;
        camera.position.z += (basePos.z - camera.position.z) * 0.06;
        camera.lookAt(lookAtTarget);

        ring1.rotation.z = elapsedTime * 0.35;
        ring2.rotation.z = -elapsedTime * 0.28;

        pointLight.intensity = 1.2 + Math.sin(elapsedTime * 3) * 0.4;

        pulsingGlows.forEach(({ material, baseOpacity, phase }) => {
          material.opacity = baseOpacity * (0.75 + 0.25 * Math.sin(elapsedTime * 1.6 + phase));
        });
      }

      checkIntersection();

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Window resize handling
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // If the GPU process/driver ever drops the context, stop cleanly and fall
    // back to the static message instead of freezing on a black frame.
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(animationFrameId);
      setWebGlSupported(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!webGlSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-arena-card border border-white/10 rounded-lg p-6 text-sm text-arena-muted">
        3D preview unavailable — hardware acceleration disabled
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[450px] lg:h-[620px] rounded-xl overflow-hidden border border-white/10 bg-[#0A0A0B]/60 backdrop-blur-sm"
    >
      {/* Live status */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex items-center gap-2 text-xs text-arena-muted">
        <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
        <span>{stationsInfo.length} rigs, live</span>
      </div>

      {/* Node Inspector Card when hovering a 3D station */}
      {hoveredNode && (
        <div
          className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-80 z-20 bg-[#111114]/95 border border-white/10 rounded-lg p-4 backdrop-blur-md transition-all duration-200 animate-fadeIn"
          onClick={() => playClick()}
        >
          <div className="flex justify-between items-start border-b border-white/10 pb-2 mb-2">
            <div>
              <div className="text-[10px] text-arena-muted font-medium">
                {hoveredNode.zone}
              </div>
              <div className="font-semibold text-white text-base">
                {hoveredNode.name}
              </div>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-medium ${hoveredNode.status === 'IN_SESSION'
                  ? 'bg-arena-lime/10 text-arena-lime'
                  : hoveredNode.status === 'AVAILABLE'
                    ? 'bg-arena-cyan/10 text-arena-cyan'
                    : hoveredNode.status === 'BILLING'
                      ? 'bg-orange-500/10 text-orange-400'
                      : 'bg-white/5 text-arena-muted'
                }`}
            >
              {hoveredNode.status.replace('_', ' ').toLowerCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-arena-subtle">Specs</div>
              <div className="text-white truncate">{hoveredNode.gpu}</div>
            </div>
            <div>
              <div className="text-arena-subtle">Rate</div>
              <div className="text-arena-lime">{hoveredNode.rate}</div>
            </div>
            <div>
              <div className="text-arena-subtle">Active user</div>
              <div className="text-arena-text">@{hoveredNode.user}</div>
            </div>
            <div>
              <div className="text-arena-subtle">Drawer lock</div>
              <div className="text-white">Enforced</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
