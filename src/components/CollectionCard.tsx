import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CollectionCardProps {
  collection: {
    id: string;
    name: string;
    description: string;
    // Add a property for a representative image if your schema supports it
    cover_image?: string; 
  };
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link to={`/collection/${collection.id}`}>
      <Card className="group overflow-hidden border-0 bg-card/50 backdrop-blur-lg border border-purple-500/30 hover:border-cyan-500/50 transition-all duration-300 neon-glow">
        <div className="aspect-video overflow-hidden bg-muted/20 rounded-t-lg relative">
          <ImageWithFallback
            src={collection.cover_image || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809'}
            alt={collection.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
            {collection.name}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2 mt-1">
            {collection.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}