
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/components/ui/ProductCard';

export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      title,
      description,
      price,
      image,
      category,
      rating,
      seller_id
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  // Get unique seller IDs
  const sellerIds = [...new Set(data.map(product => product.seller_id))];
  
  // Fetch profiles for sellers
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, username')
    .in('id', sellerIds);
  
  if (profilesError) {
    console.error('Error fetching seller profiles:', profilesError);
  }

  // Map seller names to products
  return data.map(product => {
    const sellerProfile = profiles?.find(profile => profile.id === product.seller_id);
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      rating: product.rating,
      seller: sellerProfile?.username || 'Unknown Seller'
    };
  });
};

export const fetchProductById = async (id: string): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      title,
      description,
      price,
      image,
      category,
      rating,
      seller_id
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    throw error;
  }

  // Fetch seller profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', data.seller_id)
    .single();
  
  if (profileError) {
    console.error('Error fetching seller profile:', profileError);
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    price: data.price,
    image: data.image,
    category: data.category,
    rating: data.rating,
    seller: profile?.username || 'Unknown Seller'
  };
};

export const createProduct = async (
  product: Omit<Product, 'id' | 'seller'>,
  sellerId: string
): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .insert([
      {
        title: product.title,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        rating: product.rating,
        seller_id: sellerId
      }
    ]);

  if (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (
  id: string,
  product: Partial<Omit<Product, 'id' | 'seller'>>
): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id);

  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
