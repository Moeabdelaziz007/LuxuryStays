import { apiRequest } from './queryClient';
import { Property, Service } from '@shared/schema';

// Function to fetch featured properties
export async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const response = await apiRequest<Property[]>('/api/properties/featured', 'GET');
    return response;
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }
}

// Function to fetch active services
export async function getActiveServices(): Promise<Service[]> {
  try {
    const response = await apiRequest<Service[]>('/api/services/active', 'GET');
    return response;
  } catch (error) {
    console.error('Error fetching active services:', error);
    return [];
  }
}

// Function to fetch coming soon services
export async function getComingSoonServices(): Promise<Service[]> {
  try {
    const response = await apiRequest<Service[]>('/api/services/coming-soon', 'GET');
    return response;
  } catch (error) {
    console.error('Error fetching coming soon services:', error);
    return [];
  }
}