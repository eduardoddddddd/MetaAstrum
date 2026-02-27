export type Planet = 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto' | 'North Node' | 'South Node';
export type ZodiacSign = 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export interface PlanetPosition {
  planet: Planet;
  sign: ZodiacSign;
  degree: number;
  minute: number;
  retrograde: boolean;
  house: number;
}

export interface HouseCusp {
  house: number;
  sign: ZodiacSign;
  degree: number;
  minute: number;
}

export interface Aspect {
  planet1: Planet;
  planet2: Planet;
  aspect: 'Conjunction' | 'Sextile' | 'Square' | 'Trine' | 'Opposition';
  orb: number;
}

export interface ChartData {
  planets: PlanetPosition[];
  houses: HouseCusp[];
  aspects: Aspect[];
  ascendant: { sign: ZodiacSign; degree: number; minute: number };
  mc: { sign: ZodiacSign; degree: number; minute: number };
}

export interface FirdariaPeriod {
  planet: Planet | 'Nodes';
  startDate: string;
  endDate: string;
  subPeriods?: FirdariaPeriod[];
}

export interface ProfectionData {
  age: number;
  yearSign: ZodiacSign;
  lordOfTheYear: Planet;
  theme: string;
}
