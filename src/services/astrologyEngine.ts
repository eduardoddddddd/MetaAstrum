import * as Astronomy from 'astronomy-engine';
import { Planet, ZodiacSign, PlanetPosition, HouseCusp, ChartData } from '../types';

const PLANETS_MAP: Record<string, Astronomy.Body> = {
  'Sun': Astronomy.Body.Sun,
  'Moon': Astronomy.Body.Moon,
  'Mercury': Astronomy.Body.Mercury,
  'Venus': Astronomy.Body.Venus,
  'Mars': Astronomy.Body.Mars,
  'Jupiter': Astronomy.Body.Jupiter,
  'Saturn': Astronomy.Body.Saturn,
  'Uranus': Astronomy.Body.Uranus,
  'Neptune': Astronomy.Body.Neptune,
  'Pluto': Astronomy.Body.Pluto,
};

const SIGNS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export function getZodiacSign(longitude: number): { sign: ZodiacSign; degree: number; minute: number } {
  const normalized = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const degreeTotal = normalized % 30;
  const degree = Math.floor(degreeTotal);
  const minute = Math.floor((degreeTotal - degree) * 60);
  return { sign: SIGNS[signIndex], degree, minute };
}

export function calculateChart(date: Date, lat: number, lon: number): ChartData {
  const observer = new Astronomy.Observer(lat, lon, 0);
  const jdate = Astronomy.MakeTime(date);
  
  const planets: PlanetPosition[] = Object.entries(PLANETS_MAP).map(([name, body]) => {
    const equat = Astronomy.Equator(body, jdate, observer, true, true);
    const ecliptic = Astronomy.Ecliptic(equat.vec);
    const { sign, degree, minute } = getZodiacSign(ecliptic.elon);
    
    // Check retrograde by comparing longitude 1 hour later
    const jdate2 = Astronomy.MakeTime(new Date(date.getTime() + 3600000));
    const equat2 = Astronomy.Equator(body, jdate2, observer, true, true);
    const ecliptic2 = Astronomy.Ecliptic(equat2.vec);
    // Normalize the diff to [-180, 180] to handle the 0°/360° boundary correctly
    let lonDiff = ecliptic2.elon - ecliptic.elon;
    if (lonDiff > 180) lonDiff -= 360;
    if (lonDiff < -180) lonDiff += 360;
    const retrograde = lonDiff < 0;

    return {
      planet: name as Planet,
      sign,
      degree,
      minute,
      retrograde,
      house: 0 // Will be calculated after houses
    };
  });

  // Sidereal time at Greenwich
  const gst = Astronomy.SiderealTime(jdate);
  const lst = (gst + lon / 15) % 24;
  const ramc = lst * 15; // RAMC in degrees

  // Obliquity of ecliptic (Meeus formula, more accurate than hardcoded constant)
  const T = (jdate.tt - 2451545.0) / 36525.0; // Julian centuries from J2000.0
  const obl = 23.439291111 - 0.013004167 * T - 0.0000001639 * T * T + 0.0000005036 * T * T * T;

  const ramcRad = ramc * Math.PI / 180;
  const oblRad = obl * Math.PI / 180;
  const latRad = lat * Math.PI / 180;

  // Ascendant — Jean Meeus "Astronomical Algorithms":
  // tan(ASC) = -cos(RAMC) / (sin(RAMC)*cos(ε) + tan(φ)*sin(ε))
  // atan2 gives one of two solutions (ASC or DESC). Pick the one whose RA ∈ [RAMC, RAMC+180°).
  const num = -Math.cos(ramcRad);
  const den = Math.sin(ramcRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad);
  let ascDeg = (Math.atan2(num, den) * 180 / Math.PI + 360) % 360;
  // Convert ecliptic longitude → Right Ascension
  const eclToRA = (lambda: number) => {
    const l = lambda * Math.PI / 180;
    return ((Math.atan2(Math.sin(l) * Math.cos(oblRad), Math.cos(l)) * 180 / Math.PI) + 360) % 360;
  };
  // If the candidate's RA is NOT in [RAMC, RAMC+180°), flip to the other solution
  if ((eclToRA(ascDeg) - ramc + 360) % 360 >= 180) ascDeg = (ascDeg + 180) % 360;

  // MC — correct formula: atan2(sin(RAMC), cos(RAMC)*cos(ε)) preserves quadrant automatically
  const mcDeg = ((Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(oblRad)) * 180 / Math.PI) + 360) % 360;

  const ascInfo = getZodiacSign(ascDeg);

  // Equal House System (starting from Ascendant)
  const houses: HouseCusp[] = Array.from({ length: 12 }).map((_, i) => {
    const cuspDeg = (ascDeg + i * 30) % 360;
    const { sign, degree, minute } = getZodiacSign(cuspDeg);
    return { house: i + 1, sign, degree, minute };
  });

  // Assign houses to planets
  planets.forEach(p => {
    const pLong = SIGNS.indexOf(p.sign) * 30 + p.degree + p.minute / 60;
    let relativePos = (pLong - ascDeg + 360) % 360;
    p.house = Math.floor(relativePos / 30) + 1;
  });

  return {
    planets,
    houses,
    aspects: calculateAspects(planets),
    ascendant: ascInfo,
    mc: getZodiacSign(mcDeg),
  };
}

function calculateAspects(planets: PlanetPosition[]): any[] {
  const aspects: any[] = [];
  const types = [
    { name: 'Conjunction', angle: 0, orb: 8 },
    { name: 'Sextile', angle: 60, orb: 6 },
    { name: 'Square', angle: 90, orb: 7 },
    { name: 'Trine', angle: 120, orb: 8 },
    { name: 'Opposition', angle: 180, orb: 8 },
  ];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      const long1 = SIGNS.indexOf(p1.sign) * 30 + p1.degree + p1.minute / 60;
      const long2 = SIGNS.indexOf(p2.sign) * 30 + p2.degree + p2.minute / 60;
      const diff = Math.abs(long1 - long2);
      const dist = Math.min(diff, 360 - diff);

      for (const type of types) {
        const orb = Math.abs(dist - type.angle);
        if (orb <= type.orb) {
          aspects.push({
            planet1: p1.planet,
            planet2: p2.planet,
            aspect: type.name,
            orb: parseFloat(orb.toFixed(1))
          });
        }
      }
    }
  }
  return aspects;
}
