
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import {
  User, Package, CreditCard, Clock, FileText, LogOut,
  ArrowRight, Check, AlertCircle, Edit, Save, X
} from 'lucide-react';

// Mock orders data
const mockOrders = [
  {
    id: 'ORD-1234',
    date: '2023-06-15',
    items: [
      { name: 'Premium Gaming Account', price: 149.99 }
    ],
    total: 149.99,
    status: 'Completed'
  },
  {
    id: 'ORD-5678',
    date: '2023-05-20',
    items: [
      { name: 'Streaming Service Bundle', price: 29.99 }
    ],
    total: 29.99,
    status: 'Completed'
  },
  {
    id: 'ORD-9012',
    date: '2023-04-10',
    items: [
      { name: 'Software License Key', price: 79.99 }
    ],
    total: 79.99,
    status: 'Completed'
  }
];

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: ''
  });
  const { toast } = useToast();
  
  useEffect(() => {
    if (user) {
      // In a real app, we'd fetch the user data from API
      // For now, populate with mock data based on username
      const nameParts = user.username.split(/[._-]/).map(part => 
        part.charAt(0).toUpperCase() + part.slice(1)
      );
      
      setUserData({
        firstName: nameParts[0] || '',
        lastName: nameParts[1] || '',
        email: user.email,
        username: user.username
      });
    }
  }, [user]);
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }
  
  const handleSaveProfile = () => {
    // In a real app, we'd call an API to update the profile
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully."
    });
    setEditMode(false);
  };
  
  const handleCancel = () => {
    // Reset form and exit edit mode
    if (user) {
      const nameParts = user.username.split(/[._-]/).map(part => 
        part.charAt(0).toUpperCase() + part.slice(1)
      );
      
      setUserData({
        firstName: nameParts[0] || '',
        lastName: nameParts[1] || '',
        email: user.email,
        username: user.username
      });
    }
    setEditMode(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-16 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
                <p className="text-muted-foreground">
                  Manage your account and view your purchases
                </p>
              </div>
              
              <Button 
                variant="outline" 
                className="mt-4 md:mt-0" 
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Sidebar */}
              <div className="md:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-border p-6 mb-6">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <User className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className="text-xl font-medium">{userData.firstName} {userData.lastName}</h2>
                    <p className="text-sm text-muted-foreground mb-1">@{userData.username}</p>
                    <p className="text-sm text-muted-foreground">{userData.email}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-border">
                  <div className="px-4 py-3 border-b border-border">
                    <h3 className="font-medium">Account Summary</h3>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-4">
                      <li className="flex justify-between items-center">
                        <div className="flex items-center text-sm">
                          <Package className="h-4 w-4 mr-2 text-primary" />
                          <span>Total Orders</span>
                        </div>
                        <span className="font-medium">{mockOrders.length}</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <div className="flex items-center text-sm">
                          <CreditCard className="h-4 w-4 mr-2 text-primary" />
                          <span>Amount Spent</span>
                        </div>
                        <span className="font-medium">
                          ${mockOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                        </span>
                      </li>
                      <li className="flex justify-between items-center">
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-primary" />
                          <span>Member Since</span>
                        </div>
                        <span className="font-medium">June 2023</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="md:col-span-3">
                <Tabs defaultValue="orders" className="bg-white rounded-lg shadow-sm border border-border">
                  <TabsList className="p-0 border-b border-border rounded-none bg-secondary/30">
                    <TabsTrigger 
                      value="orders" 
                      className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-6 py-3"
                    >
                      Orders
                    </TabsTrigger>
                    <TabsTrigger 
                      value="profile" 
                      className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-6 py-3"
                    >
                      Profile
                    </TabsTrigger>
                    <TabsTrigger 
                      value="security" 
                      className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-6 py-3"
                    >
                      Security
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="orders" className="p-6">
                    <h3 className="text-xl font-medium mb-4">My Orders</h3>
                    
                    {mockOrders.length > 0 ? (
                      <div className="space-y-4">
                        {mockOrders.map((order, index) => (
                          <Card key={order.id} className="overflow-hidden">
                            <CardHeader className="bg-secondary/30 py-3">
                              <div className="flex justify-between items-center">
                                <CardTitle className="text-base">
                                  Order #{order.id}
                                </CardTitle>
                                <div className="flex items-center">
                                  <span className="text-sm mr-3">
                                    {new Date(order.date).toLocaleDateString()}
                                  </span>
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {order.status}
                                  </span>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                {order.items.map((item, itemIndex) => (
                                  <div key={itemIndex} className="flex justify-between items-center">
                                    <span>{item.name}</span>
                                    <span className="font-medium">${item.price.toFixed(2)}</span>
                                  </div>
                                ))}
                                <div className="border-t border-border pt-3 flex justify-between items-center">
                                  <span className="font-medium">Total</span>
                                  <span className="font-bold">${order.total.toFixed(2)}</span>
                                </div>
                              </div>
                              
                              <div className="mt-4 flex justify-between items-center">
                                <Button variant="link" className="p-0 h-auto text-primary">
                                  View Details
                                </Button>
                                <Button variant="outline" size="sm">
                                  <FileText className="h-4 w-4 mr-2" />
                                  Download Receipt
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="bg-secondary/50 inline-flex rounded-full p-4 mb-4">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No Orders Yet</h3>
                        <p className="text-muted-foreground mb-6">
                          You haven't made any purchases yet.
                        </p>
                        <Button 
                          className="inline-flex items-center"
                          onClick={() => window.location.href = '/products'}
                        >
                          Browse Products
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="profile" className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-medium">Profile Information</h3>
                      {!editMode ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setEditMode(true)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleCancel}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={handleSaveProfile}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={userData.firstName}
                          onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                          disabled={!editMode}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={userData.lastName}
                          onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                          disabled={!editMode}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={userData.username}
                          onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                          disabled={!editMode}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={userData.email}
                          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                          disabled={!editMode}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="security" className="p-6">
                    <h3 className="text-xl font-medium mb-6">Security Settings</h3>
                    
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="text-base">Change Password</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input
                              id="current-password"
                              type="password"
                              placeholder="••••••••"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                              id="new-password"
                              type="password"
                              placeholder="••••••••"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input
                              id="confirm-password"
                              type="password"
                              placeholder="••••••••"
                              className="mt-1"
                            />
                          </div>
                          <Button className="mt-2">Update Password</Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Account Security</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <div className="font-medium">Two-Factor Authentication</div>
                              <div className="text-sm text-muted-foreground">
                                Add an extra layer of security to your account
                              </div>
                            </div>
                            <Button variant="outline">
                              Enable
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between border-t border-border pt-4">
                            <div className="space-y-0.5">
                              <div className="font-medium">Account Activity</div>
                              <div className="text-sm text-muted-foreground">
                                View your recent login activity
                              </div>
                            </div>
                            <Button variant="outline">
                              View Activity
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
