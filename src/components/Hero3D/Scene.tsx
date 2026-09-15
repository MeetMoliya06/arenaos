import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
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

const STATUS_VISUALS: Record<
  ActiveNodeData['status'],
  StatusVisual
> = {
  IN_SESSION: {
    color: 0xccff00,
    glow: true,
    glowOpacity: 0.72,
  },

  AVAILABLE: {
    color: 0x00eaff,
    glow: true,
    glowOpacity: 0.58,
  },

  BILLING: {
    color: 0xffa000,
    glow: true,
    glowOpacity: 0.68,
  },

  OFFLINE: {
    color: 0x454952,
    glow: false,
    glowOpacity: 0.08,
  },
};

/* =========================================================
   DASHBOARD TEXTURE
========================================================= */

function buildDashboardTexture(
  total: number,
  active: number,
  idle: number,
  endingSoon: number,
  offline: number
) {
  const canvas = document.createElement('canvas');

  canvas.width = 1000;
  canvas.height = 420;

  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  ctx.fillStyle = '#08090b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  /* Outer border */

  ctx.strokeStyle = 'rgba(204,255,0,0.35)';
  ctx.lineWidth = 2;

  ctx.strokeRect(
    12,
    12,
    canvas.width - 24,
    canvas.height - 24
  );

  /* Header */

  ctx.font =
    '600 22px "JetBrains Mono", monospace';

  ctx.fillStyle =
    'rgba(220,225,215,0.55)';

  ctx.fillText(
    'ARENAOS / COMMAND',
    40,
    58
  );

  /* Total */

  ctx.font =
    '700 62px "JetBrains Mono", monospace';

  ctx.fillStyle = '#f1f4eb';

  ctx.fillText(
    `${total}`,
    40,
    135
  );

  ctx.font =
    '500 16px "JetBrains Mono", monospace';

  ctx.fillStyle =
    'rgba(220,225,215,0.45)';

  ctx.fillText(
    'RIGS',
    44,
    163
  );

  /* Active */

  ctx.font =
    '700 30px "JetBrains Mono", monospace';

  ctx.fillStyle = '#ccff00';

  ctx.fillText(
    `${active}`,
    210,
    125
  );

  ctx.font =
    '500 14px "JetBrains Mono", monospace';

  ctx.fillText(
    'ACTIVE',
    210,
    150
  );

  /* Available */

  ctx.font =
    '700 30px "JetBrains Mono", monospace';

  ctx.fillStyle = '#00eaff';

  ctx.fillText(
    `${idle}`,
    365,
    125
  );

  ctx.font =
    '500 14px "JetBrains Mono", monospace';

  ctx.fillText(
    'READY',
    365,
    150
  );

  /* Billing */

  ctx.font =
    '700 30px "JetBrains Mono", monospace';

  ctx.fillStyle = '#ffa000';

  ctx.fillText(
    `${endingSoon}`,
    520,
    125
  );

  ctx.font =
    '500 14px "JetBrains Mono", monospace';

  ctx.fillText(
    'ENDING',
    520,
    150
  );

  /* Offline */

  ctx.font =
    '700 30px "JetBrains Mono", monospace';

  ctx.fillStyle = '#6d727a';

  ctx.fillText(
    `${offline}`,
    675,
    125
  );

  ctx.font =
    '500 14px "JetBrains Mono", monospace';

  ctx.fillText(
    'OFFLINE',
    675,
    150
  );

  /* Small activity graph */

  ctx.strokeStyle =
    'rgba(0,234,255,0.35)';

  ctx.lineWidth = 2;

  ctx.beginPath();

  for (let i = 0; i < 220; i++) {
    const x = 40 + i * 3.4;

    const y =
      255 +
      Math.sin(i * 0.16) * 20 +
      Math.sin(i * 0.045) * 14;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();

  /* Lime graph */

  ctx.strokeStyle =
    'rgba(204,255,0,0.7)';

  ctx.lineWidth = 2;

  ctx.beginPath();

  for (let i = 0; i < 220; i++) {
    const x = 40 + i * 3.4;

    const y =
      275 +
      Math.sin(i * 0.12 + 1) * 18 +
      Math.sin(i * 0.05) * 12;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();

  ctx.font =
    '500 13px "JetBrains Mono", monospace';

  ctx.fillStyle =
    'rgba(220,225,215,0.4)';

  ctx.fillText(
    'NETWORK ACTIVITY',
    40,
    325
  );

  ctx.fillStyle = '#ccff00';

  ctx.fillText(
    '● SYSTEM OPERATIONAL',
    40,
    370
  );

  ctx.fillStyle =
    'rgba(0,234,255,0.55)';

  ctx.fillText(
    'REAL-TIME',
    790,
    370
  );

  const texture =
    new THREE.CanvasTexture(canvas);

  texture.colorSpace =
    THREE.SRGBColorSpace;

  return texture;
}

/* =========================================================
   GLOW TEXTURE
========================================================= */

function buildGlowTexture(
  color: number
) {
  const size = 256;

  const canvas =
    document.createElement('canvas');

  canvas.width = size;
  canvas.height = size;

  const ctx =
    canvas.getContext('2d');

  if (!ctx) return null;

  const c =
    new THREE.Color(color);

  const rgb =
    `${Math.round(c.r * 255)}, ${Math.round(
      c.g * 255
    )}, ${Math.round(c.b * 255)}`;

  const gradient =
    ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );

  gradient.addColorStop(
    0,
    `rgba(${rgb},0.7)`
  );

  gradient.addColorStop(
    0.3,
    `rgba(${rgb},0.25)`
  );

  gradient.addColorStop(
    1,
    `rgba(${rgb},0)`
  );

  ctx.fillStyle = gradient;

  ctx.fillRect(
    0,
    0,
    size,
    size
  );

  const texture =
    new THREE.CanvasTexture(canvas);

  texture.colorSpace =
    THREE.SRGBColorSpace;

  return texture;
}

/* =========================================================
   RIG LABEL
========================================================= */

function buildRigLabelTexture(
  id: string,
  status: string,
  color: number
) {
  const canvas =
    document.createElement('canvas');

  canvas.width = 500;
  canvas.height = 120;

  const ctx =
    canvas.getContext('2d');

  if (!ctx) return null;

  const c =
    new THREE.Color(color);

  const rgb =
    `${Math.round(c.r * 255)},${Math.round(
      c.g * 255
    )},${Math.round(c.b * 255)}`;

  ctx.fillStyle =
    'rgba(6,8,10,0.92)';

  ctx.fillRect(
    3,
    3,
    494,
    114
  );

  ctx.strokeStyle =
    `rgb(${rgb})`;

  ctx.lineWidth = 2;

  ctx.strokeRect(
    3,
    3,
    494,
    114
  );

  ctx.font =
    '700 27px "JetBrains Mono", monospace';

  ctx.fillStyle = '#ffffff';

  ctx.fillText(
    id,
    22,
    43
  );

  ctx.font =
    '500 17px "JetBrains Mono", monospace';

  ctx.fillStyle =
    `rgb(${rgb})`;

  ctx.fillText(
    status,
    22,
    82
  );

  const texture =
    new THREE.CanvasTexture(canvas);

  texture.colorSpace =
    THREE.SRGBColorSpace;

  return texture;
}

/* =========================================================
   COMPONENT
========================================================= */

export const Hero3DScene: React.FC = () => {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const [
    hoveredNode,
    setHoveredNode,
  ] =
    useState<ActiveNodeData | null>(
      null
    );

  const [
    webGlSupported,
    setWebGlSupported,
  ] =
    useState(true);

  /* =======================================================
     DATA
  ======================================================= */

  const stationsInfo: ActiveNodeData[] = [
    {
      id: 'RIG_01',
      name: 'TITAN-01',
      zone: 'VIP ARENA',
      gpu: 'RTX 4090 24GB',
      status: 'IN_SESSION',
      rate: '₹180/hr',
      user: 'phantom_99',
    },

    {
      id: 'RIG_02',
      name: 'TITAN-02',
      zone: 'VIP ARENA',
      gpu: 'RTX 4090 24GB',
      status: 'IN_SESSION',
      rate: '₹180/hr',
      user: 'vortex_fps',
    },

    {
      id: 'RIG_03',
      name: 'TITAN-03',
      zone: 'VIP ARENA',
      gpu: 'RTX 4090 24GB',
      status: 'AVAILABLE',
      rate: '₹180/hr',
      user: 'READY',
    },

    {
      id: 'RIG_04',
      name: 'STAGE-01',
      zone: 'TOURNAMENT POD',
      gpu: 'RTX 4080 Super',
      status: 'IN_SESSION',
      rate: '₹150/hr',
      user: 'blitz_k',
    },

    {
      id: 'RIG_05',
      name: 'STAGE-02',
      zone: 'TOURNAMENT POD',
      gpu: 'RTX 4080 Super',
      status: 'BILLING',
      rate: '₹150/hr',
      user: 'kryptic',
    },

    {
      id: 'RIG_06',
      name: 'STAGE-03',
      zone: 'TOURNAMENT POD',
      gpu: 'RTX 4080 Super',
      status: 'IN_SESSION',
      rate: '₹150/hr',
      user: 'zenith_pro',
    },

    {
      id: 'RIG_07',
      name: 'GRID-01',
      zone: 'MAIN BATTLEFLOOR',
      gpu: 'RTX 4070 Ti',
      status: 'IN_SESSION',
      rate: '₹110/hr',
      user: 'shadow_in',
    },

    {
      id: 'RIG_08',
      name: 'GRID-02',
      zone: 'MAIN BATTLEFLOOR',
      gpu: 'RTX 4070 Ti',
      status: 'OFFLINE',
      rate: '₹110/hr',
      user: '—',
    },

    {
      id: 'RIG_09',
      name: 'GRID-03',
      zone: 'MAIN BATTLEFLOOR',
      gpu: 'RTX 4070 Ti',
      status: 'IN_SESSION',
      rate: '₹110/hr',
      user: 'cypher_x',
    },

    {
      id: 'RIG_10',
      name: 'SIM-01',
      zone: 'RACING RIGS',
      gpu: 'FANATEC DD2 + RTX 4080',
      status: 'IN_SESSION',
      rate: '₹250/hr',
      user: 'apex_driver',
    },

    {
      id: 'RIG_11',
      name: 'SIM-02',
      zone: 'RACING RIGS',
      gpu: 'FANATEC DD2 + RTX 4080',
      status: 'AVAILABLE',
      rate: '₹250/hr',
      user: 'READY',
    },

    {
      id: 'RIG_12',
      name: 'CONSOLE-01',
      zone: 'PS5 LOUNGE',
      gpu: 'PS5 PRO 4K OLED',
      status: 'IN_SESSION',
      rate: '₹140/hr',
      user: 'ea_fc_squad',
    },
  ];

  /* =======================================================
     THREE.JS
  ======================================================= */

  useEffect(() => {
    if (!containerRef.current) return;

    const container =
      containerRef.current;

    /* WebGL check */

    try {
      const testCanvas =
        document.createElement(
          'canvas'
        );

      const gl =
        testCanvas.getContext(
          'webgl'
        ) ||
        testCanvas.getContext(
          'experimental-webgl'
        );

      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    // This hero scene is purely decorative and its motion is gentle
    // (slow drift, small sweeps, opacity pulses) — no large/fast/
    // parallax motion — so it intentionally always plays in full,
    // rather than gating behind prefers-reduced-motion.

    /* =====================================================
       SCENE
    ===================================================== */

    const scene =
      new THREE.Scene();

    scene.background =
      new THREE.Color(
        0x060810
      );

    scene.fog =
      new THREE.FogExp2(
        0x060810,
        0.018
      );

    /* =====================================================
       CAMERA
    ===================================================== */

    const width =
      container.clientWidth;

    const height =
      container.clientHeight;

    const camera =
      new THREE.PerspectiveCamera(
        50,
        width / height,
        0.1,
        150
      );

    const startCamera =
      new THREE.Vector3(
        0,
        6.4,
        20
      );

    const targetCamera =
      new THREE.Vector3(
        0,
        5.2,
        14.5
      );

    const cameraLookAt =
      new THREE.Vector3(
        0,
        0.6,
        0
      );

    camera.position.copy(
      startCamera
    );

    camera.lookAt(
      cameraLookAt
    );

    /* =====================================================
       RENDERER
    ===================================================== */

    const renderer =
      new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference:
          'high-performance',
      });

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );

    renderer.setSize(
      width,
      height
    );

    renderer.setClearColor(
      0x060810,
      1
    );

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    renderer.toneMapping =
      THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure =
      1.5;

    container.appendChild(
      renderer.domElement
    );

    /* =====================================================
       POST-PROCESSING (BLOOM)
    ===================================================== */

    const composer =
      new EffectComposer(renderer);

    const renderPass =
      new RenderPass(scene, camera);

    composer.addPass(renderPass);

    const bloomPass =
      new UnrealBloomPass(
        new THREE.Vector2(
          width,
          height
        ),
        0.65,   // strength
        0.45,   // radius
        0.78    // threshold
      );

    composer.addPass(bloomPass);

    /* =====================================================
       ARENA ROOT
    ===================================================== */

    const arena =
      new THREE.Group();

    scene.add(arena);

    /* =====================================================
       FLOOR
    ===================================================== */

    const floor =
      new THREE.Mesh(
        new THREE.PlaneGeometry(
          50,
          50
        ),
        new THREE.MeshStandardMaterial(
          {
            color: 0x0c1018,
            roughness: 0.32,
            metalness: 0.82,
          }
        )
      );

    floor.rotation.x =
      -Math.PI / 2;

    floor.position.y =
      -0.5;

    arena.add(floor);

    /* subtle grid */

    const grid =
      new THREE.GridHelper(
        50,
        50,
        0x2a3328,
        0x161c24
      );

    grid.position.y =
      -0.47;

    arena.add(grid);

    /* =====================================================
       CENTRAL OPERATOR
    ===================================================== */

    const operatorGroup =
      new THREE.Group();

    operatorGroup.position.set(
      0,
      0,
      1.5
    );

    arena.add(
      operatorGroup
    );

    /* platform */

    const operatorPlatform =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          2.8,
          2.95,
          0.18,
          64
        ),
        new THREE.MeshStandardMaterial(
          {
            color: 0x090c10,
            roughness: 0.25,
            metalness: 0.88,
          }
        )
      );

    operatorPlatform.position.y =
      -0.37;

    operatorGroup.add(
      operatorPlatform
    );

    /* platform ring */

    const operatorRing =
      new THREE.Mesh(
        new THREE.TorusGeometry(
          2.7,
          0.025,
          12,
          96
        ),
        new THREE.MeshBasicMaterial(
          {
            color: 0xccff00,
            transparent: true,
            opacity: 0.65,
          }
        )
      );

    operatorRing.rotation.x =
      Math.PI / 2;

    operatorRing.position.y =
      -0.25;

    operatorGroup.add(
      operatorRing
    );

    /* desk */

    const operatorDesk =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          2.8,
          0.18,
          1.25
        ),
        new THREE.MeshStandardMaterial(
          {
            color: 0x101419,
            roughness: 0.25,
            metalness: 0.8,
          }
        )
      );

    operatorDesk.position.y =
      0.95;

    operatorGroup.add(
      operatorDesk
    );

    /* desk light */

    const deskLight =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          2.8,
          0.018,
          0.025
        ),
        new THREE.MeshBasicMaterial(
          {
            color: 0xccff00,
          }
        )
      );

    deskLight.position.set(
      0,
      0.84,
      0.63
    );

    operatorGroup.add(
      deskLight
    );

    /* =====================================================
       OPERATOR PC
    ===================================================== */

    const operatorPC =
      new THREE.Group();

    operatorPC.position.set(
      0.75,
      1.0,
      0
    );

    operatorGroup.add(
      operatorPC
    );

    const operatorTower =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.48,
          1.15,
          0.62
        ),
        new THREE.MeshStandardMaterial(
          {
            color: 0x0b0e12,
            roughness: 0.25,
            metalness: 0.75,
            emissive: 0x030507,
            emissiveIntensity: 0.7,
          }
        )
      );

    operatorTower.position.y =
      0.58;

    operatorPC.add(
      operatorTower
    );

    const operatorStrip =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.025,
          0.82,
          0.025
        ),
        new THREE.MeshBasicMaterial(
          {
            color: 0xccff00,
            transparent: true,
            opacity: 0.9,
          }
        )
      );

    operatorStrip.position.set(
      0.22,
      0.58,
      0.32
    );

    operatorPC.add(
      operatorStrip
    );

    /* =====================================================
       OPERATOR MONITOR
    ===================================================== */

    const activeCount =
      stationsInfo.filter(
        s =>
          s.status ===
          'IN_SESSION'
      ).length;

    const idleCount =
      stationsInfo.filter(
        s =>
          s.status ===
          'AVAILABLE'
      ).length;

    const endingSoonCount =
      stationsInfo.filter(
        s =>
          s.status ===
          'BILLING'
      ).length;

    const offlineCount =
      stationsInfo.filter(
        s =>
          s.status ===
          'OFFLINE'
      ).length;

    const dashboardTexture =
      buildDashboardTexture(
        stationsInfo.length,
        activeCount,
        idleCount,
        endingSoonCount,
        offlineCount
      );

    const operatorMonitor =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          1.65,
          0.95,
          0.07
        ),
        new THREE.MeshStandardMaterial(
          {
            color: 0x080a0d,
            roughness: 0.2,
            metalness: 0.75,
          }
        )
      );

    operatorMonitor.position.set(
      0,
      1.55,
      -0.15
    );

    operatorGroup.add(
      operatorMonitor
    );

    const operatorScreen =
      new THREE.Mesh(
        new THREE.PlaneGeometry(
          1.5,
          0.78
        ),
        new THREE.MeshBasicMaterial(
          {
            map:
              dashboardTexture ??
              undefined,
            color:
              dashboardTexture
                ? 0xffffff
                : 0xccff00,
            transparent: true,
            opacity: 0.94,
          }
        )
      );

    operatorScreen.position.z =
      0.041;

    operatorMonitor.add(
      operatorScreen
    );

    /* =====================================================
       SECONDARY MONITORS
    ===================================================== */

    [-1.0, 1.0].forEach(
      (x, index) => {
        const monitor =
          new THREE.Mesh(
            new THREE.BoxGeometry(
              0.85,
              0.58,
              0.055
            ),
            new THREE.MeshStandardMaterial(
              {
                color: 0x080a0d,
                roughness: 0.22,
                metalness: 0.7,
              }
            )
          );

        monitor.position.set(
          x,
          1.42,
          -0.1
        );

        monitor.rotation.y =
          x < 0
            ? THREE.MathUtils.degToRad(
                8
              )
            : THREE.MathUtils.degToRad(
                -8
              );

        operatorGroup.add(
          monitor
        );

        const screen =
          new THREE.Mesh(
            new THREE.PlaneGeometry(
              0.72,
              0.42
            ),
            new THREE.MeshBasicMaterial(
              {
                color:
                  index === 0
                    ? 0x00eaff
                    : 0xccff00,
                transparent: true,
                opacity: 0.25,
              }
            )
          );

        screen.position.z =
          0.031;

        monitor.add(
          screen
        );
      }
    );

    /* =====================================================
       OPERATOR CHAIR
    ===================================================== */

    const chair =
      new THREE.Group();

    chair.position.set(
      0,
      0,
      1.45
    );

    operatorGroup.add(
      chair
    );

    const chairSeat =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.85,
          0.18,
          0.82
        ),
        new THREE.MeshStandardMaterial(
          {
            color: 0x080a0d,
            roughness: 0.35,
            metalness: 0.45,
          }
        )
      );

    chairSeat.position.y =
      0.62;

    chair.add(
      chairSeat
    );

    const chairBack =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.85,
          1.05,
          0.16
        ),
        new THREE.MeshStandardMaterial(
          {
            color: 0x080a0d,
            roughness: 0.35,
            metalness: 0.45,
          }
        )
      );

    chairBack.position.set(
      0,
      1.15,
      0.34
    );

    chair.add(
      chairBack
    );

    /* =====================================================
       RIG ARRANGEMENT
    ===================================================== */

    const rigPositions = [
      [-6.8, 5.0],
      [-3.4, 6.4],
      [0, 6.8],
      [3.4, 6.4],
      [6.8, 5.0],

      [-7.8, 1.8],
      [7.8, 1.8],

      [-7.4, -2.0],
      [7.4, -2.0],

      [-5.0, -5.5],
      [0, -6.2],
      [5.0, -5.5],
    ];

    // All rigs (and their network lines/packets) live inside this group,
    // pivoted at the operator's position. Rotating the group carries every
    // PC around the operator in a slow carousel so each one sweeps past.
    const rigOrbitGroup =
      new THREE.Group();

    rigOrbitGroup.position.set(
      0,
      0,
      1.5
    );

    arena.add(
      rigOrbitGroup
    );

    /* =====================================================
       ANIMATION DATA
    ===================================================== */

    const rigGroups:
      THREE.Group[] = [];

    const interactiveMeshes:
      THREE.Mesh[] = [];

    const pulseMaterials: {
      material: THREE.MeshBasicMaterial;
      base: number;
      phase: number;
    }[] = [];

    const networkLines: {
      material: THREE.LineBasicMaterial;
      phase: number;
    }[] = [];

    const networkPackets: {
      mesh: THREE.Mesh;
      curve: THREE.CatmullRomCurve3;
      progress: number;
      speed: number;
    }[] = [];

    /* =====================================================
       REUSABLE GEOMETRIES
    ===================================================== */

    const rigDeskGeometry =
      new THREE.BoxGeometry(
        1.45,
        0.08,
        0.72
      );

    const rigMonitorGeometry =
      new THREE.BoxGeometry(
        0.95,
        0.58,
        0.055
      );

    const rigTowerGeometry =
      new THREE.BoxGeometry(
        0.34,
        0.92,
        0.48
      );

    /* =====================================================
       BUILD RIGS
    ===================================================== */

    stationsInfo.forEach(
      (info, index) => {
        const [x, z] =
          rigPositions[index];

        const visual =
          STATUS_VISUALS[
            info.status
          ];

        const rig =
          new THREE.Group();

        // Local to rigOrbitGroup, which is pivoted at the operator
        // (0, 0, 1.5) — so z is relative to that pivot, not world origin.
        rig.position.set(
          x,
          0,
          z - 1.5
        );

        rigOrbitGroup.add(
          rig
        );

        rigGroups.push(
          rig
        );

        /* -----------------------------------------------
           PLATFORM
        ----------------------------------------------- */

        const platform =
          new THREE.Mesh(
            new THREE.CylinderGeometry(
              1.0,
              1.0,
              0.06,
              48
            ),
            new THREE.MeshStandardMaterial(
              {
                color: 0x0e1218,
                roughness: 0.25,
                metalness: 0.85,
              }
            )
          );

        platform.position.y =
          -0.43;

        rig.add(
          platform
        );

        /* -----------------------------------------------
           RING
        ----------------------------------------------- */

        const ring =
          new THREE.Mesh(
            new THREE.TorusGeometry(
              0.82,
              0.018,
              10,
              64
            ),
            new THREE.MeshBasicMaterial(
              {
                color:
                  visual.color,
                transparent: true,
                opacity:
                  visual.glow
                    ? 0.85
                    : 0.2,
              }
            )
          );

        ring.rotation.x =
          Math.PI / 2;

        ring.position.y =
          -0.38;

        rig.add(
          ring
        );

        if (visual.glow) {
          pulseMaterials.push({
            material:
              ring.material as THREE.MeshBasicMaterial,
            base: 0.7,
            phase: index,
          });
        }

        /* -----------------------------------------------
           DESK
        ----------------------------------------------- */

        const desk =
          new THREE.Mesh(
            rigDeskGeometry,
            new THREE.MeshStandardMaterial(
              {
                color: 0x181c24,
                roughness: 0.25,
                metalness: 0.82,
              }
            )
          );

        desk.position.y =
          0.38;

        desk.userData =
          info;

        rig.add(
          desk
        );

        interactiveMeshes.push(
          desk
        );

        /* -----------------------------------------------
           MONITOR
        ----------------------------------------------- */

        const monitor =
          new THREE.Mesh(
            rigMonitorGeometry,
            new THREE.MeshStandardMaterial(
              {
                color: 0x10141a,
                roughness: 0.2,
                metalness: 0.78,
              }
            )
          );

        monitor.position.set(
          0,
          0.83,
          -0.22
        );

        monitor.rotation.x =
          THREE.MathUtils.degToRad(
            -8
          );

        monitor.userData =
          info;

        rig.add(
          monitor
        );

        interactiveMeshes.push(
          monitor
        );

        /* -----------------------------------------------
           SCREEN
        ----------------------------------------------- */

        const screen =
          new THREE.Mesh(
            new THREE.PlaneGeometry(
              0.72,
              0.42
            ),
            new THREE.MeshBasicMaterial(
              {
                color:
                  visual.color,
                transparent: true,
                opacity:
                  visual.glow
                    ? Math.min(visual.glowOpacity * 1.4, 0.95)
                    : 0.12,
              }
            )
          );

        screen.position.z =
          0.031;

        monitor.add(
          screen
        );

        rig.userData.screen =
          screen;

        if (visual.glow) {
          pulseMaterials.push({
            material:
              screen.material as THREE.MeshBasicMaterial,
            base:
              visual.glowOpacity,
            phase:
              index + 3,
          });
        }

        /* -----------------------------------------------
           PC TOWER
        ----------------------------------------------- */

        const tower =
          new THREE.Mesh(
            rigTowerGeometry,
            new THREE.MeshStandardMaterial(
              {
                color: 0x12161e,
                roughness: 0.24,
                metalness: 0.78,
                emissive: 0x050810,
                emissiveIntensity: 1.0,
              }
            )
          );

        tower.position.set(
          0.56,
          0.46,
          0.02
        );

        rig.add(
          tower
        );

        /* -----------------------------------------------
           GLASS PANEL
        ----------------------------------------------- */

        const glass =
          new THREE.Mesh(
            new THREE.PlaneGeometry(
              0.28,
              0.72
            ),
            new THREE.MeshBasicMaterial(
              {
                color:
                  visual.color,
                transparent: true,
                opacity:
                  visual.glow
                    ? 0.22
                    : 0.06,
              }
            )
          );

        glass.position.set(
          0.56,
          0.46,
          0.265
        );

        rig.add(
          glass
        );

        /* -----------------------------------------------
           RGB STRIP
        ----------------------------------------------- */

        const led =
          new THREE.Mesh(
            new THREE.BoxGeometry(
              0.025,
              0.72,
              0.025
            ),
            new THREE.MeshBasicMaterial(
              {
                color:
                  visual.color,
                transparent: true,
                opacity:
                  visual.glow
                    ? 1.0
                    : 0.2,
              }
            )
          );

        led.position.set(
          0.39,
          0.46,
          0.27
        );

        rig.add(
          led
        );

        rig.userData.led =
          led;

        if (visual.glow) {
          pulseMaterials.push({
            material:
              led.material as THREE.MeshBasicMaterial,
            base:
              visual.glow
                ? 0.9
                : 0.12,
            phase:
              index + 5,
          });
        }

        /* -----------------------------------------------
           SMALL FLOOR GLOW
        ----------------------------------------------- */

        if (visual.glow) {
          const glowTexture =
            buildGlowTexture(
              visual.color
            );

          if (glowTexture) {
            const glow =
              new THREE.Mesh(
                new THREE.PlaneGeometry(
                  2.3,
                  2.3
                ),
                new THREE.MeshBasicMaterial(
                  {
                    map:
                      glowTexture,
                    transparent: true,
                    opacity: 0.22,
                    blending:
                      THREE.AdditiveBlending,
                    depthWrite: false,
                  }
                )
              );

            glow.rotation.x =
              -Math.PI / 2;

            glow.position.y =
              -0.41;

            rig.add(
              glow
            );

            pulseMaterials.push({
              material:
                glow.material as THREE.MeshBasicMaterial,
              base: 0.22,
              phase:
                index + 8,
            });
          }
        }

        /* -----------------------------------------------
           LABEL
        ----------------------------------------------- */

        const labelTexture =
          buildRigLabelTexture(
            info.id,
            info.status.replace(
              '_',
              ' '
            ),
            visual.color
          );

        if (labelTexture) {
          const label =
            new THREE.Mesh(
              new THREE.PlaneGeometry(
                1.15,
                0.28
              ),
              new THREE.MeshBasicMaterial(
                {
                  map:
                    labelTexture,
                  transparent: true,
                  depthWrite: false,
                }
              )
            );

          label.position.set(
            0,
            1.35,
            0
          );

          rig.add(
            label
          );
        }

        /* =================================================
           NETWORK CONNECTION
        ================================================= */

        // Local to rigOrbitGroup: the operator/pivot sits at this
        // group's own origin, so "start" no longer needs the world
        // z=1.5 offset — it stays pinned to the pivot as the group
        // rotates, while "end" (the rig) rotates along with it.
        const start =
          new THREE.Vector3(
            0,
            0.08,
            0
          );

        const end =
          new THREE.Vector3(
            x,
            0.04,
            z - 1.5
          );

        const distance =
          Math.sqrt(
            x * x +
              (z - 1.5) *
                (z - 1.5)
          );

        const curveHeight =
          Math.min(
            0.8,
            distance * 0.035
          );

        const midpoint =
          new THREE.Vector3(
            x * 0.5,
            0.05 +
              curveHeight,
            (z - 1.5) *
              0.5
          );

        const curve =
          new THREE.CatmullRomCurve3(
            [
              start,
              midpoint,
              end,
            ]
          );

        const points =
          curve.getPoints(
            60
          );

        const geometry =
          new THREE.BufferGeometry().setFromPoints(
            points
          );

        const networkMaterial =
          new THREE.LineBasicMaterial(
            {
              color:
                visual.color,
              transparent: true,
              opacity:
                visual.glow
                  ? 0.35
                  : 0.1,
              blending:
                THREE.AdditiveBlending,
            }
          );

        const line =
          new THREE.Line(
            geometry,
            networkMaterial
          );

        rigOrbitGroup.add(
          line
        );

        networkLines.push({
          material:
            networkMaterial,
          phase: index,
        });

        /* -----------------------------------------------
           DATA PACKET
        ----------------------------------------------- */

        if (visual.glow) {
          const packet =
            new THREE.Mesh(
              new THREE.SphereGeometry(
                0.065,
                12,
                12
              ),
              new THREE.MeshBasicMaterial(
                {
                  color:
                    visual.color,
                }
              )
            );

          rigOrbitGroup.add(
            packet
          );

          networkPackets.push({
            mesh: packet,
            curve,
            progress:
              (index * 0.17) %
              1,
            speed:
              0.035 +
              Math.random() *
                0.025,
          });
        }
      }
    );

    /* =====================================================
       LIGHTING
    ===================================================== */

    const ambient =
      new THREE.AmbientLight(
        0xffffff,
        0.6
      );

    scene.add(
      ambient
    );

    const mainLight =
      new THREE.DirectionalLight(
        0xffffff,
        1.8
      );

    mainLight.position.set(
      5,
      12,
      8
    );

    scene.add(
      mainLight
    );

    const cyanLight =
      new THREE.PointLight(
        0x00eaff,
        4.0,
        35
      );

    cyanLight.position.set(
      -6,
      4,
      -2
    );

    scene.add(
      cyanLight
    );

    const limeLight =
      new THREE.PointLight(
        0xccff00,
        4.5,
        35
      );

    limeLight.position.set(
      5,
      3,
      4
    );

    scene.add(
      limeLight
    );

    const operatorLight =
      new THREE.PointLight(
        0xccff00,
        3.5,
        18
      );

    operatorLight.position.set(
      0,
      3,
      1
    );

    scene.add(
      operatorLight
    );

    /* back-fill rim light — gives depth to silhouettes */

    const rimLight =
      new THREE.DirectionalLight(
        0x1a2a40,
        1.2
      );

    rimLight.position.set(
      -4,
      6,
      -10
    );

    scene.add(
      rimLight
    );

    /* =====================================================
       FLOATING PARTICLES
    ===================================================== */

    const particleCount = 280;

    const particlePositions =
      new Float32Array(
        particleCount * 3
      );

    const particleSpeeds =
      new Float32Array(
        particleCount
      );

    const particlePhases =
      new Float32Array(
        particleCount
      );

    for (
      let i = 0;
      i < particleCount;
      i++
    ) {
      particlePositions[i * 3] =
        (Math.random() - 0.5) * 40;

      particlePositions[
        i * 3 + 1
      ] =
        Math.random() * 10 - 0.5;

      particlePositions[
        i * 3 + 2
      ] =
        (Math.random() - 0.5) * 40;

      particleSpeeds[i] =
        0.008 +
        Math.random() * 0.02;

      particlePhases[i] =
        Math.random() *
        Math.PI *
        2;
    }

    const particleGeometry =
      new THREE.BufferGeometry();

    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(
        particlePositions,
        3
      )
    );

    const particleTexture =
      (() => {
        const c =
          document.createElement(
            'canvas'
          );

        c.width = 64;
        c.height = 64;

        const ct =
          c.getContext('2d');

        if (!ct) return null;

        const g =
          ct.createRadialGradient(
            32,
            32,
            0,
            32,
            32,
            32
          );

        g.addColorStop(
          0,
          'rgba(204,255,0,0.9)'
        );

        g.addColorStop(
          0.15,
          'rgba(204,255,0,0.4)'
        );

        g.addColorStop(
          0.5,
          'rgba(0,234,255,0.12)'
        );

        g.addColorStop(
          1,
          'rgba(0,0,0,0)'
        );

        ct.fillStyle = g;

        ct.fillRect(
          0,
          0,
          64,
          64
        );

        const tex =
          new THREE.CanvasTexture(
            c
          );

        tex.colorSpace =
          THREE.SRGBColorSpace;

        return tex;
      })();

    const particles =
      new THREE.Points(
        particleGeometry,
        new THREE.PointsMaterial({
          size: 0.12,
          map:
            particleTexture ??
            undefined,
          transparent: true,
          opacity: 0.7,
          blending:
            THREE.AdditiveBlending,
          depthWrite: false,
          sizeAttenuation: true,
        })
      );

    scene.add(particles);

    /* =====================================================
       HOLOGRAPHIC ORBIT ARCS
    ===================================================== */

    const holoArcs: {
      mesh: THREE.Line;
      speed: number;
      axis: THREE.Vector3;
    }[] = [];

    const arcConfigs = [
      {
        radius: 4.2,
        color: 0xccff00,
        opacity: 0.15,
        arcLength: Math.PI * 0.65,
        speed: 0.15,
        tiltX: 0.18,
        tiltZ: 0.05,
      },
      {
        radius: 5.8,
        color: 0x00eaff,
        opacity: 0.1,
        arcLength: Math.PI * 0.5,
        speed: -0.1,
        tiltX: -0.12,
        tiltZ: 0.08,
      },
      {
        radius: 7.5,
        color: 0xccff00,
        opacity: 0.06,
        arcLength: Math.PI * 0.4,
        speed: 0.07,
        tiltX: 0.06,
        tiltZ: -0.1,
      },
    ];

    arcConfigs.forEach(cfg => {
      const pts: THREE.Vector3[] =
        [];

      const segments = 80;

      for (
        let i = 0;
        i <= segments;
        i++
      ) {
        const angle =
          (i / segments) *
          cfg.arcLength;

        pts.push(
          new THREE.Vector3(
            Math.cos(angle) *
              cfg.radius,
            0,
            Math.sin(angle) *
              cfg.radius
          )
        );
      }

      const arcGeom =
        new THREE.BufferGeometry().setFromPoints(
          pts
        );

      const arcMat =
        new THREE.LineBasicMaterial(
          {
            color: cfg.color,
            transparent: true,
            opacity: cfg.opacity,
            blending:
              THREE.AdditiveBlending,
          }
        );

      const arc =
        new THREE.Line(
          arcGeom,
          arcMat
        );

      arc.rotation.x =
        Math.PI / 2 +
        cfg.tiltX;

      arc.rotation.z =
        cfg.tiltZ;

      arc.position.set(
        0,
        0.1,
        1.5
      );

      arena.add(arc);

      holoArcs.push({
        mesh: arc,
        speed: cfg.speed,
        axis:
          new THREE.Vector3(
            0,
            1,
            0
          ),
      });
    });

    /* =====================================================
       OUTER PERIMETER RING
    ===================================================== */

    const outerRing =
      new THREE.Mesh(
        new THREE.TorusGeometry(
          14,
          0.015,
          8,
          180
        ),
        new THREE.MeshBasicMaterial(
          {
            color: 0xccff00,
            transparent: true,
            opacity: 0.08,
          }
        )
      );

    outerRing.rotation.x =
      Math.PI / 2;

    outerRing.position.set(
      0,
      -0.42,
      1.5
    );

    arena.add(
      outerRing
    );

    const outerRing2 =
      new THREE.Mesh(
        new THREE.TorusGeometry(
          10.5,
          0.012,
          8,
          140
        ),
        new THREE.MeshBasicMaterial(
          {
            color: 0x00eaff,
            transparent: true,
            opacity: 0.05,
          }
        )
      );

    outerRing2.rotation.x =
      Math.PI / 2;

    outerRing2.position.set(
      0,
      -0.44,
      1.5
    );

    arena.add(
      outerRing2
    );

    /* =====================================================
       MOUSE
    ===================================================== */

    const mouse =
      new THREE.Vector2(
        -10,
        -10
      );

    // Cursor position drives hover raycasting only — it no longer
    // shifts the camera (parallax removed).
    const handleMouseMove =
      (event: MouseEvent) => {
        const rect =
          container.getBoundingClientRect();

        const x =
          ((event.clientX -
            rect.left) /
            rect.width) *
            2 -
          1;

        const y =
          -(
            ((event.clientY -
              rect.top) /
              rect.height) *
              2 -
            1
          );

        mouse.x = x;
        mouse.y = y;
      };

    container.addEventListener(
      'mousemove',
      handleMouseMove
    );

    /* =====================================================
       RAYCASTING
    ===================================================== */

    const raycaster =
      new THREE.Raycaster();

    let lastHoveredId:
      | string
      | null = null;

    const checkIntersection =
      () => {
        raycaster.setFromCamera(
          mouse,
          camera
        );

        const hits =
          raycaster.intersectObjects(
            interactiveMeshes,
            false
          );

        if (hits.length > 0) {
          const hit =
            hits[0]
              .object as THREE.Mesh;

          const data =
            hit.userData as ActiveNodeData;

          if (
            data &&
            data.id !==
              lastHoveredId
          ) {
            lastHoveredId =
              data.id;

            setHoveredNode(
              data
            );

            playHover();
          }
        } else {
          if (
            lastHoveredId !==
            null
          ) {
            lastHoveredId =
              null;

            setHoveredNode(
              null
            );
          }
        }
      };

    /* =====================================================
       ANIMATION
    ===================================================== */

    const clock =
      new THREE.Clock();

    let animationFrameId = 0;

    const animate =
      () => {
        const elapsed =
          clock.getElapsedTime();

        {
          /* -----------------------------------------------
             CAMERA
          ----------------------------------------------- */

          camera.position.x =
            targetCamera.x +
            Math.sin(
              elapsed * 0.11
            ) *
              0.65;

          camera.position.y =
            targetCamera.y +
            Math.sin(
              elapsed * 0.15
            ) *
              0.18;

          camera.position.z =
            targetCamera.z +
            Math.cos(
              elapsed * 0.09
            ) *
              0.38;

          camera.lookAt(
            cameraLookAt
          );

          /* -----------------------------------------------
             ENTIRE ARENA MOVEMENT
          ----------------------------------------------- */

          arena.rotation.y =
            Math.sin(
              elapsed * 0.08
            ) *
              0.045;

          arena.position.y =
            Math.sin(
              elapsed * 0.55
            ) *
              0.018;

          /* -----------------------------------------------
             PARTICLES
          ----------------------------------------------- */

          const posAttr =
            particleGeometry.getAttribute(
              'position'
            ) as THREE.BufferAttribute;

          for (
            let i = 0;
            i < particleCount;
            i++
          ) {
            posAttr.array[
              i * 3 + 1
            ] +=
              particleSpeeds[i] *
              0.35;

            // drift X/Z
            posAttr.array[
              i * 3
            ] +=
              Math.sin(
                elapsed * 0.3 +
                  particlePhases[
                    i
                  ]
              ) *
              0.002;

            // reset when too high
            if (
              posAttr.array[
                i * 3 + 1
              ] > 10
            ) {
              posAttr.array[
                i * 3 + 1
              ] = -0.5;
            }
          }

          posAttr.needsUpdate =
            true;

          /* -----------------------------------------------
             HOLOGRAPHIC ARCS
          ----------------------------------------------- */

          holoArcs.forEach(
            arc => {
              arc.mesh.rotation.z +=
                arc.speed * 0.008;
            }
          );

          /* -----------------------------------------------
             OUTER RINGS
          ----------------------------------------------- */

          outerRing.rotation.z =
            elapsed * 0.02;

          outerRing2.rotation.z =
            -elapsed * 0.015;

          /* -----------------------------------------------
             OPERATOR
          ----------------------------------------------- */

          operatorGroup.position.y =
            Math.sin(
              elapsed * 0.8
            ) *
              0.035;

          operatorGroup.rotation.y =
            Math.sin(
              elapsed * 0.16
            ) *
              0.055;

          /* -----------------------------------------------
             OPERATOR RING
          ----------------------------------------------- */

          operatorRing.rotation.z =
            elapsed * 0.12;

          /* -----------------------------------------------
             OPERATOR PC
          ----------------------------------------------- */

          operatorPC.rotation.y =
            Math.sin(
              elapsed * 0.3
            ) *
              0.04;

          operatorPC.position.y =
            1.0 +
            Math.sin(
              elapsed * 0.9
            ) *
              0.025;

          /* -----------------------------------------------
             RIG ORBIT — every PC sweeps slowly side to side
             around the operator. Bounded, not continuous: the
             camera has a narrow, forward-facing FOV, so a full
             360° spin would walk half the rigs out of frame
             (and out of raycast reach) for most of the cycle.
             A back-and-forth sweep keeps every rig inside the
             visible/hoverable frustum at all times.
          ----------------------------------------------- */

          rigOrbitGroup.rotation.y =
            Math.sin(elapsed * 0.09) * 0.4;

          /* -----------------------------------------------
             RIG MOTION
          ----------------------------------------------- */

          rigGroups.forEach(
            (
              rig,
              index
            ) => {
              const phase =
                index * 0.47;

              /* floating */

              rig.position.y =
                Math.sin(
                  elapsed * 0.7 +
                    phase
                ) *
                  0.035;

              /* subtle rotation */

              rig.rotation.y =
                Math.sin(
                  elapsed * 0.28 +
                    phase
                ) *
                  0.025;

              /* tiny breathing */

              const scale =
                1 +
                Math.sin(
                  elapsed * 0.8 +
                    phase
                ) *
                  0.006;

              rig.scale.setScalar(
                scale
              );
            }
          );

          /* -----------------------------------------------
             DATA PACKETS
          ----------------------------------------------- */

          networkPackets.forEach(
            packet => {
              packet.progress +=
                packet.speed *
                0.016;

              if (
                packet.progress >
                1
              ) {
                packet.progress = 0;
              }

              const point =
                packet.curve.getPointAt(
                  packet.progress
                );

              packet.mesh.position.copy(
                point
              );

              const packetScale =
                0.8 +
                Math.sin(
                  elapsed * 7
                ) *
                  0.18;

              packet.mesh.scale.setScalar(
                packetScale
              );
            }
          );

          /* -----------------------------------------------
             FLOOR — extremely subtle light movement
             (drift the two colored point lights a hair so
             their specular highlights creep across the
             reflective floor instead of sitting static)
          ----------------------------------------------- */

          cyanLight.position.x =
            -6 +
            Math.sin(elapsed * 0.05) * 0.4;

          cyanLight.position.z =
            -2 +
            Math.cos(elapsed * 0.045) * 0.4;

          limeLight.position.x =
            5 +
            Math.cos(elapsed * 0.04) * 0.35;

          limeLight.position.z =
            4 +
            Math.sin(elapsed * 0.05) * 0.35;
        }

        /* -----------------------------------------------
           STATUS/GLOW PULSING
        ----------------------------------------------- */

        const operatorRingMaterial =
          operatorRing.material as THREE.MeshBasicMaterial;

        operatorRingMaterial.opacity =
          0.52 +
          Math.sin(
            elapsed * 1.8
          ) *
            0.12;

        pulseMaterials.forEach(
          ({
            material,
            base,
            phase,
          }) => {
            material.opacity =
              base *
              (0.72 +
                Math.sin(
                  elapsed *
                    1.8 +
                    phase
                ) *
                  0.28);
          }
        );

        networkLines.forEach(
          ({
            material,
            phase,
          }) => {
            material.opacity =
              0.25 +
              Math.sin(
                elapsed *
                  1.4 +
                  phase
              ) *
                0.1;
          }
        );

        operatorLight.intensity =
          3.2 +
          Math.sin(
            elapsed * 2
          ) *
            0.4;

        cyanLight.intensity =
          3.5 +
          Math.sin(
            elapsed * 1.5
          ) *
            0.5;

        limeLight.intensity =
          4.0 +
          Math.sin(
            elapsed * 1.7
          ) *
            0.5;

        checkIntersection();

        composer.render();

        animationFrameId =
          requestAnimationFrame(
            animate
          );
      };

    animate();

    /* =====================================================
       RESIZE
    ===================================================== */

    const handleResize =
      () => {
        const newWidth =
          container.clientWidth;

        const newHeight =
          container.clientHeight;

        if (
          newWidth <= 0 ||
          newHeight <= 0
        ) {
          return;
        }

        camera.aspect =
          newWidth /
          newHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
          newWidth,
          newHeight
        );

        composer.setSize(
          newWidth,
          newHeight
        );

        bloomPass.resolution.set(
          newWidth,
          newHeight
        );
      };

    window.addEventListener(
      'resize',
      handleResize
    );

    /* =====================================================
       CLEANUP
    ===================================================== */

    return () => {
      cancelAnimationFrame(
        animationFrameId
      );

      window.removeEventListener(
        'resize',
        handleResize
      );

      container.removeEventListener(
        'mousemove',
        handleMouseMove
      );

      composer.dispose();
      renderer.dispose();

      scene.traverse(
        object => {
          if (
            object instanceof
            THREE.Mesh
          ) {
            object.geometry.dispose();

            if (
              Array.isArray(
                object.material
              )
            ) {
              object.material.forEach(
                material =>
                  material.dispose()
              );
            } else {
              object.material.dispose();
            }
          }
        }
      );

      if (
        container.contains(
          renderer.domElement
        )
      ) {
        container.removeChild(
          renderer.domElement
        );
      }
    };
  }, []);

  /* =======================================================
     WEBGL FALLBACK
  ======================================================= */

  if (!webGlSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#08090B] border border-white/10 rounded-xl p-6 text-sm text-arena-muted">
        3D preview unavailable —
        hardware acceleration disabled
      </div>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div
      ref={containerRef}
      className="group relative w-full h-[380px] sm:h-[440px] lg:h-[500px] rounded-2xl overflow-hidden bg-[#060810]"
      style={{
        boxShadow:
          '0 0 0 1px rgba(204,255,0,0.08), 0 0 60px -15px rgba(204,255,0,0.08), 0 25px 50px -12px rgba(0,0,0,0.6)',
      }}
    >
      {/* SCAN-LINE OVERLAY */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* VIGNETTE */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 45%, transparent 40%, rgba(6,8,16,0.55) 100%)',
        }}
      />

      {/* TOP EDGE GLOW */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] z-20"
        style={{
          background:
            'linear-gradient(90deg, transparent 5%, rgba(204,255,0,0.25) 30%, rgba(0,234,255,0.2) 70%, transparent 95%)',
        }}
      />

      {/* TOP LEFT — LIVE INDICATOR */}
      <div className="absolute top-5 left-5 z-20 pointer-events-none">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/[0.06]">
          <span
            className="relative flex h-2 w-2"
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-arena-lime opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-arena-lime shadow-[0_0_8px_rgba(204,255,0,0.9)]" />
          </span>

          <span className="text-[11px] tracking-wide text-white/50 font-medium" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
            {stationsInfo.length} RIGS
            <span className="text-arena-lime/70 ml-1.5">LIVE</span>
          </span>
        </div>
      </div>

      {/* TOP RIGHT — SYSTEM LABEL */}
      <div className="absolute top-5 right-5 z-20 pointer-events-none text-right">
        <div
          className="px-3 py-2 rounded-lg bg-black/30 backdrop-blur-md border border-white/[0.06]"
        >
          <div
            className="text-[8px] tracking-[0.35em] text-white/25 font-medium mb-0.5"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            ARENAOS
          </div>
          <div
            className="text-[11px] tracking-wider text-white/50 font-medium"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            OPERATOR NETWORK
          </div>
        </div>
      </div>

      {/* HOVER CARD */}
      {hoveredNode && (
        <div
          className="absolute bottom-5 left-5 z-30 w-[300px] max-w-[calc(100%-40px)] rounded-xl overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, rgba(11,13,16,0.97) 0%, rgba(8,10,14,0.98) 100%)',
            boxShadow:
              '0 0 0 1px rgba(204,255,0,0.08), 0 0 40px -10px rgba(204,255,0,0.12), 0 25px 50px -12px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(20px)',
          }}
          onClick={() =>
            playClick()
          }
        >
          {/* card accent line */}
          <div
            className="h-[1px]"
            style={{
              background:
                hoveredNode.status === 'IN_SESSION'
                  ? 'linear-gradient(90deg, transparent 0%, rgba(204,255,0,0.5) 20%, rgba(204,255,0,0.5) 80%, transparent 100%)'
                  : hoveredNode.status === 'AVAILABLE'
                  ? 'linear-gradient(90deg, transparent 0%, rgba(0,234,255,0.5) 20%, rgba(0,234,255,0.5) 80%, transparent 100%)'
                  : hoveredNode.status === 'BILLING'
                  ? 'linear-gradient(90deg, transparent 0%, rgba(255,160,0,0.5) 20%, rgba(255,160,0,0.5) 80%, transparent 100%)'
                  : 'linear-gradient(90deg, transparent 0%, rgba(100,100,120,0.3) 20%, rgba(100,100,120,0.3) 80%, transparent 100%)',
            }}
          />

          <div className="p-4">
            <div className="flex justify-between items-start gap-3 border-b border-white/[0.06] pb-3 mb-3">
              <div className="min-w-0">
                <div
                  className="text-[8px] tracking-[0.25em] text-white/25 uppercase mb-1"
                  style={{ fontFamily: '"JetBrains Mono", monospace' }}
                >
                  {hoveredNode.zone}
                </div>

                <div className="text-sm font-semibold text-white/90">
                  {hoveredNode.name}
                </div>
              </div>

              <span
                className={`shrink-0 text-[8px] tracking-wider px-2.5 py-1 rounded-md font-medium ${
                  hoveredNode.status ===
                  'IN_SESSION'
                    ? 'bg-arena-lime/10 text-arena-lime border border-arena-lime/20'
                    : hoveredNode.status ===
                      'AVAILABLE'
                    ? 'bg-arena-cyan/10 text-arena-cyan border border-arena-cyan/20'
                    : hoveredNode.status ===
                      'BILLING'
                    ? 'bg-orange-500/10 text-orange-400 border border-orange-400/20'
                    : 'bg-white/5 text-arena-muted border border-white/10'
                }`}
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
              >
                {hoveredNode.status
                  .replace(
                    '_',
                    ' '
                  )
                  .toLowerCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div
                  className="text-[8px] tracking-[0.2em] text-white/20 uppercase mb-0.5"
                  style={{ fontFamily: '"JetBrains Mono", monospace' }}
                >
                  GPU
                </div>

                <div className="text-white/75 truncate text-[11px]" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                  {hoveredNode.gpu}
                </div>
              </div>

              <div>
                <div
                  className="text-[8px] tracking-[0.2em] text-white/20 uppercase mb-0.5"
                  style={{ fontFamily: '"JetBrains Mono", monospace' }}
                >
                  RATE
                </div>

                <div className="text-arena-lime/90 text-[11px]" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                  {hoveredNode.rate}
                </div>
              </div>

              <div>
                <div
                  className="text-[8px] tracking-[0.2em] text-white/20 uppercase mb-0.5"
                  style={{ fontFamily: '"JetBrains Mono", monospace' }}
                >
                  USER
                </div>

                <div className="text-white/75 truncate text-[11px]" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                  @{hoveredNode.user}
                </div>
              </div>

              <div>
                <div
                  className="text-[8px] tracking-[0.2em] text-white/20 uppercase mb-0.5"
                  style={{ fontFamily: '"JetBrains Mono", monospace' }}
                >
                  NETWORK
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-arena-cyan shadow-[0_0_4px_rgba(0,234,255,0.7)]" />
                  <span className="text-arena-cyan/90 text-[11px]" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    CONNECTED
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM RIGHT */}
      <div className="absolute bottom-5 right-5 z-20 pointer-events-none hidden sm:block text-right">
        <div
          className="px-3 py-2 rounded-lg bg-black/30 backdrop-blur-md border border-white/[0.06]"
        >
          <div
            className="text-[8px] tracking-[0.35em] text-white/20 font-medium mb-0.5"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            ONE OPERATOR
          </div>
          <div
            className="text-[11px] tracking-wider text-white/40 font-medium"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            TOTAL CONTROL
          </div>
        </div>
      </div>

      {/* BOTTOM EDGE GLOW */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px] z-20"
        style={{
          background:
            'linear-gradient(90deg, transparent 10%, rgba(0,234,255,0.15) 40%, rgba(204,255,0,0.12) 60%, transparent 90%)',
        }}
      />
    </div>
  );
};