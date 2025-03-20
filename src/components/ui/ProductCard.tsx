
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  seller: string;
}

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard = ({ product, priority = false }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast('Please login to add items to your cart', {
        description: 'You need to be logged in to add products to your cart.',
        action: {
          label: 'Login',
          onClick: () => navigate('/login')
        }
      });
      return;
    }
    
    setIsAdding(true);
    try {
      await addToCart(product);
      toast.success(`${product.title} added to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: priority ? 0.1 : 0.2,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={cn(
        "group relative rounded-xl overflow-hidden bg-white transition-all duration-300",
        "hover:shadow-lg border border-border hover:border-primary/20",
        "flex flex-col h-full"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-secondary/30">
        <div className="relative w-full h-full">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary/50">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={product.image}
            alt={product.title}
            className={cn(
              "w-full h-full object-cover transition-all duration-700",
              isHovered ? "scale-110" : "scale-100",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
          
          <div className="absolute top-2 left-2">
            <span className="inline-block bg-primary/90 text-white text-xs font-medium px-2 py-1 rounded">
              {product.category}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg line-clamp-1">
            {product.title}
          </h3>
          <div className="flex items-center text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-xs ml-1">{product.rating}</span>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {product.description}
        </p>
        
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="font-medium text-lg">
            ${product.price.toFixed(2)}
          </span>
          
          <div className="flex space-x-2">
            <Button 
              variant="secondary" 
              size="sm"
              className="w-9 h-9 p-0"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
            </Button>
            <Link to={`/products/${product.id}`}>
              <Button size="sm">View Details</Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

