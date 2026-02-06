import Papa from 'papaparse';
import { TopClientData } from '@/types/topClient';

export async function fetchTopClient2025Data(): Promise<TopClientData[]> {
  try {
    const response = await fetch('/top-clients-2025.csv');
    if (!response.ok) {
      throw new Error('Client data not found');
    }
    
    const csvText = await response.text();
    
    // Use PapaParse to properly handle quoted fields with commas
    const parseResult = Papa.parse<string[]>(csvText, {
      header: false,
      skipEmptyLines: true,
    });
    
    if (parseResult.errors.length > 0) {
      console.warn('CSV parsing errors:', parseResult.errors);
    }
    
    // Skip header row
    const dataRows = parseResult.data.slice(1);
    
    return dataRows.map(values => {
      // Validate numeric values
      const totalAmount = parseFloat(values[4]?.trim() || '0');
      const percentage = parseFloat(values[5]?.trim() || '0');
      
      if (isNaN(totalAmount) || isNaN(percentage)) {
        console.warn(`Invalid numeric values in CSV row for client: ${values[2]}`);
      }
      
      return {
        email: values[0]?.trim() || '',
        phone: values[1]?.trim() || '',
        client_name: values[2]?.trim() || '',
        join_date: values[3]?.trim() || '',
        total_amount_spent: isNaN(totalAmount) ? 0 : totalAmount,
        percentage_contribution: isNaN(percentage) ? 0 : percentage,
        project_name: values[6]?.trim() || '',
        project_description: values[7]?.trim() || '',
        project_status: (values[8]?.trim() === 'ongoing' ? 'ongoing' : 'completed') as 'completed' | 'ongoing',
        surprise_date: values[9]?.trim() || '',
        gift_code: values[10]?.trim() || '',
      };
    });
  } catch (error) {
    console.error('Error fetching client data:', error);
    return [];
  }
}

export function findClientByGiftCode(
  clients: TopClientData[],
  giftCode: string
): TopClientData | null {
  const normalizedCode = giftCode.trim().toUpperCase();
  
  return clients.find(client => {
    return client.gift_code.toUpperCase() === normalizedCode;
  }) || null;
}
