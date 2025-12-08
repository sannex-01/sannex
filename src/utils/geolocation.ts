// Geolocation-based language detection utility

interface GeoLocation {
  country?: string;
  region?: string;
}

const GEOLOCATION_API = 'https://ipapi.co/json/';

// Regional language mapping based on user requirements
const REGION_LANGUAGE_MAP: Record<string, string> = {
  // Nigeria regions
  'NG-SW': 'yo', // South West Nigeria - Yoruba
  'NG-LA': 'yo', // Lagos - Yoruba
  'NG-OG': 'yo', // Ogun - Yoruba
  'NG-ON': 'yo', // Ondo - Yoruba
  'NG-OS': 'yo', // Osun - Yoruba
  'NG-OY': 'yo', // Oyo - Yoruba
  'NG-EK': 'yo', // Ekiti - Yoruba
  
  'NG-SS': 'ig', // South South - Igbo
  'NG-AB': 'ig', // Abia - Igbo
  'NG-AN': 'ig', // Anambra - Igbo
  'NG-EB': 'ig', // Ebonyi - Igbo
  'NG-EN': 'ig', // Enugu - Igbo
  'NG-IM': 'ig', // Imo - Igbo
  
  'NG-NC': 'ha', // North Central - Hausa
  'NG-FC': 'ha', // Federal Capital Territory - Hausa
  'NG-KW': 'ha', // Kwara - Hausa
  'NG-KO': 'ha', // Kogi - Hausa
  'NG-NA': 'ha', // Nasarawa - Hausa
  'NG-NI': 'ha', // Niger - Hausa
  'NG-PL': 'ha', // Plateau - Hausa
  'NG-BE': 'ha', // Benue - Hausa
  
  // Northern states
  'NG-KN': 'ha', // Kano - Hausa
  'NG-KD': 'ha', // Kaduna - Hausa
  'NG-KT': 'ha', // Katsina - Hausa
  'NG-SO': 'ha', // Sokoto - Hausa
  'NG-ZA': 'ha', // Zamfara - Hausa
  'NG-KE': 'ha', // Kebbi - Hausa
  'NG-JI': 'ha', // Jigawa - Hausa
  'NG-BA': 'ha', // Bauchi - Hausa
  'NG-GO': 'ha', // Gombe - Hausa
  'NG-YO': 'ha', // Yobe - Hausa
  'NG-BO': 'ha', // Borno - Hausa
  'NG-AD': 'ha', // Adamawa - Hausa
  'NG-TA': 'ha', // Taraba - Hausa
};

const COUNTRY_LANGUAGE_MAP: Record<string, string> = {
  // East Africa - Swahili
  'KE': 'sw', // Kenya
  'TZ': 'sw', // Tanzania
  'UG': 'sw', // Uganda
  'RW': 'sw', // Rwanda
  'BI': 'sw', // Burundi
  
  // French-speaking countries
  'FR': 'fr', // France
  'GH': 'fr', // Ghana (has French influence)
  'BJ': 'fr', // Benin Republic
  'TG': 'fr', // Togo
  'CI': 'fr', // Ivory Coast
  'SN': 'fr', // Senegal
  'ML': 'fr', // Mali
  'NE': 'fr', // Niger (French-speaking)
  'BF': 'fr', // Burkina Faso
  'GA': 'fr', // Gabon
  'CG': 'fr', // Republic of Congo
  'CD': 'fr', // Democratic Republic of Congo
  'CM': 'fr', // Cameroon
  'CF': 'fr', // Central African Republic
  'TD': 'fr', // Chad
  'GN': 'fr', // Guinea
  'MG': 'fr', // Madagascar
  'BE': 'fr', // Belgium
  'CH': 'fr', // Switzerland (has French speakers)
  'LU': 'fr', // Luxembourg
  'MC': 'fr', // Monaco
  'CA': 'fr', // Canada (has French speakers)
  'HT': 'fr', // Haiti
};

export async function detectLanguageFromGeolocation(): Promise<string> {
  try {
    const response = await fetch(GEOLOCATION_API);
    const data: GeoLocation & { country_code?: string; region_code?: string } = await response.json();
    
    const countryCode = data.country_code;
    const regionCode = data.region_code;
    
    // Check for Nigeria with regional mapping
    if (countryCode === 'NG' && regionCode) {
      const regionKey = `NG-${regionCode}`;
      if (REGION_LANGUAGE_MAP[regionKey]) {
        return REGION_LANGUAGE_MAP[regionKey];
      }
    }
    
    // Check country-level mapping
    if (countryCode && COUNTRY_LANGUAGE_MAP[countryCode]) {
      return COUNTRY_LANGUAGE_MAP[countryCode];
    }
    
    // Default to English for all others
    return 'en';
  } catch (error) {
    console.log('Geolocation detection failed, falling back to browser language:', error);
    return 'en'; // Fallback to English
  }
}

export function getLanguageFromURL(): string | null {
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  const supportedLanguages = ['en', 'fr', 'ig', 'ha', 'yo', 'sw'];
  
  if (pathSegments.length > 0 && supportedLanguages.includes(pathSegments[0])) {
    return pathSegments[0];
  }
  
  return null;
}

export function updateURLWithLanguage(languageCode: string): void {
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  const supportedLanguages = ['en', 'fr', 'ig', 'ha', 'yo', 'sw'];
  
  // Remove existing language code if present
  if (pathSegments.length > 0 && supportedLanguages.includes(pathSegments[0])) {
    pathSegments.shift();
  }
  
  // Add new language code at the beginning
  const newPath = `/${languageCode}${pathSegments.length > 0 ? '/' + pathSegments.join('/') : ''}`;
  window.history.replaceState({}, '', newPath);
}
