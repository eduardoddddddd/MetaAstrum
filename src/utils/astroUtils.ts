import { PlanetPosition } from '../types';

export const SIGNS_ORDER = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
] as const;

export const ASPECT_TYPES = [
  { name: 'Conjunción', angle: 0, orb: 8 },
  { name: 'Sextil', angle: 60, orb: 6 },
  { name: 'Cuadratura', angle: 90, orb: 7 },
  { name: 'Trígono', angle: 120, orb: 8 },
  { name: 'Oposición', angle: 180, orb: 8 },
];

export function getLongitude(sign: string, degree: number, minute: number): number {
  return SIGNS_ORDER.indexOf(sign as typeof SIGNS_ORDER[number]) * 30 + degree + minute / 60;
}

export function getPlanetLongitude(p: PlanetPosition): number {
  return getLongitude(p.sign, p.degree, p.minute);
}

export function getAngularDistance(long1: number, long2: number): number {
  const diff = Math.abs(long1 - long2);
  return Math.min(diff, 360 - diff);
}

export function getAspect(long1: number, long2: number): { type: string; orb: number } | null {
  const dist = getAngularDistance(long1, long2);
  for (const asp of ASPECT_TYPES) {
    const orb = Math.abs(dist - asp.angle);
    if (orb <= asp.orb) {
      return { type: asp.name, orb: parseFloat(orb.toFixed(1)) };
    }
  }
  return null;
}

export function getNearestAspect(long1: number, long2: number): { type: string; orb: number } {
  const dist = getAngularDistance(long1, long2);
  let nearest = { type: ASPECT_TYPES[0].name, orb: Math.abs(dist - ASPECT_TYPES[0].angle) };
  for (const asp of ASPECT_TYPES) {
    const orb = Math.abs(dist - asp.angle);
    if (orb < nearest.orb) {
      nearest = { type: asp.name, orb: orb };
    }
  }
  return { type: nearest.type, orb: parseFloat(nearest.orb.toFixed(1)) };
}

export function getRemainingDegrees(long1: number, long2: number, aspectAngle: number): number {
  const dist = getAngularDistance(long1, long2);
  return parseFloat(Math.abs(dist - aspectAngle).toFixed(1));
}
