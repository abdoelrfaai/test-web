
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard, { Product } from '@/components/ui/ProductCard';
import SearchBar from '@/components/ui/SearchBar';
import { ChevronRight, Sparkles, Shield, Zap, User, ArrowRight } from 'lucide-react';

const mockFeaturedProducts: Product[] = [
  {
    id: "1",
    title: "حساب بريميوم نتفليكس",
    description: "حساب نتفليكس مميز مع جميع الميزات الممتازة واشتراك لمدة سنة كاملة",
    price: 150,
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ",
    category: "ترفيه",
    rating: 4.8,
    seller: "متجر النخبة"
  },
  {
    id: "2",
    title: "حساب سبوتيفاي بريميوم",
    description: "استمتع بالموسيقى بدون إعلانات مع حساب سبوتيفاي بريميوم",
    price: 80,
    image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max",
    category: "ترفيه",
    rating: 4.6,
    seller: "ميديا ماركت"
  },
  {
    id: "3",
    title: "حساب ادوبي كرياتيف كلاود",
    description: "وصول كامل إلى مجموعة برامج أدوبي الإبداعية بسعر مخفض",
    price: 250,
    image: "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max",
    category: "برمجيات",
    rating: 4.9,
    seller: "ديجيتال برو"
  },
  {
    id: "4",
    title: "عملات افتراضية للعبة فورتنايت",
    description: "5000 فيبوكس لتحديث مظهر شخصيتك وشراء العناصر المميزة",
    price: 120,
    image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max",
    category: "ألعاب",
    rating: 4.7,
    seller: "قيمرز زون"
  },
];

const mockCategories = [
  { name: "ترفيه", count: 45, icon: Sparkles },
  { name: "ألعاب", count: 32, icon: Zap },
  { name: "برمجيات", count: 28, icon: Shield },
  { name: "تعليم", count: 16, icon: User },
];

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/30 z-0" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              السوق الرقمي الأول للحسابات والمنتجات الرقمية
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl text-muted-foreground mb-8 md:mb-10"
            >
              اشترِ وبع المنتجات الرقمية والحسابات بكل أمان وسهولة. آلاف المنتجات والحسابات الرقمية بانتظارك.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <SearchBar fullWidth placeholder="ابحث عن منتجات وحسابات رقمية..." className="max-w-lg mx-auto" />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">تصفح حسب الفئات</h2>
            <Link to="/products" className="text-primary flex items-center hover:underline">
              عرض جميع الفئات <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {mockCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + (index * 0.1) }}
              >
                <Link to={`/products?category=${category.name}`}>
                  <div className="bg-white p-6 rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 text-center group">
                    <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <category.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} منتج</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-12 md:py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">منتجات مميزة</h2>
            <Link to="/products" className="text-primary flex items-center hover:underline">
              عرض جميع المنتجات <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockFeaturedProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 2} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/products">
              <Button size="lg" className="px-8">
                استعرض جميع المنتجات
                <ArrowRight className="mr-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">ابدأ البيع على متجرنا اليوم</h2>
            <p className="text-white/80 text-lg mb-8">
              انضم إلى آلاف البائعين الناجحين على منصتنا وابدأ في كسب المال من منتجاتك الرقمية.
            </p>
            <Link to="/register">
              <Button variant="secondary" size="lg" className="px-8">
                سجل كبائع الآن
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">لماذا تختار متجرنا؟</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-xl border border-border text-center"
            >
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">ضمان الأمان 100%</h3>
              <p className="text-muted-foreground">
                جميع المعاملات آمنة ومشفرة بالكامل، مع ضمان استرداد الأموال في حالة وجود مشكلة.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-6 rounded-xl border border-border text-center"
            >
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">توصيل فوري</h3>
              <p className="text-muted-foreground">
                استلم منتجك الرقمي فورًا بعد إتمام عملية الشراء، بدون انتظار.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white p-6 rounded-xl border border-border text-center"
            >
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">دعم فني 24/7</h3>
              <p className="text-muted-foreground">
                فريق الدعم متاح على مدار الساعة للإجابة على استفساراتك وحل أي مشكلة قد تواجهها.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
