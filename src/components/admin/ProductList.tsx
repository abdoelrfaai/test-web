
import { Product } from '@/components/ui/ProductCard';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import ProductItem from './ProductItem';
import { ProductFormData } from './ProductForm';

interface ProductListProps {
  products: Product[];
  searchTerm: string;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  productFormData: ProductFormData;
  onProductFormSubmit: (e: React.FormEvent, closeDialog: () => void) => void;
  userId: string;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ProductList = ({ 
  products, 
  searchTerm, 
  onEditProduct, 
  onDeleteProduct,
  productFormData,
  onProductFormSubmit,
  userId,
  setProducts
}: ProductListProps) => {
  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                {searchTerm ? 'No products matching your search' : 'No products found'}
              </TableCell>
            </TableRow>
          ) : (
            filteredProducts.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                onEdit={onEditProduct}
                onDelete={onDeleteProduct}
                productFormData={productFormData}
                onProductFormSubmit={onProductFormSubmit}
                userId={userId}
                setProducts={setProducts}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductList;
