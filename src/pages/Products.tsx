import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard, { Product } from '@/components/ui/ProductCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Filter, SlidersHorizontal, ChevronDown, Check, X, 
  Search, Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for products
const allProducts: Product[] = [
  {
    id: '1',
    title: 'Premium Gaming Account - Level 100',
    description: 'Fully loaded gaming account with rare items and achievements.',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Gaming',
    rating: 4.8,
    seller: 'GameMaster'
  },
  {
    id: '2',
    title: 'Ultimate Streaming Bundle',
    description: 'Access to multiple premium streaming platforms at a fraction of the cost.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Streaming',
    rating: 4.6,
    seller: 'StreamKing'
  },
  {
    id: '3',
    title: 'Adobe Creative Suite License',
    description: 'Full access to Adobe Creative Suite with extended license period.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Software',
    rating: 4.9,
    seller: 'SoftwareHub'
  },
  {
    id: '4',
    title: 'Web Development Masterclass',
    description: 'Comprehensive course covering frontend and backend development.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Courses',
    rating: 4.7,
    seller: 'CodePro'
  },
  {
    id: '5',
    title: 'Premium Social Media Account',
    description: 'Verified social media account with large follower base.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Social',
    rating: 4.5,
    seller: 'SocialGuru'
  },
  {
    id: '6',
    title: 'Digital Art Collection',
    description: 'Exclusive digital art pieces with certificates of authenticity.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1569437061241-a848be43cc82?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Digital Art',
    rating: 4.9,
    seller: 'ArtistX'
  },
  {
    id: '7',
    title: 'Premium Domain Name',
    description: 'High-value domain name perfect for businesses.',
    price: 499.99,
    image: 'https://images.unsplash.com/photo-1494599948593-3dafe8338d71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Domains',
    rating: 4.7,
    seller: 'DomainExpert'
  },
  {
    id: '8',
    title: 'Premium Email Templates',
    description: 'Professional email templates for marketing campaigns.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Templates',
    rating: 4.4,
    seller: 'DesignMaster'
  }
];

// Available categories
const categories = [
  'All',
  'Gaming',
  'Streaming',
  'Software',
  'Courses',
  'Social',
  'Digital Art',
  'Domains',
  'Templates'
];

// Available sort options
const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Popularity', value: 'popularity' },
  { label: 'Rating', value: 'rating' }
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // Simulate loading
    setLoading(true);
    
    // Get params from URL
    const category = searchParams.get('category') || 'All';
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'newest';
    const minPrice = Number(searchParams.get('minPrice') || 0);
    const maxPrice = Number(searchParams.get('maxPrice') || 500);
    
    // Update state
    setSelectedCategory(category);
    setSearchQuery(search);
    setSelectedSort(sort);
    setPriceRange([minPrice, maxPrice]);
    
    // Filter and sort products
    let filteredProducts = [...allProducts];
    
    // Filter by category
    if (category !== 'All') {
      filteredProducts = filteredProducts.filter(
        product => product.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        product => 
          product.title.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by price range
    filteredProducts = filteredProducts.filter(
      product => product.price >= minPrice && product.price <= maxPrice
    );
    
    // Sort products
    switch (sort) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
        // For demo, we'll just use rating as popularity
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        // For demo, we'll keep the original order
        break;
    }
    
    // Update products
    setTimeout(() => {
      setProducts(filteredProducts);
      setLoading(false);
    }, 500);
  }, [searchParams]);
  
  const updateFilters = () => {
    const params: Record<string, string> = {};
    
    if (selectedCategory !== 'All') {
      params.category = selectedCategory;
    }
    
    if (searchQuery) {
      params.search = searchQuery;
    }
    
    if (selectedSort !== 'newest') {
      params.sort = selectedSort;
    }
    
    if (priceRange[0] > 0) {
      params.minPrice = priceRange[0].toString();
    }
    
    if (priceRange[1] < 500) {
      params.maxPrice = priceRange[1].toString();
    }
    
    setSearchParams(params);
    setShowFilters(false);
  };
  
  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedSort('newest');
    setPriceRange([0, 500]);
    setSearchParams({});
    setShowFilters(false);
  };
  
  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (query) {
        newParams.set('search', query);
      } else {
        newParams.delete('search');
      }
      return newParams;
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Browse Digital Products</h1>
            <p className="text-muted-foreground">
              Discover a wide range of digital products and services
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div className="flex-1">
                <SearchBar
                  placeholder="Search for products..."
                  fullWidth
                  className="max-w-full"
                />
              </div>
              
              <div className="flex items-center gap-2 md:gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={(e) => e.currentTarget.nextElementSibling?.classList.toggle('hidden')}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Sort
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  
                  <div className="hidden absolute right-0 top-full mt-2 z-20 bg-white border border-border rounded-md shadow-md min-w-[180px]">
                    <div className="p-2">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          className={cn(
                            "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors",
                            selectedSort === option.value 
                              ? "bg-primary/10 text-primary" 
                              : "hover:bg-secondary"
                          )}
                          onClick={() => {
                            setSelectedSort(option.value);
                            setSearchParams(prev => {
                              const newParams = new URLSearchParams(prev);
                              if (option.value !== 'newest') {
                                newParams.set('sort', option.value);
                              } else {
                                newParams.delete('sort');
                              }
                              return newParams;
                            });
                          }}
                        >
                          {selectedSort === option.value && (
                            <Check className="mr-2 h-4 w-4" />
                          )}
                          <span className={selectedSort === option.value ? "" : "ml-6"}>
                            {option.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Expanded Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-border rounded-lg p-4 mb-4 shadow-sm"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Filters</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Categories */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Categories
                    </h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center">
                          <button
                            className={cn(
                              "flex items-center text-sm",
                              selectedCategory === category 
                                ? "text-primary" 
                                : "text-foreground hover:text-primary"
                            )}
                            onClick={() => setSelectedCategory(category)}
                          >
                            <div className={cn(
                              "w-4 h-4 rounded-full border mr-2 flex items-center justify-center",
                              selectedCategory === category 
                                ? "border-primary bg-primary/10" 
                                : "border-border"
                            )}>
                              {selectedCategory === category && (
                                <div className="w-2 h-2 rounded-full bg-primary" />
                              )}
                            </div>
                            {category}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Price Range */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <span className="text-xs">$</span>
                      Price Range
                    </h4>
                    <div className="px-2">
                      <Slider
                        defaultValue={priceRange}
                        min={0}
                        max={500}
                        step={10}
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        className="mb-6"
                      />
                      <div className="flex items-center justify-between">
                        <div className="bg-secondary px-2 py-1 rounded text-sm">
                          ${priceRange[0]}
                        </div>
                        <div className="bg-secondary px-2 py-1 rounded text-sm">
                          ${priceRange[1]}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={resetFilters}
                  >
                    Reset
                  </Button>
                  <Button 
                    size="sm"
                    onClick={updateFilters}
                  >
                    Apply Filters
                  </Button>
                </div>
              </motion.div>
            )}
            
            {/* Active Filters */}
            {(selectedCategory !== 'All' || selectedSort !== 'newest' || 
             priceRange[0] > 0 || priceRange[1] < 500 || searchQuery) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategory !== 'All' && (
                  <div className="bg-primary/10 text-primary text-xs rounded-full px-3 py-1 flex items-center">
                    Category: {selectedCategory}
                    <button 
                      className="ml-2"
                      onClick={() => {
                        setSelectedCategory('All');
                        setSearchParams(prev => {
                          const newParams = new URLSearchParams(prev);
                          newParams.delete('category');
                          return newParams;
                        });
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                
                {(priceRange[0] > 0 || priceRange[1] < 500) && (
                  <div className="bg-primary/10 text-primary text-xs rounded-full px-3 py-1 flex items-center">
                    Price: ${priceRange[0]} - ${priceRange[1]}
                    <button 
                      className="ml-2"
                      onClick={() => {
                        setPriceRange([0, 500]);
                        setSearchParams(prev => {
                          const newParams = new URLSearchParams(prev);
                          newParams.delete('minPrice');
                          newParams.delete('maxPrice');
                          return newParams;
                        });
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                
                {searchQuery && (
                  <div className="bg-primary/10 text-primary text-xs rounded-full px-3 py-1 flex items-center">
                    Search: {searchQuery}
                    <button 
                      className="ml-2"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchParams(prev => {
                          const newParams = new URLSearchParams(prev);
                          newParams.delete('search');
                          return newParams;
                        });
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                
                {selectedSort !== 'newest' && (
                  <div className="bg-primary/10 text-primary text-xs rounded-full px-3 py-1 flex items-center">
                    Sort: {sortOptions.find(o => o.value === selectedSort)?.label}
                    <button 
                      className="ml-2"
                      onClick={() => {
                        setSelectedSort('newest');
                        setSearchParams(prev => {
                          const newParams = new URLSearchParams(prev);
                          newParams.delete('sort');
                          return newParams;
                        });
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                
                <button 
                  className="text-muted-foreground text-xs hover:text-foreground"
                  onClick={resetFilters}
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
          
          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="bg-secondary animate-pulse rounded-xl h-[300px]"></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  priority={index < 4}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-secondary/50 inline-flex rounded-full p-4 mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button 
                variant="outline"
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Products;
