import { ChartData, FirdariaPeriod, ProfectionData, Planet, ZodiacSign } from './types';
import { calculateChart } from './services/astrologyEngine';

const SIGNS: ZodiacSign[] = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

export const getRealNatalChart = (date: Date, lat: number, lon: number): ChartData => {
  return calculateChart(date, lat, lon);
};

export const getFirdaria = (birthDate: Date, isDayBirth: boolean): FirdariaPeriod[] => {
  const dayOrder: Planet[] = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'];
  const nightOrder: Planet[] = ['Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury'];
  const order = isDayBirth ? dayOrder : nightOrder;
  
  const periods: FirdariaPeriod[] = [];
  let currentDate = new Date(birthDate);
  
  order.forEach((planet) => {
    const duration = planet === 'Sun' ? 10 : planet === 'Venus' ? 8 : planet === 'Mercury' ? 13 : planet === 'Moon' ? 9 : planet === 'Saturn' ? 11 : planet === 'Jupiter' ? 12 : 7;
    const startDate = new Date(currentDate);
    currentDate.setFullYear(currentDate.getFullYear() + duration);
    periods.push({
      planet,
      startDate: startDate.toISOString(),
      endDate: currentDate.toISOString(),
    });
  });
  
  return periods;
};

export const getProfections = (birthDate: Date, targetDate: Date, ascendantSign: ZodiacSign): ProfectionData => {
  const age = targetDate.getFullYear() - birthDate.getFullYear();
  const startIndex = SIGNS.indexOf(ascendantSign);
  const currentSignIndex = (startIndex + age) % 12;
  const yearSign = SIGNS[currentSignIndex];
  
  const lords: Record<ZodiacSign, Planet> = {
    Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon',
    Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: 'Mars',
    Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter'
  };
  
  return {
    age,
    yearSign,
    lordOfTheYear: lords[yearSign],
    theme: `Activación de la Casa ${(age % 12) + 1} y el signo de ${yearSign}.`,
  };
};

export const getProgressions = (birthDate: Date, targetDate: Date, lat: number, lon: number): ChartData => {
  const ageInDays = (targetDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24);
  const progressedDate = new Date(birthDate.getTime() + ageInDays * 24 * 60 * 60 * 1000 / 365.25);
  return calculateChart(progressedDate, lat, lon);
};
