export interface VinDecodedInfo {
  vin: string;
  isValid: boolean;
  country: string;
  manufacturer: string;
  suggestedMake: string;
  suggestedModel: string;
  modelYear?: number;
  engineType?: string;
  plant?: string;
  matchedVehiclePattern?: string;
  error?: string;
}

// VIN model year encoding (10th character)
const YEAR_CODES: Record<string, number> = {
  'A': 2010, 'B': 2011, 'C': 2012, 'D': 2013, 'E': 2014,
  'F': 2015, 'G': 2016, 'H': 2017, 'J': 2018, 'K': 2019,
  'L': 2020, 'M': 2021, 'N': 2022, 'P': 2023, 'R': 2024,
  'S': 2025, 'T': 2026, '1': 2001, '2': 2002, '3': 2003,
  '4': 2004, '5': 2005, '6': 2006, '7': 2007, '8': 2008,
  '9': 2009,
};

export function decodeVin(rawVin: string): VinDecodedInfo {
  const vin = rawVin.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

  if (vin.length !== 17) {
    return {
      vin,
      isValid: false,
      country: 'Noma\'lum',
      manufacturer: 'Noma\'lum',
      suggestedMake: 'Noma\'lum',
      suggestedModel: 'Noma\'lum',
      error: 'VIN kod aynan 17 ta belgidan iborat bo‘lishi kerak.',
    };
  }

  // Illegal characters in VIN (I, O, Q are not permitted in standard VINs)
  if (/[IOQ]/.test(vin)) {
    return {
      vin,
      isValid: false,
      country: 'Noma\'lum',
      manufacturer: 'Noma\'lum',
      suggestedMake: 'Noma\'lum',
      suggestedModel: 'Noma\'lum',
      error: 'Standart VIN kodda I, O, Q harflari ishlatilmaydi.',
    };
  }

  const wmi = vin.substring(0, 3);
  const tenthChar = vin.charAt(9);
  const modelYear = YEAR_CODES[tenthChar] || undefined;

  let country = 'Xalqaro';
  let manufacturer = 'Avtomobil ishlab chiqaruvchi';
  let suggestedMake = 'Chevrolet';
  let suggestedModel = 'Cobalt';
  let matchedVehiclePattern = '';

  // WMI Checks
  if (wmi.startsWith('XWB')) {
    country = 'O‘zbekiston (Asaka zavodi)';
    manufacturer = 'UzAuto Motors (GM Uzbekistan)';
    suggestedMake = 'Chevrolet';

    const sub = vin.substring(3, 8);
    if (sub.includes('JA52') || sub.startsWith('JA')) {
      suggestedModel = 'Cobalt';
      matchedVehiclePattern = 'XWBJA52E';
    } else if (sub.includes('0L11') || sub.startsWith('0L')) {
      suggestedModel = 'Damas / Labo';
      matchedVehiclePattern = 'XWB0L11';
    } else {
      suggestedModel = 'Cobalt';
      matchedVehiclePattern = 'XWBJA52E';
    }
  } else if (wmi.startsWith('KL1') || wmi.startsWith('KL7')) {
    country = 'Koreya Respublikasi / O‘zbekiston (SKD)';
    manufacturer = 'GM Daewoo / Chevrolet Korea';
    suggestedMake = 'Chevrolet';

    const sub = vin.substring(3, 8);
    if (sub.includes('JF69') || vin.includes('JF')) {
      suggestedModel = 'Gentra (Lacetti)';
      matchedVehiclePattern = 'KL1JF69';
    } else if (sub.includes('SF69') || vin.includes('SF')) {
      suggestedModel = 'Nexia 3 (Ravon R3)';
      matchedVehiclePattern = 'KL1SF69';
    } else if (sub.includes('9K2') || vin.startsWith('KL79K2')) {
      suggestedModel = 'Tracker 2';
      matchedVehiclePattern = 'KL79K2SE';
    } else if (sub.includes('6B5') || vin.startsWith('KL16B5')) {
      suggestedModel = 'Onix';
      matchedVehiclePattern = 'KL16B5SE';
    } else {
      suggestedModel = 'Gentra (Lacetti)';
      matchedVehiclePattern = 'KL1JF69';
    }
  } else if (wmi.startsWith('LGX')) {
    country = 'Xitoy (Shenzhen)';
    manufacturer = 'BYD Auto Industry Co., Ltd.';
    suggestedMake = 'BYD';
    suggestedModel = 'Song Plus DM-i';
    matchedVehiclePattern = 'LGXCE32';
  } else if (wmi.startsWith('KNA') || wmi.startsWith('KND')) {
    country = 'Koreya Respublikasi';
    manufacturer = 'Kia Motors Corporation';
    suggestedMake = 'Kia';
    suggestedModel = 'K5 (DL3)';
    matchedVehiclePattern = 'KNAGM4A';
  } else if (wmi.startsWith('KMH')) {
    country = 'Koreya Respublikasi';
    manufacturer = 'Hyundai Motor Company';
    suggestedMake = 'Hyundai';
    suggestedModel = 'Elantra';
  } else if (wmi.startsWith('JTN') || wmi.startsWith('JT2')) {
    country = 'Yaponiya';
    manufacturer = 'Toyota Motor Corporation';
    suggestedMake = 'Toyota';
    suggestedModel = 'Camry XV70';
    matchedVehiclePattern = 'JTNB11HK';
  }

  return {
    vin,
    isValid: true,
    country,
    manufacturer,
    suggestedMake,
    suggestedModel,
    modelYear,
    matchedVehiclePattern,
  };
}
