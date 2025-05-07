// PersonalizationService.ts
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { User } from "firebase/auth";

// Interface for user preferences
export interface UserPreferences {
  favoriteLocations: string[];
  preferredAmenities: string[];
  priceRange: [number, number];
  typicalGuests: number;
  preferredPropertyTypes: string[];
  savedSearches: SavedSearch[];
}

// Saved search criteria
export interface SavedSearch {
  id: string;
  name: string;
  location: string | null;
  priceRange: [number, number];
  dateRange: {
    from: string | null;
    to: string | null;
  };
  guests: number;
  bedrooms: number | null;
  amenities: string[];
  createdAt: string;
}

// Property recommendation with relevance score
export interface PropertyRecommendation {
  propertyId: string;
  relevanceScore: number;
  matchingPreferences: string[];
  isLastMinuteDeal: boolean;
  reasoning: string;
}

/**
 * Service for personalizing property suggestions based on user preferences and history
 */
class PersonalizationService {
  /**
   * Get user preferences from Firestore or use default values
   */
  async getUserPreferences(userId: string): Promise<UserPreferences> {
    try {
      if (!db || !userId) {
        return this.getDefaultPreferences();
      }

      // In a real app, this would fetch from Firestore
      // For now, we'll return mock data
      return {
        favoriteLocations: ["راس الحكمة", "الساحل الشمالي"],
        preferredAmenities: ["حمام سباحة خاص", "شاطئ خاص", "واي فاي"],
        priceRange: [5000, 15000],
        typicalGuests: 4,
        preferredPropertyTypes: ["فيلا", "شاليه"],
        savedSearches: [
          {
            id: "search1",
            name: "إجازة الصيف",
            location: "راس الحكمة",
            priceRange: [8000, 15000],
            dateRange: {
              from: "2025-07-10",
              to: "2025-07-20",
            },
            guests: 6,
            bedrooms: 3,
            amenities: ["حمام سباحة خاص", "شاطئ خاص"],
            createdAt: "2025-04-15T10:30:00Z",
          },
          {
            id: "search2",
            name: "عطلة نهاية الأسبوع",
            location: "الساحل الشمالي",
            priceRange: [5000, 8000],
            dateRange: {
              from: "2025-05-20",
              to: "2025-05-22",
            },
            guests: 2,
            bedrooms: 1,
            amenities: ["شاطئ قريب", "واي فاي"],
            createdAt: "2025-04-20T15:45:00Z",
          },
        ],
      };
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      return this.getDefaultPreferences();
    }
  }

  /**
   * Get default preferences for new users or when Firestore is unavailable
   */
  getDefaultPreferences(): UserPreferences {
    return {
      favoriteLocations: [],
      preferredAmenities: ["حمام سباحة مشترك", "واي فاي", "مكيف هواء"],
      priceRange: [0, 20000],
      typicalGuests: 2,
      preferredPropertyTypes: [],
      savedSearches: [],
    };
  }

  /**
   * Save user preferences to Firestore
   */
  async saveUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<boolean> {
    try {
      if (!db || !userId) {
        return false;
      }

      // In a real app, this would save to Firestore
      console.log("Saving preferences for user", userId, preferences);
      return true;
    } catch (error) {
      console.error("Error saving user preferences:", error);
      return false;
    }
  }

  /**
   * Add or update a saved search
   */
  async saveSearch(userId: string, search: Omit<SavedSearch, "id" | "createdAt">): Promise<SavedSearch | null> {
    try {
      if (!db || !userId) {
        return null;
      }

      const newSearch: SavedSearch = {
        ...search,
        id: `search_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      // In a real app, this would save to Firestore
      console.log("Saving search for user", userId, newSearch);
      return newSearch;
    } catch (error) {
      console.error("Error saving search:", error);
      return null;
    }
  }

  /**
   * Delete a saved search
   */
  async deleteSearch(userId: string, searchId: string): Promise<boolean> {
    try {
      if (!db || !userId) {
        return false;
      }

      // In a real app, this would delete from Firestore
      console.log("Deleting search", searchId, "for user", userId);
      return true;
    } catch (error) {
      console.error("Error deleting search:", error);
      return false;
    }
  }

  /**
   * Get personalized property recommendations based on user preferences and history
   */
  async getPersonalizedRecommendations(
    userId: string,
    availableProperties: any[],
    limit = 5
  ): Promise<PropertyRecommendation[]> {
    try {
      const preferences = await this.getUserPreferences(userId);
      
      if (!availableProperties || availableProperties.length === 0) {
        return [];
      }

      // Score each property based on how well it matches user preferences
      const scoredProperties = availableProperties.map(property => {
        let score = 0;
        const matchingPreferences: string[] = [];
        let reasoning = "";

        // Check if location matches preferences
        if (preferences.favoriteLocations.some(loc => property.location.includes(loc))) {
          score += 25;
          matchingPreferences.push("موقع مفضل");
          reasoning += "يقع في أحد المواقع المفضلة لديك. ";
        }

        // Check for matching amenities
        const matchingAmenities = preferences.preferredAmenities.filter(
          amenity => property.amenities.includes(amenity)
        );
        
        if (matchingAmenities.length > 0) {
          score += matchingAmenities.length * 5;
          matchingPreferences.push("مرافق مفضلة");
          reasoning += `يحتوي على ${matchingAmenities.length} من المرافق المفضلة لديك. `;
        }

        // Check if price is within preferred range
        if (
          property.pricePerNight >= preferences.priceRange[0] &&
          property.pricePerNight <= preferences.priceRange[1]
        ) {
          score += 20;
          matchingPreferences.push("ضمن نطاق السعر المفضل");
          reasoning += "السعر ضمن نطاق ميزانيتك المعتادة. ";
        }

        // Check if property type matches preferences
        if (preferences.preferredPropertyTypes.length === 0 || 
            preferences.preferredPropertyTypes.includes(property.name.split(" ")[0])) {
          score += 15;
          matchingPreferences.push("نوع العقار المفضل");
          reasoning += "نوع العقار من الأنواع التي تفضلها. ";
        }

        // Check if capacity matches typical guests
        if (property.maxGuests >= preferences.typicalGuests) {
          score += 10;
          matchingPreferences.push("سعة مناسبة");
          reasoning += "يتسع لعدد الضيوف المعتاد. ";
        }

        // Add bonus for featured properties
        if (property.featured) {
          score += 5;
          matchingPreferences.push("عقار مميز");
          reasoning += "عقار مميز ومختار بعناية. ";
        }

        // Is this a last-minute deal?
        const isLastMinuteDeal = property.pricePerNight < 7000 && property.rating >= 4.5;

        return {
          propertyId: property.id,
          relevanceScore: score,
          matchingPreferences,
          isLastMinuteDeal,
          reasoning: reasoning.trim()
        };
      });

      // Sort by score (descending) and limit results
      return scoredProperties
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit);
    } catch (error) {
      console.error("Error getting recommendations:", error);
      return [];
    }
  }

  /**
   * Learn from user interactions to improve recommendations
   */
  async recordUserInteraction(userId: string, propertyId: string, interactionType: 'view' | 'favorite' | 'book'): Promise<void> {
    try {
      if (!db || !userId) {
        return;
      }

      // In a real app, this would record to Firestore
      console.log(`Recording ${interactionType} interaction for user ${userId} on property ${propertyId}`);
    } catch (error) {
      console.error("Error recording user interaction:", error);
    }
  }
}

export const personalizationService = new PersonalizationService();