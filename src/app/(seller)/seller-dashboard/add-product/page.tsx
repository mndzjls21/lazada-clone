'use client';
'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import CategorySelector from '@/components/seller/CategorySelector';

interface ProductData {
  productName: string;
  category: string;
  images: File[];
  promotionImage: File | null;
  specifications: Record<string, string>;
  price: string;
  specialPrice: string;
  stock: string;
  sellerSKU: string;
  availability: boolean;
  description: string;
  packageWeight: string;
  weightUnit: string;
  packageDimensions: {
    length: string;
    width: string;
    height: string;
  };
  dangerousGoods: string;
  warranty: {
    type: string;
    period: string;
    policy: string;
    returnPolicy: string;
  };
}

export default function AddProductPage() {
  const [productName, setProductName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [recentlyUsed] = useState<string[]>(['Swimwear', 'Accessories']);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [promotionImage, setPromotionImage] = useState<File | null>(null);
  const [videoOption, setVideoOption] = useState<'upload' | 'media'>('upload');
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    qualification: false,
    specification: false,
    priceStock: false,
    description: false,
    shipping: false,
  });
  const [sectionTasks, setSectionTasks] = useState({
    basicInfo: true,
    qualification: false,
    specification: false,
    priceStock: false,
    description: false,
    shipping: false,
  });

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Specification fields
  const [brand, setBrand] = useState('');
  const [clothingMaterial, setClothingMaterial] = useState('');
  const [swimwearType, setSwimwearType] = useState('');
  const [activityType, setActivityType] = useState('');
  const [pattern, setPattern] = useState('');
  const [sizeClass, setSizeClass] = useState('');
  const [showMoreSpec, setShowMoreSpec] = useState(false);
  const [specificationValues, setSpecificationValues] = useState<Record<string, string>>({});

  // Price & Stock fields
  const [price, setPrice] = useState('');
  const [specialPrice, setSpecialPrice] = useState('');
  const [stock, setStock] = useState('');
  const [sellerSKU, setSellerSKU] = useState('');
  const [availability, setAvailability] = useState(true);
  const [sizeChartOption, setSizeChartOption] = useState<'tool' | 'upload'>('tool');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Description fields
  const [mainDescription, setMainDescription] = useState('');
  const [showMoreDescription, setShowMoreDescription] = useState(false);

  // Shipping & Warranty fields
  const [enableVariantDimensions, setEnableVariantDimensions] = useState(false);
  const [packageWeight, setPackageWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [packageLength, setPackageLength] = useState('');
  const [packageWidth, setPackageWidth] = useState('');
  const [packageHeight, setPackageHeight] = useState('');
  const [dangerousGoods, setDangerousGoods] = useState<'none' | 'battery'>('none');
  const [warrantyType, setWarrantyType] = useState('');
  const [warranty, setWarranty] = useState('');
  const [warrantyPolicy, setWarrantyPolicy] = useState('');
  const [returnPolicy, setReturnPolicy] = useState('');
  const [showMoreWarranty, setShowMoreWarranty] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProductImages([...productImages, ...Array.from(e.target.files)]);
    }
  };

  const handlePromotionImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPromotionImage(e.target.files[0]);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleSectionTask = (section: keyof typeof sectionTasks) => {
    setSectionTasks(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const navigateToSection = (section: keyof typeof sectionTasks) => {
    // Open the task details
    setSectionTasks(prev => ({ ...prev, [section]: true }));
    
    // Expand the form section if it's not already expanded
    setExpandedSections(prev => ({ ...prev, [section]: true }));
    
    // Scroll to the section
    const element = document.getElementById(`section-${section}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Get category-specific specification fields
  const getCategorySpecifications = useMemo(() => {
    const category = selectedCategory.toLowerCase();
    
    // Swimwear specifications
    if (category.includes('swimwear') || category.includes('swimming')) {
      return {
        fields: [
          { name: 'brand', label: 'Brand', type: 'text', required: true },
          { name: 'clothingMaterial', label: 'Clothing Material', type: 'select', required: true, options: ['Cotton', 'Polyester', 'Nylon', 'Spandex', 'Lycra'] },
          { name: 'swimwearType', label: 'Swimwear Type', type: 'select', required: true, options: ['One Piece', 'Bikini', 'Tankini', 'Swim Shorts', 'Rash Guard'] },
          { name: 'activityType', label: 'Activity Type', type: 'select', required: false, key: true, options: ['Swimming', 'Surfing', 'Diving', 'Beach', 'Water Sports'] },
          { name: 'pattern', label: 'Pattern', type: 'text', required: false, key: true },
          { name: 'sizeClass', label: 'Size Class', type: 'select', required: false, key: true, options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
        ],
        category: 'Swimwear'
      };
    }
    
    // Electronics specifications
    if (category.includes('computer') || category.includes('laptop') || category.includes('electronics')) {
      return {
        fields: [
          { name: 'brand', label: 'Brand', type: 'text', required: true },
          { name: 'processor', label: 'Processor', type: 'text', required: true },
          { name: 'ram', label: 'RAM', type: 'select', required: true, options: ['4GB', '8GB', '16GB', '32GB', '64GB'] },
          { name: 'storage', label: 'Storage', type: 'select', required: false, key: true, options: ['128GB', '256GB', '512GB', '1TB', '2TB'] },
          { name: 'screenSize', label: 'Screen Size', type: 'text', required: false, key: true },
          { name: 'operatingSystem', label: 'Operating System', type: 'select', required: false, key: true, options: ['Windows 11', 'Windows 10', 'macOS', 'Linux', 'Chrome OS'] },
        ],
        category: 'Electronics'
      };
    }
    
    // Home Appliances specifications
    if (category.includes('appliance') || category.includes('kitchen') || category.includes('home')) {
      return {
        fields: [
          { name: 'brand', label: 'Brand', type: 'text', required: true },
          { name: 'applianceType', label: 'Appliance Type', type: 'select', required: true, options: ['Refrigerator', 'Washing Machine', 'Microwave', 'Air Conditioner', 'Vacuum Cleaner'] },
          { name: 'powerConsumption', label: 'Power Consumption (Watts)', type: 'text', required: true },
          { name: 'capacity', label: 'Capacity', type: 'text', required: false, key: true },
          { name: 'energyRating', label: 'Energy Rating', type: 'select', required: false, key: true, options: ['1 Star', '2 Star', '3 Star', '4 Star', '5 Star'] },
          { name: 'color', label: 'Color', type: 'text', required: false, key: true },
        ],
        category: 'Home Appliances'
      };
    }
    
    // Default/Generic specifications
    return {
      fields: [
        { name: 'brand', label: 'Brand', type: 'text', required: true },
        { name: 'material', label: 'Material', type: 'text', required: true },
        { name: 'color', label: 'Color', type: 'text', required: false, key: true },
        { name: 'size', label: 'Size', type: 'text', required: false, key: true },
        { name: 'weight', label: 'Weight', type: 'text', required: false, key: true },
      ],
      category: 'General'
    };
  }, [selectedCategory]);

  // Auto-expand section tasks based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['basicInfo', 'qualification', 'specification', 'priceStock', 'description', 'shipping'] as const;
      
      sections.forEach((section) => {
        const element = document.getElementById(`section-${section}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top >= 0 && rect.top <= window.innerHeight / 2;
          
          if (isVisible) {
            setSectionTasks(prev => ({ ...prev, [section]: true }));
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate section completion with detailed requirements
  const sectionCompletion = useMemo(() => {
    const basicInfoComplete = productName.length > 0 && selectedCategory.length > 0 && productImages.length >= 3;
    
    const qualificationComplete = false; // Placeholder for qualification logic
    
    // Check if all required specification fields are filled
    const requiredFields = getCategorySpecifications.fields.filter(f => f.required);
    const specificationComplete = requiredFields.every(field => 
      (specificationValues[field.name] || '').length > 0
    );
    
    const priceStockComplete = price.length > 0 && stock.length > 0;
    
    const descriptionComplete = mainDescription.length >= 30;
    
    const shippingComplete = packageWeight.length > 0 && packageLength.length > 0 && packageWidth.length > 0 && packageHeight.length > 0 && warrantyType.length > 0;

    return {
      basicInfo: basicInfoComplete,
      qualification: qualificationComplete,
      specification: specificationComplete,
      priceStock: priceStockComplete,
      description: descriptionComplete,
      shipping: shippingComplete,
    };
  }, [productName, selectedCategory, productImages, getCategorySpecifications, specificationValues, price, stock, mainDescription, packageWeight, packageLength, packageWidth, packageHeight, warrantyType]);

  // Calculate detailed task completion
  const taskDetails = useMemo(() => {
    const requiredFields = getCategorySpecifications.fields.filter(f => f.required);
    const keyFields = getCategorySpecifications.fields.filter(f => f.key);
    
    return {
      basicInfo: {
        hasMinImages: productImages.length >= 3,
        hasName: productName.length > 0,
        hasCategory: selectedCategory.length > 0,
      },
      specification: {
        hasMandatoryAttributes: requiredFields.every(field => 
          (specificationValues[field.name] || '').length > 0
        ),
        hasKeyAttributes: keyFields.some(field => 
          (specificationValues[field.name] || '').length > 0
        ),
      },
      description: {
        hasMinWords: mainDescription.split(/\s+/).filter(word => word.length > 0).length >= 30,
      },
    };
  }, [productName, selectedCategory, productImages, getCategorySpecifications, specificationValues, mainDescription]);

  // Calculate content score (0-100)
  const contentScore = useMemo(() => {
    let score = 0;
    const weights = {
      basicInfo: 25,
      qualification: 10,
      specification: 20,
      priceStock: 20,
      description: 15,
      shipping: 10,
    };

    if (sectionCompletion.basicInfo) score += weights.basicInfo;
    if (sectionCompletion.qualification) score += weights.qualification;
    if (sectionCompletion.specification) score += weights.specification;
    if (sectionCompletion.priceStock) score += weights.priceStock;
    if (sectionCompletion.description) score += weights.description;
    if (sectionCompletion.shipping) score += weights.shipping;

    return score;
  }, [sectionCompletion]);

  // Get score quality label
  const getScoreQuality = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-500' };
    if (score >= 60) return { label: 'Good', color: 'text-blue-500' };
    if (score >= 40) return { label: 'Fair', color: 'text-yellow-500' };
    return { label: 'Poor', color: 'text-red-500' };
  };

  const scoreQuality = getScoreQuality(contentScore);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S to save draft
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (!isSubmitting) {
          handleSubmit(true);
        }
      }
      
      // Ctrl+Enter or Cmd+Enter to submit
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isSubmitting && contentScore === 100) {
          handleSubmit(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitting, contentScore]);

  // Form validation
  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Basic Information validation
    if (!productName.trim()) {
      errors.push('Product name is required');
    }
    if (!selectedCategory) {
      errors.push('Category must be selected');
    }
    if (productImages.length < 3) {
      errors.push('At least 3 product images are required');
    }

    // Specification validation
    const requiredFields = getCategorySpecifications.fields.filter(f => f.required);
    requiredFields.forEach(field => {
      if (!(specificationValues[field.name] || '').trim()) {
        errors.push(`${field.label} is required in specifications`);
      }
    });

    // Price & Stock validation
    if (!price || parseFloat(price) <= 0) {
      errors.push('Valid price is required');
    }
    if (!stock || parseInt(stock) < 0) {
      errors.push('Valid stock quantity is required');
    }

    // Description validation
    const wordCount = mainDescription.split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount < 30) {
      errors.push('Product description must be at least 30 words');
    }

    // Shipping validation
    if (!packageWeight || parseFloat(packageWeight) <= 0) {
      errors.push('Package weight is required');
    }
    if (!packageLength || parseFloat(packageLength) <= 0) {
      errors.push('Package length is required');
    }
    if (!packageWidth || parseFloat(packageWidth) <= 0) {
      errors.push('Package width is required');
    }
    if (!packageHeight || parseFloat(packageHeight) <= 0) {
      errors.push('Package height is required');
    }
    if (!warrantyType) {
      errors.push('Warranty type is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Handle form submission
  const handleSubmit = async (isDraft: boolean = false) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setValidationErrors([]);

    // Validate form if not saving as draft
    if (!isDraft) {
      const validation = validateForm();
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        setSubmitStatus('error');
        setSubmitMessage('Please fix the validation errors before submitting');
        setIsSubmitting(false);
        
        // Scroll to top to show errors
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // Prepare product data
    const productData: ProductData = {
      productName,
      category: selectedCategory,
      images: productImages,
      promotionImage,
      specifications: specificationValues,
      price,
      specialPrice,
      stock,
      sellerSKU,
      availability,
      description: mainDescription,
      packageWeight,
      weightUnit,
      packageDimensions: {
        length: packageLength,
        width: packageWidth,
        height: packageHeight,
      },
      dangerousGoods,
      warranty: {
        type: warrantyType,
        period: warranty,
        policy: warrantyPolicy,
        returnPolicy,
      },
    };

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Log the product data (in real app, this would be sent to backend)
      console.log('Product Data:', productData);
      console.log('Is Draft:', isDraft);

      setSubmitStatus('success');
      setSubmitMessage(isDraft ? 'Product saved as draft successfully!' : 'Product submitted successfully!');
      
      // Reset form after successful submission (optional)
      if (!isDraft) {
        setTimeout(() => {
          window.location.href = '/seller-dashboard/manage-products';
        }, 2000);
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Failed to submit product. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle specification field changes
  const handleSpecificationChange = (fieldName: string, value: string) => {
    setSpecificationValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Remove image
  const removeImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-y-auto">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200 px-8 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/seller-dashboard" className="text-gray-500 hover:text-blue-600">
              Home
            </Link>
            <span className="text-gray-400">&gt;</span>
            <Link href="/seller-dashboard/manage-products" className="text-gray-500 hover:text-blue-600">
              Manage Products
            </Link>
            <span className="text-gray-400">&gt;</span>
            <span className="text-gray-700 font-medium">Add Product</span>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-800">Add Product</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Form Completion:</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      contentScore >= 80 ? 'bg-green-500' :
                      contentScore >= 60 ? 'bg-blue-500' :
                      contentScore >= 40 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${contentScore}%` }}
                  />
                </div>
                <span className={`text-sm font-semibold ${scoreQuality.color}`}>
                  {contentScore}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {submitStatus !== 'idle' && (
          <div className={`mx-8 mt-4 p-4 rounded-lg ${
            submitStatus === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start gap-3">
              {submitStatus === 'success' ? (
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <div className="flex-1">
                <p className={`font-medium ${submitStatus === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                  {submitMessage}
                </p>
                {validationErrors.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                        <span className="text-red-500">•</span>
                        {error}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button 
                onClick={() => {
                  setSubmitStatus('idle');
                  setValidationErrors([]);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="p-8">
          <div className="flex gap-8">
            {/* Left Side - Form */}
            <div className="flex-1 bg-white rounded-lg shadow">
              {/* Basic Information Section */}
              <div id="section-basicInfo" className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection('basicInfo')}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-blue-600 bg-blue-600 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="text-base font-semibold text-gray-900">Basic Information</h2>
                  </div>
                  <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.basicInfo ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedSections.basicInfo && (
                  <div className="px-6 pb-6">
                    {/* Product Name */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="text-red-500">*</span> Product Name
                      </label>
                      <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Enter product name (e.g., Wireless Bluetooth Headphones)"
                        className={`w-full px-4 py-2.5 border rounded text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          !productName.trim() ? 'border-red-300' : 'border-gray-300'
                        }`}
                        maxLength={255}
                        required
                      />
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">
                          {productName.trim() ? '✓ Valid' : '⚠ Required field'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {productName.length}/255
                        </span>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="text-red-500">*</span> Category
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowCategoryModal(true)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded text-left text-gray-900 hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors flex items-center justify-between"
                      >
                        <span className={!selectedCategory ? 'text-gray-400' : ''}>
                          {selectedCategory || 'Please select category or search with keyword'}
                        </span>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Recently Used Tags */}
                      {selectedCategory && (
                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-xs text-gray-600">Recently used:</span>
                          {recentlyUsed.map((tag, idx) => (
                            <button
                              key={idx}
                              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Product Images */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Images
                      </label>
                      <div className="flex gap-3">
                        <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </label>
                        {productImages.map((img, idx) => (
                          <div key={idx} className="relative w-24 h-24 border border-gray-300 rounded overflow-hidden group">
                            <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
                            <button
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                              type="button"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            {idx === 0 && (
                              <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded">
                                Main
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Buyer Promotion Image */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Buyer Promotion Image
                        <svg className="inline-block w-4 h-4 ml-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </label>
                      <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePromotionImageUpload}
                          className="hidden"
                        />
                        {promotionImage ? (
                          <img src={URL.createObjectURL(promotionImage)} alt="" className="w-full h-full object-cover rounded" />
                        ) : (
                          <>
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </>
                        )}
                      </label>
                      <div className="mt-2">
                        <p className="text-xs text-gray-600">White Background Image</p>
                        <button className="text-xs text-blue-600 hover:underline">See Example</button>
                      </div>
                    </div>

                    {/* Video */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video
                        <svg className="inline-block w-4 h-4 ml-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </label>
                      <div className="flex gap-4 mb-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="videoOption"
                            checked={videoOption === 'upload'}
                            onChange={() => setVideoOption('upload')}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">Upload Video</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="videoOption"
                            checked={videoOption === 'media'}
                            onChange={() => setVideoOption('media')}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">Media Center</span>
                        </label>
                      </div>
                      <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                        <input type="file" accept="video/*" className="hidden" />
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </label>
                      <div className="mt-2 text-xs text-gray-500 space-y-1">
                        <p>• Min size: 480x480 px, max video length: 60 seconds, max file size: 100MB</p>
                        <p>• Supported Format: mp4</p>
                        <p>• New Video might take up to 36 hrs to be approved</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Specification Section */}
              <div id="section-specification" className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection('specification')}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    <div className="flex items-center justify-between flex-1">
                      <h2 className="text-base font-semibold text-gray-900">Product Specification</h2>
                      <div className="flex items-center gap-2 mr-8">
                        <span className="text-xs text-gray-500">Fill Rate:</span>
                        <span className="text-xs font-medium text-gray-700">0%</span>
                      </div>
                    </div>
                  </div>
                  <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.specification ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedSections.specification && (
                  <div className="px-6 pb-6">
                    {!selectedCategory ? (
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-500 mb-2">Please select a category first</p>
                        <button
                          onClick={() => navigateToSection('basicInfo')}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Go to Basic Information
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800 font-medium">
                            Category: {getCategorySpecifications.category}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                          Filling in attributes will increase product searchability, driving sales conversion
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          Spot a missing attribute or attribute value?{' '}
                          <button className="text-blue-600 hover:underline">Click me</button>
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                          {getCategorySpecifications.fields.map((field) => (
                            <div key={field.name}>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {field.required && <span className="text-red-500">*</span>} {field.label}
                                {field.key && (
                                  <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded">KEY</span>
                                )}
                              </label>
                              {field.type === 'select' && field.options ? (
                                <div className="relative">
                                  <select
                                    value={specificationValues[field.name] || ''}
                                    onChange={(e) => handleSpecificationChange(field.name, e.target.value)}
                                    className={`w-full px-4 py-2.5 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                                      field.required && !specificationValues[field.name] 
                                        ? 'border-red-300 text-gray-500' 
                                        : 'border-gray-300 text-gray-900'
                                    }`}
                                    required={field.required}
                                  >
                                    <option value="">Select {field.label}</option>
                                    {field.options.map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                              ) : (
                                <input
                                  type="text"
                                  value={specificationValues[field.name] || ''}
                                  onChange={(e) => handleSpecificationChange(field.name, e.target.value)}
                                  placeholder={`Enter ${field.label.toLowerCase()}`}
                                  className={`w-full px-4 py-2.5 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    field.required && !specificationValues[field.name]
                                      ? 'border-red-300'
                                      : 'border-gray-300'
                                  }`}
                                  required={field.required}
                                />
                              )}
                              {field.key && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Spot a missing attribute value?{' '}
                                  <button className="text-blue-600 hover:underline">click me</button>
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {selectedCategory && (
                      <button
                        onClick={() => setShowMoreSpec(!showMoreSpec)}
                        className="mt-4 text-blue-600 hover:underline text-sm flex items-center gap-1"
                      >
                        Show More
                        <svg className={`w-4 h-4 transition-transform ${showMoreSpec ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Price, Stock & Variants Section */}
              <div id="section-priceStock" className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection('priceStock')}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    <h2 className="text-base font-semibold text-gray-900">Price, Stock & Variants</h2>
                  </div>
                  <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.priceStock ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedSections.priceStock && (
                  <div className="px-6 pb-6">
                    <p className="text-sm text-gray-500 mb-4">
                      You can add variants to a product that has more than one option, such as size or color.
                    </p>

                    {/* Add Variation Button */}
                    <button className="mb-6 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Variation(0/2)
                    </button>

                    {/* Price & Stock */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        <span className="text-red-500">*</span> Price & Stock
                      </label>

                      <div className="bg-gray-50 rounded-lg overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-100 border-b border-gray-200 text-sm font-medium text-gray-700">
                          <div className="col-span-3">
                            <span className="text-red-500">*</span> Price
                          </div>
                          <div className="col-span-3">
                            Special Price
                          </div>
                          <div className="col-span-2">
                            Stock
                            <svg className="inline-block w-4 h-4 ml-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="col-span-3">Seller SKU</div>
                          <div className="col-span-1">Availability</div>
                        </div>

                        {/* Table Row */}
                        <div className="grid grid-cols-12 gap-4 px-4 py-4 items-center">
                          <div className="col-span-3">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
                              <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className={`w-full pl-8 pr-3 py-2 border rounded text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                  !price || parseFloat(price) <= 0 ? 'border-red-300' : 'border-gray-300'
                                }`}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-span-3">
                            <button className="text-blue-600 hover:underline text-sm">Add</button>
                          </div>
                          <div className="col-span-2">
                            <input
                              type="number"
                              value={stock}
                              onChange={(e) => setStock(e.target.value)}
                              placeholder="0"
                              min="0"
                              step="1"
                              className={`w-full px-3 py-2 border rounded text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                !stock || parseInt(stock) < 0 ? 'border-red-300' : 'border-gray-300'
                              }`}
                              required
                            />
                          </div>
                          <div className="col-span-3">
                            <div className="relative">
                              <input
                                type="text"
                                value={sellerSKU}
                                onChange={(e) => setSellerSKU(e.target.value)}
                                placeholder="Seller SKU"
                                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                                0/200
                              </span>
                            </div>
                          </div>
                          <div className="col-span-1 flex justify-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={availability}
                                onChange={(e) => setAvailability(e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Size Chart */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Size Chart
                      </label>
                      <div className="flex gap-4 mb-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="sizeChart"
                            checked={sizeChartOption === 'tool'}
                            onChange={() => setSizeChartOption('tool')}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">Use Size Chart Tool</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="sizeChart"
                            checked={sizeChartOption === 'upload'}
                            onChange={() => setSizeChartOption('upload')}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">Upload Image</span>
                        </label>
                      </div>

                      {sizeChartOption === 'tool' && (
                        <div className="flex items-center gap-3">
                          <div className="relative flex-1">
                            <select
                              value={selectedTemplate}
                              onChange={(e) => setSelectedTemplate(e.target.value)}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                            >
                              <option value="">Select Existing Template</option>
                              <option value="template1">Standard Size Chart</option>
                              <option value="template2">Asian Size Chart</option>
                              <option value="template3">European Size Chart</option>
                            </select>
                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                          <span className="text-sm text-gray-500">or</span>
                          <button className="px-4 py-2.5 text-blue-600 hover:underline text-sm whitespace-nowrap">
                            Create New Size Chart
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Description Section */}
              <div id="section-description" className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection('description')}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    <h2 className="text-base font-semibold text-gray-900">Product Description</h2>
                  </div>
                  <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.description ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedSections.description && (
                  <div className="px-6 pb-6">
                    {/* Main Description */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Main Description
                      </label>

                      {/* Toolbar */}
                      <div className="border border-gray-300 rounded-t bg-gray-50 px-3 py-2 flex items-center gap-2">
                        <select className="px-2 py-1 border border-gray-300 rounded text-sm bg-white">
                          <option>11</option>
                          <option>12</option>
                          <option>14</option>
                          <option>16</option>
                        </select>
                        <div className="h-6 w-px bg-gray-300"></div>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8M4 18h16" />
                          </svg>
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h8" />
                          </svg>
                        </button>
                        <div className="h-6 w-px bg-gray-300"></div>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M4 18h16" />
                          </svg>
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h7" />
                          </svg>
                        </button>
                        <div className="h-6 w-px bg-gray-300"></div>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <div className="flex-1"></div>
                        <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Try NEW Advanced Mode
                        </button>
                        <button className="px-3 py-1 text-sm border border-gray-300 bg-white hover:bg-gray-50 rounded">
                          Preview
                        </button>
                      </div>

                      {/* Text Area */}
                      <textarea
                        value={mainDescription}
                        onChange={(e) => setMainDescription(e.target.value)}
                        placeholder="Describe your product in detail (minimum 30 words)..."
                        className={`w-full px-4 py-3 border border-t-0 rounded-b text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[200px] resize-y ${
                          mainDescription.split(/\s+/).filter(w => w.length > 0).length < 30 
                            ? 'border-red-300' 
                            : 'border-gray-300'
                        }`}
                        required
                      />
                      <div className="flex justify-between items-center mt-2">
                        <span className={`text-xs ${
                          mainDescription.split(/\s+/).filter(w => w.length > 0).length >= 30 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {mainDescription.split(/\s+/).filter(w => w.length > 0).length} / 30 words minimum
                        </span>
                        <span className="text-xs text-gray-500">
                          {mainDescription.length} characters
                        </span>
                      </div>
                    </div>

                    {/* Show More Button */}
                    <button
                      onClick={() => setShowMoreDescription(!showMoreDescription)}
                      className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                    >
                      Show More
                      <svg className={`w-4 h-4 transition-transform ${showMoreDescription ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Shipping & Warranty Section */}
              <div id="section-shipping" className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection('shipping')}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    <h2 className="text-base font-semibold text-gray-900">Shipping & Warranty</h2>
                  </div>
                  <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.shipping ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedSections.shipping && (
                  <div className="px-6 pb-6">
                    <p className="text-sm text-gray-600 mb-4">
                      Switch to enter different package dimensions & weight for variations
                    </p>

                    {/* Enable Variant Dimensions Toggle */}
                    <div className="mb-6 flex items-center gap-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enableVariantDimensions}
                          onChange={(e) => setEnableVariantDimensions(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                      <span className="text-sm text-gray-700">
                        Switch on if you need different dimension & weight for different product variants
                      </span>
                    </div>

                    {/* Package Weight */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="text-red-500">*</span> Package Weight
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={packageWeight}
                          onChange={(e) => setPackageWeight(e.target.value)}
                          placeholder="0.001~300"
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="relative">
                          <select
                            value={weightUnit}
                            onChange={(e) => setWeightUnit(e.target.value)}
                            className="px-4 py-2.5 border border-gray-300 rounded text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-10"
                          >
                            <option value="kg">kg</option>
                            <option value="g">g</option>
                            <option value="lb">lb</option>
                          </select>
                          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Package Dimensions */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="text-red-500">*</span> Package Length(cm) * Width(cm) * Height(cm)
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        How to measure my package dimensions?
                        <button className="text-blue-600 hover:underline ml-1">View Example</button>
                      </p>
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={packageLength}
                          onChange={(e) => setPackageLength(e.target.value)}
                          placeholder="0.01~300"
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="text-gray-400">×</span>
                        <input
                          type="text"
                          value={packageWidth}
                          onChange={(e) => setPackageWidth(e.target.value)}
                          placeholder="0.01~300"
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="text-gray-400">×</span>
                        <input
                          type="text"
                          value={packageHeight}
                          onChange={(e) => setPackageHeight(e.target.value)}
                          placeholder="0.01~300"
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Dangerous Goods */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Dangerous Goods
                      </label>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="dangerousGoods"
                            checked={dangerousGoods === 'none'}
                            onChange={() => setDangerousGoods('none')}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">None</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="dangerousGoods"
                            checked={dangerousGoods === 'battery'}
                            onChange={() => setDangerousGoods('battery')}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">Contains battery / flammables / liquid</span>
                        </label>
                      </div>
                    </div>

                    {/* Warranty Fields - Always Visible */}
                    {showMoreWarranty && (
                      <>
                        {/* Warranty Type */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <span className="text-red-500">*</span> Warranty Type
                          </label>
                          <div className="relative">
                            <select
                              value={warrantyType}
                              onChange={(e) => setWarrantyType(e.target.value)}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                            >
                              <option value="">Select</option>
                              <option value="no-warranty">No Warranty</option>
                              <option value="brand-warranty">Brand Warranty</option>
                              <option value="seller-warranty">Seller Warranty</option>
                              <option value="international-warranty">International Warranty</option>
                            </select>
                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>

                        {/* Warranty */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Warranty
                          </label>
                          <div className="relative">
                            <select
                              value={warranty}
                              onChange={(e) => setWarranty(e.target.value)}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                            >
                              <option value="">Select</option>
                              <option value="1-month">1 Month</option>
                              <option value="3-months">3 Months</option>
                              <option value="6-months">6 Months</option>
                              <option value="1-year">1 Year</option>
                              <option value="2-years">2 Years</option>
                            </select>
                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>

                        {/* Warranty Policy */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Warranty Policy
                          </label>
                          <input
                            type="text"
                            value={warrantyPolicy}
                            onChange={(e) => setWarrantyPolicy(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        {/* Return Policy */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Return Policy
                          </label>
                          <input
                            type="text"
                            value={returnPolicy}
                            onChange={(e) => setReturnPolicy(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </>
                    )}

                    {/* Toggle Button */}
                    <button
                      onClick={() => setShowMoreWarranty(!showMoreWarranty)}
                      className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                    >
                      {showMoreWarranty ? 'Show Less' : 'More Warranty Settings'}
                      <svg className={`w-4 h-4 transition-transform ${showMoreWarranty ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="px-6 py-4 flex justify-between items-center">
                <button 
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all form data?')) {
                      window.location.reload();
                    }
                  }}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear Form
                </button>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleSubmit(true)}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Save as draft (Ctrl+S)"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Draft'}
                  </button>
                  <button 
                    onClick={() => handleSubmit(false)}
                    disabled={isSubmitting || contentScore < 100}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title={contentScore < 100 ? `Complete all required fields (${contentScore}% done)` : 'Submit product (Ctrl+Enter)'}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Content Score & Tips */}
            <div className="w-80 space-y-6 sticky top-8 self-start">
              {/* Content Score */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900">Content Score</h3>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>

                {/* Score Display */}
                <div className="mb-6">
                  <div className="relative pt-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-4xl font-bold text-gray-900">{contentScore}</div>
                    </div>
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: `${contentScore}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                          contentScore >= 80 ? 'bg-green-500' : contentScore >= 60 ? 'bg-blue-500' : contentScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                      ></div>
                    </div>
                    <div className={`text-sm font-medium mt-2 ${scoreQuality.color}`}>{scoreQuality.label}</div>
                  </div>
                </div>

                {/* Progress Sections */}
                <div className="space-y-3">
                  {/* Basic Information */}
                  <div>
                    <button
                      onClick={() => navigateToSection('basicInfo')}
                      className="w-full flex items-center gap-3 hover:bg-gray-50 rounded p-2 -m-2 transition-colors"
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        sectionCompletion.basicInfo
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300'
                      }`}>
                        {sectionCompletion.basicInfo && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-gray-900">Basic Information</div>
                      </div>
                      <svg className={`w-5 h-5 text-gray-400 transition-transform ${sectionTasks.basicInfo ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {sectionTasks.basicInfo && (
                      <div className="ml-8 mt-2 space-y-1">
                        {!taskDetails.basicInfo.hasMinImages && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                            <span>Add min 3 main images</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Qualification */}
                  <button
                    onClick={() => navigateToSection('qualification')}
                    className="w-full flex items-center gap-3 hover:bg-gray-50 rounded p-2 -m-2 transition-colors"
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      sectionCompletion.qualification
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300'
                    }`}>
                      {sectionCompletion.qualification && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-gray-900">Qualification</div>
                    </div>
                  </button>

                  {/* Product Specification */}
                  <div>
                    <button
                      onClick={() => navigateToSection('specification')}
                      className="w-full flex items-center gap-3 hover:bg-gray-50 rounded p-2 -m-2 transition-colors"
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        sectionCompletion.specification
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300'
                      }`}>
                        {sectionCompletion.specification && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-gray-900">Product Specification</div>
                      </div>
                      <svg className={`w-5 h-5 text-gray-400 transition-transform ${sectionTasks.specification ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {sectionTasks.specification && (
                      <div className="ml-8 mt-2 space-y-1">
                        {!taskDetails.specification.hasMandatoryAttributes && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                            <span>Fill mandatory attributes</span>
                          </div>
                        )}
                        {!taskDetails.specification.hasKeyAttributes && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                            <span>Fill attributes in key product information</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Price, Stock & Variants */}
                  <button
                    onClick={() => navigateToSection('priceStock')}
                    className="w-full flex items-center gap-3 hover:bg-gray-50 rounded p-2 -m-2 transition-colors"
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      sectionCompletion.priceStock
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300'
                    }`}>
                      {sectionCompletion.priceStock && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-gray-900">Price, Stock & Variants</div>
                    </div>
                  </button>

                  {/* Product Description */}
                  <div>
                    <button
                      onClick={() => navigateToSection('description')}
                      className="w-full flex items-center gap-3 hover:bg-gray-50 rounded p-2 -m-2 transition-colors"
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        sectionCompletion.description
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300'
                      }`}>
                        {sectionCompletion.description && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-gray-900">Product Description</div>
                      </div>
                      <svg className={`w-5 h-5 text-gray-400 transition-transform ${sectionTasks.description ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {sectionTasks.description && (
                      <div className="ml-8 mt-2 space-y-1">
                        {!taskDetails.description.hasMinWords && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                            <span>Add min 30 words in description</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Shipping & Warranty */}
                  <button
                    onClick={() => navigateToSection('shipping')}
                    className="w-full flex items-center gap-3 hover:bg-gray-50 rounded p-2 -m-2 transition-colors"
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      sectionCompletion.shipping
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300'
                    }`}>
                      {sectionCompletion.shipping && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-gray-900">Shipping & Warranty</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-base font-semibold text-blue-600 mb-3">Tips</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Please make sure to upload product images(s), fill product name, and select the correct category to publish a product.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Selection Modal */}
        {showCategoryModal && (
          <CategorySelector
            onSelect={(path: string) => setSelectedCategory(path)}
            onClose={() => setShowCategoryModal(false)}
          />
        )}
      </div>

      {/* Right Sidebar */}
      <div className="w-20 bg-white border-l border-gray-200 flex flex-col items-center py-6 gap-4 flex-shrink-0">
        <button className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition">
          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        </button>

        <button className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center hover:bg-orange-200 transition">
          <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        </button>

        <button className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center hover:bg-purple-200 transition">
          <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </button>

        <button className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition">
          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="flex-1"></div>

        <button className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition rounded-lg">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>

        <button className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition rounded-lg">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
