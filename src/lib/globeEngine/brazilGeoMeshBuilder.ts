/**
 * brazilGeoMeshBuilder - Construtor de Geometrias 3D dos Estados Brasileiros
 * Gera as linhas de fronteira esféricas e meshes translúcidas com cores regionais.
 */
import * as THREE from 'three';
import { BRAZIL_STATES_GEO } from '../../data/brazilGeoCoordinates';
import { latLonToSphereVector3, SCENE_GLOBE_RADIUS } from './index';

export type BorderRegionFilter = 'all' | 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul';

export function buildBorderPoints(features: any[], regionFilter: BorderRegionFilter = 'all'): number[] {
  const points: number[] = [];
  features.forEach((feat: any) => {
    const rawId = feat.properties?.id || feat.properties?.sigla || feat.id;
    const uf = typeof rawId === 'string' ? rawId.replace(/^BR/i, '').toUpperCase() : '';
    const stateGeo = uf ? BRAZIL_STATES_GEO[uf] : null;
    if (regionFilter !== 'all' && stateGeo && stateGeo.region !== regionFilter) {
      return;
    }
    const geom = feat.geometry;
    if (!geom) return;

    const processPolygon = (coords: number[][]) => {
      for (let i = 0; i < coords.length - 1; i++) {
        const [lon1, lat1] = coords[i];
        const [lon2, lat2] = coords[i + 1];
        const p1 = latLonToSphereVector3(lat1, lon1, SCENE_GLOBE_RADIUS * 1.012);
        const p2 = latLonToSphereVector3(lat2, lon2, SCENE_GLOBE_RADIUS * 1.012);
        points.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
      }
    };

    if (geom.type === 'Polygon') {
      geom.coordinates.forEach((ring: any) => processPolygon(ring));
    } else if (geom.type === 'MultiPolygon') {
      geom.coordinates.forEach((poly: any) => {
        poly.forEach((ring: any) => processPolygon(ring));
      });
    }
  });
  return points;
}

export function buildBrazilStateOverlaysMesh(
  features: any[],
  regionFilter: BorderRegionFilter = 'all'
): THREE.Mesh | null {
  const positions: number[] = [];
  const colors: number[] = [];

  const REGION_COLORS: Record<string, { r: number; g: number; b: number }> = {
    Norte: { r: 0.035, g: 0.52, b: 0.35 },
    Nordeste: { r: 0.96, g: 0.62, b: 0.15 },
    'Centro-Oeste': { r: 0.92, g: 0.76, b: 0.12 },
    Sudeste: { r: 0.01, g: 0.52, b: 0.78 },
    Sul: { r: 0.66, g: 0.33, b: 0.97 },
  };

  const DEFAULT_GREEN = { r: 0.02, g: 0.38, b: 0.22 };

  features.forEach((feat: any) => {
    const rawId = feat.properties?.id || feat.properties?.sigla || feat.id;
    const uf = typeof rawId === 'string' ? rawId.replace(/^BR/i, '').toUpperCase() : '';
    const stateGeo = uf ? BRAZIL_STATES_GEO[uf] : null;
    const regionName = stateGeo?.region || 'Sudeste';
    let c = DEFAULT_GREEN;
    if (regionFilter !== 'all') {
      c = REGION_COLORS[regionName] || DEFAULT_GREEN;
    }

    const geom = feat.geometry;
    if (!geom) return;

    const processRing = (ring: number[][]) => {
      if (ring.length < 3) return;
      const v2s = ring.map((pt) => new THREE.Vector2(pt[0], pt[1]));
      try {
        const triangles = THREE.ShapeUtils.triangulateShape(v2s, []);
        for (let i = 0; i < triangles.length; i++) {
          const tri = triangles[i];
          for (let j = 0; j < 3; j++) {
            const idx = tri[j];
            const [lon, lat] = ring[idx];
            const p = latLonToSphereVector3(lat, lon, SCENE_GLOBE_RADIUS * 1.006);
            positions.push(p.x, p.y, p.z);
            colors.push(c.r, c.g, c.b);
          }
        }
      } catch {
        // Ignora polígonos degenerados
      }
    };

    if (geom.type === 'Polygon') {
      processRing(geom.coordinates[0]);
    } else if (geom.type === 'MultiPolygon') {
      geom.coordinates.forEach((poly: any) => {
        if (poly && poly[0]) processRing(poly[0]);
      });
    }
  });

  if (positions.length === 0) return null;

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();

  const mat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
    depthTest: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.renderOrder = 16;
  return mesh;
}
