import { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import '../styles/custom.css';

const categories: string[] = [];
const sortOptions: { value: string; label: string }[] = [];

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersChange: (filters: any) => void;
}

export function FilterSidebar({ isOpen, onClose, onFiltersChange }: FilterSidebarProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);
  const [priceRange, setPriceRange] = useState([0, 10]);
  const [sortBy, setSortBy] = useState('newest');
  const [isListedOnly, setIsListedOnly] = useState(false);
  const [isVerifiedOnly, setIsVerifiedOnly] = useState(false);
  const [searchCreator, setSearchCreator] = useState('');
  const [collectionSlug, setCollectionSlug] = useState('');
  const [contractAddress, setContractAddress] = useState('');

  // Collapsible states
  const [collectionOpen, setCollectionOpen] = useState(true);
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [statusOpen, setStatusOpen] = useState(true);
  const [creatorOpen, setCreatorOpen] = useState(false);

  const handleCategoryChange = (category: string, checked: boolean) => {
    let newCategories: string[];
    
    if (category === 'All') {
      newCategories = checked ? ['All'] : [];
    } else {
      newCategories = checked
        ? [...selectedCategories.filter(c => c !== 'All'), category]
        : selectedCategories.filter(c => c !== category);
      
      if (newCategories.length === 0) {
        newCategories = ['All'];
      }
    }
    
    setSelectedCategories(newCategories);
    updateFilters({ categories: newCategories });
  };

  const updateFilters = (updates: any) => {
    const filters = {
      categories: selectedCategories,
      priceRange,
      sortBy,
      isListedOnly,
      isVerifiedOnly,
      searchCreator,
      collectionSlug,
      contractAddress,
      ...updates
    };
    onFiltersChange(filters);
  };

  const clearFilters = () => {
    setSelectedCategories(['All']);
    setPriceRange([0, 10]);
    setSortBy('newest');
    setIsListedOnly(false);
    setIsVerifiedOnly(false);
    setSearchCreator('');
    setCollectionSlug('');
    setContractAddress('');
    onFiltersChange({
      categories: ['All'],
      priceRange: [0, 10],
      sortBy: 'newest',
      isListedOnly: false,
      isVerifiedOnly: false,
      searchCreator: '',
      collectionSlug: '',
      contractAddress: ''
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      
      {/* Sidebar */}
      <div className="fixed md:sticky top-0 left-0 z-50 h-screen w-80 md:w-64 bg-background/95 backdrop-blur-lg border-r border-purple-500/30 overflow-y-auto filter-sidebar">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <h2 className="font-semibold">Filters</h2>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Sort By */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-3 block">Sort By</label>
            <Select value={sortBy} onValueChange={(value: string) => {
              setSortBy(value);
              updateFilters({ sortBy: value });
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator className="mb-6" />

          {/* Collection Filters */}
          <Collapsible open={collectionOpen} onOpenChange={setCollectionOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto mb-3">
                <span className="text-sm font-medium">Collection</span>
                {collectionOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mb-6">
              <div className="space-y-2">
                <label htmlFor="collection-slug" className="text-xs text-gray-400">Collection Slug</label>
                <Input
                  id="collection-slug"
                  type="text"
                  placeholder="e.g., boredapetyachtclub"
                  value={collectionSlug}
                  onChange={(e) => {
                    setCollectionSlug(e.target.value);
                    updateFilters({ collectionSlug: e.target.value });
                  }}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="contract-address" className="text-xs text-gray-400">Contract Address</label>
                <Input
                  id="contract-address"
                  type="text"
                  placeholder="e.g., 0x..."
                  value={contractAddress}
                  onChange={(e) => {
                    setContractAddress(e.target.value);
                    updateFilters({ contractAddress: e.target.value });
                  }}
                  className="text-sm"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator className="mb-6" />

          {/* Categories */}
          <Collapsible open={categoryOpen} onOpenChange={setCategoryOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto mb-3">
                <span className="text-sm font-medium">Category</span>
                {categoryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mb-6">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked: boolean) => handleCategoryChange(category, checked)}
                  />
                  <label
                    htmlFor={category}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          <Separator className="mb-6" />

          {/* Price Range */}
          <Collapsible open={priceOpen} onOpenChange={setPriceOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto mb-3">
                <span className="text-sm font-medium">Price Range (ETH)</span>
                {priceOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mb-6">
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={(value: number[]) => {
                    setPriceRange(value);
                    updateFilters({ priceRange: value });
                  }}
                  max={10}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => {
                    const newRange = [Number(e.target.value), priceRange[1]];
                    setPriceRange(newRange);
                    updateFilters({ priceRange: newRange });
                  }}
                  className="text-xs"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const newRange = [priceRange[0], Number(e.target.value)];
                    setPriceRange(newRange);
                    updateFilters({ priceRange: newRange });
                  }}
                  className="text-xs"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator className="mb-6" />

          {/* Status */}
          <Collapsible open={statusOpen} onOpenChange={setStatusOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto mb-3">
                <span className="text-sm font-medium">Status</span>
                {statusOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mb-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="listed"
                  checked={isListedOnly}
                  onCheckedChange={(checked: boolean) => {
                    setIsListedOnly(checked);
                    updateFilters({ isListedOnly: checked });
                  }}
                />
                <label htmlFor="listed" className="text-sm cursor-pointer">
                  Buy Now
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verified"
                  checked={isVerifiedOnly}
                  onCheckedChange={(checked: boolean) => {
                    setIsVerifiedOnly(checked);
                    updateFilters({ isVerifiedOnly: checked });
                  }}
                />
                <label htmlFor="verified" className="text-sm cursor-pointer">
                  Verified Creators Only
                </label>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator className="mb-6" />

          {/* Creator Search */}
          <Collapsible open={creatorOpen} onOpenChange={setCreatorOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto mb-3">
                <span className="text-sm font-medium">Creator</span>
                {creatorOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mb-6">
              <Input
                type="text"
                placeholder="Search creators..."
                value={searchCreator}
                onChange={(e) => {
                  setSearchCreator(e.target.value);
                  updateFilters({ searchCreator: e.target.value });
                }}
                className="text-sm"
              />
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </>
  );
}