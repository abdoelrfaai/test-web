
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { createProduct, updateProduct, fetchProducts } from '@/services/productService';

export interface ProductFormData {
  title: string;
  description: string;
  price: string;
  image: string;
  category: string;
  rating: string;
}

interface ProductFormProps {
  isEditing: boolean;
  initialData: ProductFormData;
  productId: string | null;
  userId: string;
  onSuccess: (products: any[]) => void;
  onCancel: () => void;
}

const ProductForm = ({ 
  isEditing, 
  initialData, 
  productId, 
  userId, 
  onSuccess, 
  onCancel 
}: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>(initialData);
  
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) return;
    
    try {
      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        image: formData.image,
        category: formData.category,
        rating: parseFloat(formData.rating)
      };
      
      if (isEditing && productId) {
        await updateProduct(productId, productData);
        toast.success('Product updated successfully');
      } else {
        await createProduct(productData, userId);
        toast.success('Product created successfully');
      }
      
      // Refresh products list
      const updatedProducts = await fetchProducts();
      onSuccess(updatedProducts);
      onCancel();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(isEditing ? 'Failed to update product' : 'Failed to create product');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input 
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Price ($)</label>
            <Input 
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleFormChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Input 
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea 
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            required
            rows={4}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Image URL</label>
          <Input 
            name="image"
            value={formData.image}
            onChange={handleFormChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Rating (0-5)</label>
          <Input 
            name="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={handleFormChange}
            required
          />
        </div>
      </div>
      
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        </DialogClose>
        <Button type="submit">
          {isEditing ? 'Update Product' : 'Add Product'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ProductForm;
