
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { fetchProductById } from '@/services/productService';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, ArrowLeft, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { sendPurchaseEmail } from '@/services/emailService';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast: uiToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string),
    enabled: !!id,
  });
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const handleAddToCart = async () => {
    if (!user) {
      uiToast({
        title: "تنبيه",
        description: "يجب عليك تسجيل الدخول أولاً",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .insert([
          {
            user_id: user.id,
            product_id: id,
            quantity: quantity
          }
        ]);
      
      if (error) throw error;
      
      toast.success('تمت إضافة المنتج إلى سلة التسوق');
    } catch (error: any) {
      toast.error('فشل في إضافة المنتج إلى سلة التسوق');
      console.error('Error adding to cart:', error);
    }
  };
  
  const handleBuyNow = async () => {
    if (!user) {
      uiToast({
        title: "تنبيه",
        description: "يجب عليك تسجيل الدخول أولاً",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    try {
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            total: product?.price || 0,
            status: 'pending'
          }
        ])
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Create order item
      const { error: itemError } = await supabase
        .from('order_items')
        .insert([
          {
            order_id: orderData.id,
            product_id: id,
            quantity: quantity,
            price: product?.price || 0
          }
        ]);
      
      if (itemError) throw itemError;
      
      // Send confirmation email
      if (product) {
        await sendPurchaseEmail({
          email: user.email,
          username: user.username,
          orderId: orderData.id,
          total: product.price * quantity,
          items: [{
            title: product.title,
            price: product.price,
            quantity: quantity
          }]
        });
      }
      
      toast.success('تم شراء المنتج بنجاح، تحقق من بريدك الإلكتروني');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('فشل في إتمام عملية الشراء');
      console.error('Error buying product:', error);
    }
  };
  
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container max-w-6xl mx-auto px-4 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:sticky md:top-24 md:h-fit">
              <Skeleton className="w-full aspect-square rounded-lg" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-2/4" />
              <Skeleton className="h-32 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="container max-w-6xl mx-auto px-4 py-24">
          <div className="text-center py-12 space-y-4">
            <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500" />
            <h2 className="text-2xl font-bold">لم يتم العثور على المنتج</h2>
            <p className="text-muted-foreground">
              لم نتمكن من العثور على تفاصيل هذا المنتج. قد يكون المنتج غير موجود أو تمت إزالته.
            </p>
            <Button asChild className="mt-4">
              <Link to="/products">العودة إلى المنتجات</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      <div className="container max-w-6xl mx-auto px-4 py-24">
        <div className="flex items-center mb-8">
          <Button variant="ghost" asChild className="p-0 mr-2">
            <Link to="/products"><ArrowLeft className="h-4 w-4 ml-1" /> العودة إلى المنتجات</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="md:sticky md:top-24 md:h-fit">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={product.image} 
                alt={product.title}
                className="w-full rounded-lg shadow-lg object-cover aspect-square"
              />
            </motion.div>
          </div>
          
          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <Badge className="mb-3">{product.category}</Badge>
              <h1 className="text-3xl font-bold">{product.title}</h1>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground ml-2">
                  {product.rating} تقييم
                </span>
              </div>
            </div>
            
            <div className="text-2xl font-bold">${product.price.toFixed(2)}</div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">الوصف</h3>
              <p className="text-muted-foreground">
                {product.description}
              </p>
            </div>
            
            <div className="pt-6 space-y-4">
              <div className="flex items-center">
                <span className="ml-3">الكمية:</span>
                <div className="flex items-center border rounded-md">
                  <button
                    className="px-3 py-1 border-l"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="px-4 py-1">{quantity}</span>
                  <button
                    className="px-3 py-1 border-r"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={handleAddToCart}
                  variant="outline" 
                  className="flex-1"
                >
                  <ShoppingCart className="ml-2 h-4 w-4" />
                  إضافة إلى السلة
                </Button>
                <Button 
                  onClick={handleBuyNow}
                  className="flex-1"
                >
                  شراء الآن
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
