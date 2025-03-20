
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog, DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/components/ui/ProductCard';
import { deleteProduct, fetchProducts } from '@/services/productService';
import { DialogContentWrapper } from './DialogContentWrapper';
import ProductForm, { ProductFormData } from './ProductForm';
import ProductList from './ProductList';

interface ProductsTabProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  userId: string;
  searchTerm: string;
}

const ProductsTab = ({ products, setProducts, userId, searchTerm }: ProductsTabProps) => {
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductFormData>({
    title: '',
    description: '',
    price: '',
    image: '',
    category: '',
    rating: '0'
  });
  
  const resetProductForm = () => {
    setProductForm({
      title: '',
      description: '',
      price: '',
      image: '',
      category: '',
      rating: '0'
    });
    setIsEditingProduct(false);
    setCurrentProductId(null);
  };
  
  const handleEditProduct = (product: Product) => {
    setProductForm({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      rating: product.rating ? product.rating.toString() : '0'
    });
    setCurrentProductId(product.id);
    setIsEditingProduct(true);
  };
  
  const handleProductSubmit = async (e: React.FormEvent, closeDialog: () => void) => {
    e.preventDefault();
    
    if (!userId) return;
    
    try {
      const productData = {
        title: productForm.title,
        description: productForm.description,
        price: parseFloat(productForm.price),
        image: productForm.image,
        category: productForm.category,
        rating: parseFloat(productForm.rating)
      };
      
      // Logic moved to ProductForm component
      
      resetProductForm();
      closeDialog();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(isEditingProduct ? 'Failed to update product' : 'Failed to create product');
    }
  };
  
  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        toast.success('Product deleted successfully');
        
        // Refresh products list
        const updatedProducts = await fetchProducts();
        setProducts(updatedProducts);
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Products</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={resetProductForm}>
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContentWrapper title={isEditingProduct ? 'Edit Product' : 'Add New Product'}>
            {(closeDialog) => (
              <ProductForm
                isEditing={isEditingProduct}
                initialData={productForm}
                productId={currentProductId}
                userId={userId}
                onSuccess={setProducts}
                onCancel={closeDialog}
              />
            )}
          </DialogContentWrapper>
        </Dialog>
      </CardHeader>
      <CardContent>
        <ProductList
          products={products}
          searchTerm={searchTerm}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          productFormData={productForm}
          onProductFormSubmit={handleProductSubmit}
          userId={userId}
          setProducts={setProducts}
        />
      </CardContent>
    </Card>
  );
};

export default ProductsTab;
