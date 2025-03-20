
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { 
  Trash2, MinusCircle, PlusCircle, ShoppingCart, 
  ArrowRight, ShieldCheck, Clock 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Separator } from '@/components/ui/separator';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, isLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [processingCheckout, setProcessingCheckout] = useState(false);

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    await updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = async (productId: string) => {
    await removeFromCart(productId);
  };

  const handleCheckout = () => {
    setProcessingCheckout(true);
    setTimeout(() => {
      navigate('/checkout');
      setProcessingCheckout(false);
    }, 800);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 md:px-6 pt-24 pb-16">
          <div className="max-w-3xl mx-auto text-center py-16">
            <ShoppingCart className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4">Your Cart is Waiting</h1>
            <p className="text-muted-foreground mb-8">
              Please sign in to view your cart and complete your purchase.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/login')} size="lg">
                Sign In
              </Button>
              <Button variant="outline" onClick={() => navigate('/register')} size="lg">
                Create Account
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 md:px-6 pt-24 pb-16">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 md:px-6 pt-24 pb-16">
          <div className="max-w-3xl mx-auto text-center py-16">
            <ShoppingCart className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              You have no items in your shopping cart. Let's add some!
            </p>
            <Button onClick={() => navigate('/products')} size="lg">
              Browse Products
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 md:px-6 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-border overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-medium mb-4">Cart Items ({cartItems.length})</h2>
                  
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row gap-4">
                        <div className="w-24 h-24 rounded-md overflow-hidden bg-secondary/20 flex-shrink-0">
                          <img 
                            src={item.product.image} 
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium">
                                <Link to={`/products/${item.product.id}`} className="hover:text-primary transition-colors">
                                  {item.product.title}
                                </Link>
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                Seller: {item.product.seller}
                              </p>
                              <p className="text-sm text-muted-foreground mb-3">
                                Category: {item.product.category}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">${item.product.price.toFixed(2)}</div>
                              <div className="text-sm text-muted-foreground">
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center">
                              <button
                                className="text-muted-foreground hover:text-foreground"
                                onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <MinusCircle className="h-5 w-5" />
                              </button>
                              <span className="mx-3 min-w-8 text-center">{item.quantity}</span>
                              <button
                                className="text-muted-foreground hover:text-foreground"
                                onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                              >
                                <PlusCircle className="h-5 w-5" />
                              </button>
                            </div>
                            
                            <button
                              className="text-red-500 hover:text-red-700 flex items-center"
                              onClick={() => handleRemoveItem(item.product.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              <span className="text-sm">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/products')}
                  className="gap-2"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-lg border border-border overflow-hidden sticky top-24">
                <div className="p-6">
                  <h2 className="text-xl font-medium mb-4">Order Summary</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal ({cartItems.length} items)</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Processing Fee</span>
                      <span>$0.00</span>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span className="text-lg">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-6 gap-2" 
                    size="lg"
                    onClick={handleCheckout}
                    disabled={processingCheckout}
                  >
                    {processingCheckout ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        Proceed to Checkout <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-start text-xs text-muted-foreground">
                      <ShieldCheck className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Secure checkout powered by our trusted payment processors. Your payment information is never stored.</span>
                    </div>
                    
                    <div className="flex items-start text-xs text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Digital items will be delivered instantly after payment confirmation.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
