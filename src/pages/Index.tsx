import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Twitter } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const Index = () => {
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    websiteUrl: '',
    tags: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  // Add function to verify data
  const verifyData = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      console.log('Latest products in database:', data);
    } catch (error) {
      console.error('Error verifying data:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('products')
        .insert([{
          name: formData.productName,
          description: formData.description,
          website: formData.websiteUrl,
          Tags: formData.tags,
          email: formData.email,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      
      // Show success state
      setIsSubmitted(true);
      
      // Verify the data was stored
      await verifyData();
      
      // Reset form after showing success
      setTimeout(() => {
        setFormData({
          productName: '',
          description: '',
          websiteUrl: '',
          tags: '',
          email: ''
        });
        setIsSubmitted(false);
      }, 5000);

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.productName && formData.description && formData.websiteUrl && formData.email;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-inter">
      {/* Navigation Bar */}
      <nav className="w-full py-4 px-4 border-b border-white/20">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-extrabold text-gray-900">
            GoodProducts
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="https://x.com/yunusxparvez" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Twitter size={20} />
              <span className="hidden sm:inline">Follow us</span>
            </a>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Reach Users who actually 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Care</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Get your innovative SaaS product discovered by thousands of potential users. 
            Submit for review and get featured for  
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> free.</span>
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full"></div>
        </div>

        {/* Form Section Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
            Ready to Get Featured?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fill out the form below to submit your product for review
          </p>
        </div>

        {/* Main Form Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0 backdrop-blur-sm bg-white/80 animate-scale-in">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-semibold text-gray-800">
                Submit Your Product
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Tell us about your amazing SaaS product
              </p>
            </CardHeader>
            
            <CardContent>
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Product Name */}
                  <div className="space-y-2">
                    <Label htmlFor="productName" className="text-sm font-medium text-gray-700">
                      Product Name *
                    </Label>
                    <Input
                      id="productName"
                      name="productName"
                      type="text"
                      placeholder="Enter your product name"
                      value={formData.productName}
                      onChange={handleInputChange}
                      className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe your product, its features, and what makes it unique..."
                      value={formData.description}
                      onChange={handleInputChange}
                      className="min-h-[100px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors resize-none"
                      required
                    />
                  </div>

                  {/* Website URL */}
                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl" className="text-sm font-medium text-gray-700">
                      Website URL *
                    </Label>
                    <Input
                      id="websiteUrl"
                      name="websiteUrl"
                      type="url"
                      placeholder="https://yourproduct.com"
                      value={formData.websiteUrl}
                      onChange={handleInputChange}
                      className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      required
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-sm font-medium text-gray-700">
                      Tags (comma-separated)
                    </Label>
                    <Input
                      id="tags"
                      name="tags"
                      type="text"
                      placeholder="e.g., productivity, AI, automation, analytics"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      'Submit Product'
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-8 animate-fade-in">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-600 mb-2">
                    Product submitted successfully!
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Under Manual Evaluation, Any Queries will be contacted through the given Email Address
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>© 2025 GoodProducts. Built with care for the SaaS community.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
