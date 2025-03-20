
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TableRow, TableCell } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { Product } from '@/components/ui/ProductCard';
import { DialogContentWrapper } from './DialogContentWrapper';
import ProductForm, { ProductFormData } from './ProductForm';

interface ProductItemProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  productFormData: ProductFormData;
  onProductFormSubmit: (e: React.FormEvent, closeDialog: () => void) => void;
  userId: string;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ProductItem = ({ 
  product, 
  onEdit, 
  onDelete, 
  productFormData,
  onProductFormSubmit,
  userId,
  setProducts
}: ProductItemProps) => {
  return (
    <TableRow key={product.id}>
      <TableCell className="font-medium flex items-center gap-2">
        <div className="w-10 h-10 rounded overflow-hidden bg-secondary/20 flex-shrink-0">
          <img 
            src={product.image} 
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="truncate max-w-[200px]">
          {product.title}
        </span>
      </TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell>${product.price.toFixed(2)}</TableCell>
      <TableCell>{product.rating}</TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => onEdit(product)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContentWrapper title="Edit Product">
              {(closeDialog) => (
                <ProductForm
                  isEditing={true}
                  initialData={productFormData}
                  productId={product.id}
                  userId={userId}
                  onSuccess={setProducts}
                  onCancel={closeDialog}
                />
              )}
            </DialogContentWrapper>
          </Dialog>
          
          <Button 
            size="sm" 
            variant="ghost"
            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            onClick={() => onDelete(product.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ProductItem;
