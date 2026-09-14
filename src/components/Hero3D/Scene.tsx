import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { playClick, playHover } from '../../audio/soundEffects';

interface ActiveNodeData {
  id: string;
  name: string;
  zone: string;
  gpu: string;
  status: 'IN_SESSION' | 'AVAILABLE' | 'BILLING';
  rate: string;
  user: string;
}

export const Hero3DScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<ActiveNodeData | null>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);

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

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08080A, 0.045);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(12, 10, 16);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Group to hold all arena objects
    const arenaGroup = new THREE.Group();
    scene.add(arenaGroup);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(30, 30, 0x3A3F2E, 0x1A1B22);
    gridHelper.position.y = -0.5;
    arenaGroup.add(gridHelper);

    // Ground reflective plane
    const planeGeo = new THREE.PlaneGeometry(30, 30);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x08080A,
      transparent: true,
      opacity: 0.85,
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.51;
    arenaGroup.add(plane);

    // Central Core Server Rig
    const coreGroup = new THREE.Group();
    arenaGroup.add(coreGroup);

    // Central Server Chassis (semi-transparent dark glass + wireframe)
    const chassisGeo = new THREE.BoxGeometry(2.4, 4.2, 2.4);
    const chassisMat = new THREE.MeshPhysicalMaterial({
      color: 0x101116,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.85,
      wireframe: false,
    });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.position.y = 1.6;
    coreGroup.add(chassis);

    // Chassis Wireframe cage
    const wireGeo = new THREE.WireframeGeometry(chassisGeo);
    const wireMat = new THREE.LineBasicMaterial({ color: 0xCCFF00, linewidth: 1 });
    const wireframe = new THREE.LineSegments(wireGeo, wireMat);
    wireframe.position.y = 1.6;
    coreGroup.add(wireframe);

    // Glowing Core Cylinders (Internal Server Blades)
    const bladeGeo = new THREE.CylinderGeometry(0.7, 0.7, 3.2, 16);
    const bladeMat = new THREE.MeshBasicMaterial({
      color: 0xCCFF00,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const coreBlade = new THREE.Mesh(bladeGeo, bladeMat);
    coreBlade.position.y = 1.6;
    coreGroup.add(coreBlade);

    // Rotating Server Fan Rings
    const ringGeo = new THREE.TorusGeometry(1.4, 0.03, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00F0FF, transparent: true, opacity: 0.6 });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = 3.6;
    coreGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = -0.3;
    coreGroup.add(ring2);

    // Station Nodes (12 PC Rigs placed in an asymmetric esports layout)
    const interactiveMeshes: THREE.Mesh[] = [];
    const stationsInfo: ActiveNodeData[] = [
      { id: 'RIG_01', name: 'TITAN-01', zone: 'VIP ARENA', gpu: 'RTX 4090 24GB', status: 'IN_SESSION', rate: '₹180/hr', user: 'phantom_99' },
      { id: 'RIG_02', name: 'TITAN-02', zone: 'VIP ARENA', gpu: 'RTX 4090 24GB', status: 'IN_SESSION', rate: '₹180/hr', user: 'vortex_fps' },
      { id: 'RIG_03', name: 'TITAN-03', zone: 'VIP ARENA', gpu: 'RTX 4090 24GB', status: 'AVAILABLE', rate: '₹180/hr', user: 'READY' },
      { id: 'RIG_04', name: 'STAGE-01', zone: 'TOURNAMENT POD', gpu: 'RTX 4080 Super', status: 'IN_SESSION', rate: '₹150/hr', user: 'blitz_k' },
      { id: 'RIG_05', name: 'STAGE-02', zone: 'TOURNAMENT POD', gpu: 'RTX 4080 Super', status: 'BILLING', rate: '₹150/hr', user: 'kryptic' },
      { id: 'RIG_06', name: 'STAGE-03', zone: 'TOURNAMENT POD', gpu: 'RTX 4080 Super', status: 'IN_SESSION', rate: '₹150/hr', user: 'zenith_pro' },
      { id: 'RIG_07', name: 'GRID-01', zone: 'MAIN BATTLEFLOOR', gpu: 'RTX 4070 Ti', status: 'IN_SESSION', rate: '₹110/hr', user: 'shadow_in' },
      { id: 'RIG_08', name: 'GRID-02', zone: 'MAIN BATTLEFLOOR', gpu: 'RTX 4070 Ti', status: 'AVAILABLE', rate: '₹110/hr', user: 'READY' },
      { id: 'RIG_09', name: 'GRID-03', zone: 'MAIN BATTLEFLOOR', gpu: 'RTX 4070 Ti', status: 'IN_SESSION', rate: '₹110/hr', user: 'cypher_x' },
      { id: 'RIG_10', name: 'SIM-01', zone: 'RACING RIGS', gpu: 'FANATEC DD2 + RTX 4080', status: 'IN_SESSION', rate: '₹250/hr', user: 'apex_driver' },
      { id: 'RIG_11', name: 'SIM-02', zone: 'RACING RIGS', gpu: 'FANATEC DD2 + RTX 4080', status: 'AVAILABLE', rate: '₹250/hr', user: 'READY' },
      { id: 'RIG_12', name: 'CONSOLE-01', zone: 'PS5 LOUNGE', gpu: 'PS5 PRO 4K OLED', status: 'IN_SESSION', rate: '₹140/hr', user: 'ea_fc_squad' },
    ];

    const nodeGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.8);

    stationsInfo.forEach((info, index) => {
      // Form rings around the core
      const angle = (index / stationsInfo.length) * Math.PI * 2;
      const radius = 6.2 + (index % 2) * 1.6;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      let color = 0xCCFF00; // Acid lime for in_session
      if (info.status === 'AVAILABLE') color = 0x00F0FF; // Cyan for available
      if (info.status === 'BILLING') color = 0xFF9900; // Orange for billing

      const nodeMat = new THREE.MeshStandardMaterial({
        color: 0x14161F,
        roughness: 0.3,
        metalness: 0.8,
      });

      const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMat);
      nodeMesh.position.set(x, 0.2, z);
      nodeMesh.userData = info;
      interactiveMeshes.push(nodeMesh);
      arenaGroup.add(nodeMesh);

      // Node Status Light Beacon on top
      const beaconGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.2, 8);
      const beaconMat = new THREE.MeshBasicMaterial({ color });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(x, 0.9, z);
      arenaGroup.add(beacon);

      // Vertical Laser Line to floor
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, -0.5, z),
        new THREE.Vector3(x, 0.9, z),
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.35,
      });
      const laser = new THREE.Line(lineGeo, lineMat);
      arenaGroup.add(laser);
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xCCFF00, 1.2, 20);
    pointLight.position.set(0, 4, 0);
    scene.add(pointLight);

    // Mouse Parallax & Raycasting
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 12;
    let targetCameraY = 10;
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2(-10, -10);

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / height) * 2 - 1);

      mouseVector.x = x;
      mouseVector.y = y;

      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = (event.clientY / window.innerHeight) * 2 - 1;

      targetCameraX = 12 + mouseX * 3;
      targetCameraY = 10 - mouseY * 2;
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
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Slow orbital drift
      arenaGroup.rotation.y = elapsedTime * 0.07;
      coreBlade.rotation.y = -elapsedTime * 0.4;
      ring1.rotation.z = elapsedTime * 0.8;
      ring2.rotation.z = -elapsedTime * 0.6;

      // Smooth camera interpolation (parallax)
      camera.position.x += (targetCameraX - camera.position.x) * 0.05;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.lookAt(0, 1.2, 0);

      // Pulse the point light
      pointLight.intensity = 2.5 + Math.sin(elapsedTime * 3) * 0.8;

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

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
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
        <span>12 rigs, live</span>
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
                    : 'bg-orange-500/10 text-orange-400'
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
