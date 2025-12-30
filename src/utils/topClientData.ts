import { TopClientData } from '@/types/topClient';

export async function fetchTopClientData(year: string): Promise<TopClientData[]> {
  try {
    const response = await fetch(`/top-clients-${year}.csv`);
    if (!response.ok) {
      throw new Error('Client data not found');
    }
    
    const csvText = await response.text();
    const lines = csvText.trim().split('\n');
    
    // Skip header row
    const dataLines = lines.slice(1);
    
    return dataLines.map(line => {
      const values = line.split(',');
      return {
        email: values[0].trim(),
        phone: values[1].trim(),
        client_name: values[2].trim(),
        join_date: values[3].trim(),
        total_amount_spent: parseFloat(values[4].trim()),
        percentage_contribution: parseFloat(values[5].trim()),
        project_name: values[6].trim(),
        project_description: values[7].trim(),
        project_status: values[8].trim() as 'completed' | 'ongoing',
        surprise_date: values[9].trim(),
        gift_code: values[10].trim(),
      };
    });
  } catch (error) {
    console.error('Error fetching client data:', error);
    return [];
  }
}

export function findClientByIdentifier(
  clients: TopClientData[],
  identifier: string
): TopClientData | null {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  
  return clients.find(client => {
    const emailMatch = client.email.toLowerCase() === normalizedIdentifier;
    const phoneMatch = client.phone.replace(/\s+/g, '') === normalizedIdentifier.replace(/\s+/g, '');
    return emailMatch || phoneMatch;
  }) || null;
}
