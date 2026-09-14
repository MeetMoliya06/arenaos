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

    const reducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

    /* =====================================================
       SCENE
    ===================================================== */

    const scene =
      new THREE.Scene();

    scene.background =
      new THREE.Color(
        0x050608
      );

    scene.fog =
      new THREE.FogExp2(
        0x050608,
        0.035
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
        46,
        width / height,
        0.1,
        120
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
        4.4,
        13.5
      );

    const cameraLookAt =
      new THREE.Vector3(
        0,
        1.0,
        0
      );

    camera.position.copy(
      reducedMotion
        ? targetCamera
        : startCamera
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
      0x050608,
      1
    );

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    renderer.toneMapping =
      THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure =
      1.15;

    container.appendChild(
      renderer.domElement
    );

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
          40,
          40
        ),
        new THREE.MeshStandardMaterial(
          {
            color: 0x07090c,
            roughness: 0.38,
            metalness: 0.78,
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
        40,
        40,
        0x20261f,
        0x101318
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
                color: 0x080a0d,
                roughness: 0.28,
                metalness: 0.82,
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
                    ? 0.7
                    : 0.12,
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
                color: 0x111419,
                roughness: 0.28,
                metalness: 0.78,
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
                color: 0x080a0d,
                roughness: 0.22,
                metalness: 0.72,
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
                    ? visual.glowOpacity
                    : 0.07,
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
                color: 0x0b0e12,
                roughness: 0.27,
                metalness: 0.74,
                emissive: 0x020304,
                emissiveIntensity: 0.6,
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
                    ? 0.12
                    : 0.025,
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
                    ? 0.9
                    : 0.12,
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
                    opacity: 0.11,
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
              base: 0.11,
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
                  ? 0.16
                  : 0.045,
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
                0.045,
                10,
                10
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
        0.3
      );

    scene.add(
      ambient
    );

    const mainLight =
      new THREE.DirectionalLight(
        0xffffff,
        1.0
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
        2.0,
        20
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
        2.2,
        20
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
        1.8,
        10
      );

    operatorLight.position.set(
      0,
      3,
      1
    );

    scene.add(
      operatorLight
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

        if (!reducedMotion) {
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
           ALWAYS-ON PULSING — kept even under
           prefers-reduced-motion. These are gentle opacity/
           intensity flickers, not the large camera/rotation/
           orbit motion that setting exists to suppress, so the
           scene still reads as "live" instead of freezing dead.
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
              0.10 +
              Math.sin(
                elapsed *
                  1.4 +
                  phase
              ) *
                0.045;
          }
        );

        operatorLight.intensity =
          1.65 +
          Math.sin(
            elapsed * 2
          ) *
            0.25;

        cyanLight.intensity =
          1.8 +
          Math.sin(
            elapsed * 1.5
          ) *
            0.2;

        limeLight.intensity =
          2.0 +
          Math.sin(
            elapsed * 1.7
          ) *
            0.25;

        checkIntersection();

        renderer.render(
          scene,
          camera
        );

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
      className="relative w-full h-[500px] sm:h-[560px] lg:h-[680px] rounded-xl overflow-hidden border border-white/10 bg-[#050608]"
    >
      {/* TOP LEFT */}

      <div className="absolute top-5 left-5 z-20 pointer-events-none flex items-center gap-2 text-xs text-arena-muted">
        <span className="w-1.5 h-1.5 rounded-full bg-arena-lime shadow-[0_0_8px_rgba(204,255,0,0.8)]" />

        <span>
          {stationsInfo.length} rigs · live
        </span>
      </div>

      {/* TOP RIGHT */}

      <div className="absolute top-5 right-5 z-20 pointer-events-none text-right">
        <div className="text-[9px] tracking-[0.28em] text-arena-muted">
          ARENAOS
        </div>

        <div className="text-xs text-white/60">
          OPERATOR NETWORK
        </div>
      </div>

      {/* HOVER CARD */}

      {hoveredNode && (
        <div
          className="absolute bottom-5 left-5 z-30 w-[300px] max-w-[calc(100%-40px)] bg-[#0b0d10]/95 border border-white/10 rounded-xl p-4 backdrop-blur-xl shadow-2xl"
          onClick={() =>
            playClick()
          }
        >
          <div className="flex justify-between items-start gap-3 border-b border-white/10 pb-3 mb-3">
            <div className="min-w-0">
              <div className="text-[9px] tracking-wider text-arena-muted uppercase">
                {hoveredNode.zone}
              </div>

              <div className="text-base font-semibold text-white">
                {hoveredNode.name}
              </div>
            </div>

            <span
              className={`shrink-0 text-[9px] px-2 py-1 rounded-md ${
                hoveredNode.status ===
                'IN_SESSION'
                  ? 'bg-arena-lime/10 text-arena-lime'
                  : hoveredNode.status ===
                    'AVAILABLE'
                  ? 'bg-arena-cyan/10 text-arena-cyan'
                  : hoveredNode.status ===
                    'BILLING'
                  ? 'bg-orange-500/10 text-orange-400'
                  : 'bg-white/5 text-arena-muted'
              }`}
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
              <div className="text-arena-subtle">
                GPU
              </div>

              <div className="text-white truncate">
                {hoveredNode.gpu}
              </div>
            </div>

            <div>
              <div className="text-arena-subtle">
                RATE
              </div>

              <div className="text-arena-lime">
                {hoveredNode.rate}
              </div>
            </div>

            <div>
              <div className="text-arena-subtle">
                USER
              </div>

              <div className="text-white truncate">
                @{hoveredNode.user}
              </div>
            </div>

            <div>
              <div className="text-arena-subtle">
                NETWORK
              </div>

              <div className="text-arena-cyan">
                CONNECTED
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM RIGHT */}

      <div className="absolute bottom-5 right-5 z-20 pointer-events-none hidden sm:block text-right">
        <div className="text-[9px] tracking-[0.28em] text-arena-muted">
          ONE OPERATOR
        </div>

        <div className="text-xs text-white/50">
          TOTAL CONTROL
        </div>
      </div>
    </div>
  );
};