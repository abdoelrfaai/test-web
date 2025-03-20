
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  fullWidth?: boolean;
  showFilters?: boolean;
}

export const SearchBar = ({ 
  className, 
  placeholder = "ابحث عن المنتجات الرقمية...",
  fullWidth = false,
  showFilters = false
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let searchUrl = `/products?search=${encodeURIComponent(query.trim())}`;
    
    if (showFilters) {
      if (category !== 'all') {
        searchUrl += `&category=${encodeURIComponent(category)}`;
      }
      
      if (priceRange !== 'all') {
        searchUrl += `&priceRange=${encodeURIComponent(priceRange)}`;
      }
    }
    
    if (query.trim() || category !== 'all' || priceRange !== 'all') {
      navigate(searchUrl);
    }
  };

  const clearSearch = () => {
    setQuery('');
  };

  const categories = [
    { value: 'all', label: 'جميع الفئات' },
    { value: 'ترفيه', label: 'ترفيه' },
    { value: 'ألعاب', label: 'ألعاب' },
    { value: 'برمجيات', label: 'برمجيات' },
    { value: 'تعليم', label: 'تعليم' }
  ];

  const priceRanges = [
    { value: 'all', label: 'جميع الأسعار' },
    { value: '0-50', label: 'أقل من 50 ر.س' },
    { value: '50-100', label: 'من 50 إلى 100 ر.س' },
    { value: '100-200', label: 'من 100 إلى 200 ر.س' },
    { value: '200+', label: 'أكثر من 200 ر.س' }
  ];

  return (
    <form 
      onSubmit={handleSearch}
      className={cn(
        "relative group",
        fullWidth ? "w-full" : "w-full max-w-md",
        className
      )}
    >
      <div className={cn(
        "relative flex items-center transition-all duration-300 ease-out",
        "bg-secondary/50 border border-transparent rounded-full overflow-hidden",
        isFocused && "bg-white border-primary/30 shadow-sm"
      )}>
        <Search className={cn(
          "absolute left-3 w-5 h-5 transition-colors duration-300",
          isFocused ? "text-primary" : "text-muted-foreground"
        )} />
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "w-full bg-transparent py-2 px-10 outline-none text-foreground placeholder:text-muted-foreground",
            "transition-all duration-300 ease-out",
            isFocused ? "pl-10" : "pl-10",
          )}
        />
        
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-10 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        {showFilters && (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="absolute right-10 mr-8 text-muted-foreground hover:text-foreground"
              >
                <Filter className="w-4 h-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-1">
                    الفئة
                  </label>
                  <select 
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="priceRange" className="block text-sm font-medium mb-1">
                    نطاق السعر
                  </label>
                  <select 
                    id="priceRange"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                  </select>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full mt-2"
                  onClick={handleSearch}
                >
                  تطبيق الفلتر
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
        
        <button
          type="submit"
          className={cn(
            "absolute right-2 rounded-full transition-all duration-300 ease-out",
            "h-7 w-7 flex items-center justify-center",
            query ? "bg-primary text-white" : "bg-transparent"
          )}
          disabled={!query.trim() && category === 'all' && priceRange === 'all'}
        >
          <Search className={cn(
            "w-4 h-4",
            query ? "text-white" : "hidden"
          )} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
