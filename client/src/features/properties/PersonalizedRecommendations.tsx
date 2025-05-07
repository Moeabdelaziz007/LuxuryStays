import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { personalizationService, PropertyRecommendation } from '@/services/PersonalizationService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Star, Sparkles, Info, ThumbsUp, Bookmark, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';

// The component requires a list of properties to generate recommendations from
interface PersonalizedRecommendationsProps {
  properties: any[];
  title?: string;
  showReasoning?: boolean;
  limit?: number;
}

export default function PersonalizedRecommendations({
  properties,
  title = 'اقتراحات مخصصة لك',
  showReasoning = true,
  limit = 3
}: PersonalizedRecommendationsProps) {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<{
    property: any;
    recommendation: PropertyRecommendation;
  }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRecommendations = async () => {
      if (!user || !properties || properties.length === 0) {
        setRecommendations([]);
        setLoading(false);
        return;
      }

      try {
        // Get recommendations based on user preferences
        const propertyRecommendations = await personalizationService.getPersonalizedRecommendations(
          user.uid,
          properties,
          limit
        );

        // Map recommendations to their corresponding properties
        const recommendationsWithProperties = propertyRecommendations.map(recommendation => {
          const property = properties.find(p => p.id === recommendation.propertyId);
          return {
            property,
            recommendation
          };
        }).filter(item => item.property); // Filter out any recommendations for which we couldn't find the property

        setRecommendations(recommendationsWithProperties);
      } catch (error) {
        console.error('Error getting recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    getRecommendations();
  }, [user, properties, limit]);

  // Record when a user interacts with a recommendation
  const handlePropertyInteraction = (propertyId: string, interactionType: 'view' | 'favorite' | 'book') => {
    if (user) {
      personalizationService.recordUserInteraction(user.uid, propertyId, interactionType);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#39FF14] border-b-2"></div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null; // Don't show anything if there are no recommendations
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-[#39FF14]" />
          {title}
        </h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-900 border-gray-700 text-white">
              <p className="max-w-xs">هذه الاقتراحات مخصصة بناءً على اهتماماتك وتفضيلاتك السابقة</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map(({ property, recommendation }) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -5 }}
            onClick={() => handlePropertyInteraction(property.id, 'view')}
          >
            <Card className="bg-gray-900 border-gray-800 overflow-hidden hover:border-[#39FF14]/30 hover:shadow-[0_0_15px_rgba(57,255,20,0.15)] transition-all duration-300">
              <div className="relative h-48">
                <img
                  src={property.imageUrl}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                {/* Relevance Score Indicator */}
                <div className="absolute top-3 right-3 bg-black/80 rounded-full p-1.5 backdrop-blur-sm">
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <svg viewBox="0 0 36 36" className="w-full h-full">
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke="#39FF14"
                        strokeWidth="2"
                        strokeDasharray={`${(recommendation.relevanceScore / 100) * 100}, 100`}
                        strokeLinecap="round"
                        transform="rotate(-90 18 18)"
                        className="transform transition-all duration-1000 ease-in-out"
                        style={{ strokeDasharray: `${(recommendation.relevanceScore / 100) * 100}, 100` }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-[#39FF14]">{recommendation.relevanceScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Last Minute Deal Badge */}
                {recommendation.isLastMinuteDeal && (
                  <Badge
                    className="absolute top-3 left-3 bg-red-600 text-white border-none"
                  >
                    عرض لمدة محدودة
                  </Badge>
                )}

                {/* Price Badge */}
                <div className="absolute bottom-3 right-3 bg-[#39FF14] text-black font-bold px-3 py-1 rounded-full">
                  {property.pricePerNight} ج.م / ليلة
                </div>

                {/* Rating */}
                {property.rating && (
                  <div className="absolute bottom-3 left-3 flex items-center text-white bg-black/70 rounded-full px-2 py-1">
                    <Star className="w-3.5 h-3.5 fill-[#39FF14] text-[#39FF14] mr-1" />
                    <span className="text-sm font-medium">{property.rating}</span>
                  </div>
                )}
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">{property.name}</CardTitle>
                <CardDescription className="text-gray-400 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {property.location}
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-3">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {recommendation.matchingPreferences.map((pref, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="bg-[#39FF14]/5 border-[#39FF14]/20 text-[#39FF14] text-xs"
                    >
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      {pref}
                    </Badge>
                  ))}
                </div>

                {showReasoning && recommendation.reasoning && (
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                    {recommendation.reasoning}
                  </p>
                )}
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button 
                  asChild
                  onClick={() => handlePropertyInteraction(property.id, 'view')}
                  className="flex-1 bg-[#39FF14] text-black hover:bg-[#39FF14]/90 transition-colors"
                >
                  <Link to={`/properties/${property.id}`}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    عرض التفاصيل
                  </Link>
                </Button>
                <Button
                  onClick={() => handlePropertyInteraction(property.id, 'favorite')}
                  variant="outline"
                  className="border-gray-700 text-white hover:bg-gray-800"
                >
                  <Bookmark className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}