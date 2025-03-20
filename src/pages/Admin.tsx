
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, Users, ShoppingCart, BarChart, 
  Search
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Product } from '@/components/ui/ProductCard';
import { fetchProducts } from '@/services/productService';
import { supabase } from '@/integrations/supabase/client';
import ProductsTab from '@/components/admin/ProductsTab';
import UsersTab from '@/components/admin/UsersTab';
import OrdersTab from '@/components/admin/OrdersTab';
import AnalyticsTab from '@/components/admin/AnalyticsTab';

// Type definitions
interface User {
  id: string;
  username: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  created_at: string;
  profiles?: {
    username: string;
    email: string;
  };
}

const Admin = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }
    
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch products
        const productsList = await fetchProducts();
        setProducts(productsList);
        
        // Fetch users
        const { data: usersList, error: usersError } = await supabase
          .from('profiles')
          .select('*');
        
        if (usersError) throw usersError;
        setUsers(usersList || []);
        
        // Fetch orders with user profiles using join
        const { data: ordersList, error: ordersError } = await supabase
          .from('orders')
          .select(`
            *,
            profiles:user_id (username, email)
          `);
        
        if (ordersError) throw ordersError;
        
        // Ensure the data is in the correct format
        const formattedOrders: Order[] = (ordersList || []).map((order: any) => ({
          id: order.id,
          user_id: order.user_id,
          total: order.total,
          status: order.status,
          created_at: order.created_at,
          profiles: order.profiles || { username: 'Unknown', email: 'Unknown' }
        }));
        
        setOrders(formattedOrders);
      } catch (error) {
        console.error('Error loading admin data:', error);
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [isAuthenticated, isAdmin, navigate]);
  
  if (loading) {
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
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 md:px-6 pt-24 pb-16">
          <div className="max-w-md mx-auto text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-8">
              You do not have permission to access the admin panel.
            </p>
            <div className="flex justify-center">
              <button 
                className="bg-primary text-white px-4 py-2 rounded"
                onClick={() => navigate('/')}
              >
                Return to Home
              </button>
            </div>
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
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search..." 
                  className="pl-10 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>Products</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Users</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                <span>Orders</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="products">
              <ProductsTab 
                products={products} 
                setProducts={setProducts} 
                userId={user?.id || ''} 
                searchTerm={searchTerm}
              />
            </TabsContent>
            
            <TabsContent value="users">
              <UsersTab 
                users={users} 
                setUsers={setUsers} 
                searchTerm={searchTerm}
              />
            </TabsContent>
            
            <TabsContent value="orders">
              <OrdersTab 
                orders={orders}
                searchTerm={searchTerm}
              />
            </TabsContent>
            
            <TabsContent value="analytics">
              <AnalyticsTab 
                orders={orders}
                productsCount={products.length}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
