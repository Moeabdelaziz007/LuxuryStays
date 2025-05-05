import { apiRequest } from './query-client';
import { Property, Service } from '@shared/schema';

// Function to fetch featured properties
export async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const response = await apiRequest('GET', '/api/properties/featured');
    return await response.json();
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }
}

// Function to fetch active services
export async function getActiveServices(): Promise<Service[]> {
  try {
    const response = await apiRequest('GET', '/api/services/active');
    return await response.json();
  } catch (error) {
    console.error('Error fetching active services:', error);
    return [];
  }
}

// Function to fetch coming soon services
export async function getComingSoonServices(): Promise<Service[]> {
  try {
    const response = await apiRequest('GET', '/api/services/coming-soon');
    return await response.json();
  } catch (error) {
    console.error('Error fetching coming soon services:', error);
    return [];
  }
}