
import { BarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Order {
  id: string;
  total: number;
}

interface AnalyticsTabProps {
  orders: Order[];
  productsCount: number;
}

const AnalyticsTab = ({ orders, productsCount }: AnalyticsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Sales</h3>
            <p className="text-3xl font-bold">
              ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Orders</h3>
            <p className="text-3xl font-bold">{orders.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Products</h3>
            <p className="text-3xl font-bold">{productsCount}</p>
          </div>
        </div>
        
        <div className="text-center py-12">
          <BarChart className="h-24 w-24 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-medium mb-2">Detailed Analytics</h3>
          <p className="text-muted-foreground">
            Detailed analytics features are coming soon!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsTab;
