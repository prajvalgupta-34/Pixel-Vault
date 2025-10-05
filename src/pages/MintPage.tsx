import { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, X, Plus, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Alert, AlertDescription } from '../components/ui/alert';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const categories: string[] = [];
import { Switch } from '../components/ui/switch';
import { connectWallet, mintNFT } from '../utils/blockchain';
import { ethers } from 'ethers';

export function MintPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    royalty: [10],
    license: 'standard',
    tags: [] as string[],
    supply: 1
  });
  
  const [draggedFile, setDraggedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [isLazyMint, setIsLazyMint] = useState(false);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && file.type.startsWith('image/')) {
      setDraggedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDraggedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setDraggedFile(null);
    setPreviewUrl(null);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const lazyMintNFT = async () => {
    if (!draggedFile) return;

    toast.loading('Saving NFT data...', { id: 'mint' });

    // In a real app, you'd upload the image to a decentralized storage like IPFS
    // and get a URL. For this example, we'll simulate this.
    const imageUrl = previewUrl;

    const newNFT = {
      title: formData.title,
      description: formData.description,
      image: imageUrl,
      price: parseFloat(formData.price),
      category: formData.category,
      tags: formData.tags,
      royalty: formData.royalty[0],
      supply: formData.supply,
      minted: false, // Key for lazy minting
      // Add other relevant fields like creator_id from auth session
    };

    // Here you would insert into your Supabase table
    // const { error } = await supabase.from('nfts').insert([newNFT]);
    
    // Mocking the async operation for now
    await new Promise(resolve => setTimeout(resolve, 1500));
    try {
        // Mocking the async operation for now
        await new Promise(resolve => setTimeout(resolve, 1500));
        // In a real app, if there was an error, you would throw it.
        // For example: throw new Error("Failed to save NFT data.");

        toast.success(`NFT "${formData.title}" is ready to be minted upon sale!`, {
            id: 'mint',
            duration: 5000,
        });
        resetFormAndNavigate();
    } catch (error: any) {
        toast.error(`Error saving NFT: ${error.message || 'An unknown error occurred'}`, { id: 'mint' });
        setIsMinting(false);
    }
  };

  const resetFormAndNavigate = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      price: '',
      royalty: [10],
      license: 'standard',
      tags: [],
      supply: 1
    });
    setDraggedFile(null);
    setPreviewUrl(null);
    setIsMinting(false);
    navigate('/');
  };

  const handleConnectWallet = async () => {
    const walletSigner = await connectWallet();
    if (walletSigner) {
      setSigner(walletSigner);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!draggedFile) {
      toast.error('Please upload an image for your NFT');
      return;
    }

    if (!signer) {
      toast.error('Please connect your wallet to mint an NFT');
      return;
    }

    setIsMinting(true);

    // In a real application, you would upload the image and metadata to IPFS
    // and get a tokenURI. For this example, we'll use a placeholder.
    const tokenURI = "ipfs://your-metadata-hash";

    toast.loading('Minting NFT on the blockchain...', { id: 'mint' });

    await mintNFT(signer, tokenURI);

    toast.success(`NFT "${formData.title}" minted successfully!`, {
      id: 'mint',
      duration: 5000,
    });

    resetFormAndNavigate();
  };

  const isFormValid = draggedFile && formData.title && formData.description && formData.category && formData.price;



  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800 rounded-full px-4 py-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Create Your NFT</span>
            </div>
            <h1 className="text-4xl font-bold">Mint Your Digital Masterpiece</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Turn your creative work into a unique digital asset on the blockchain. Set your own price and royalties.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* File Upload */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Artwork</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!previewUrl ? (
                      <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                          isDragOver
                            ? 'border-primary bg-primary/10'
                            : 'border-muted-foreground/25 hover:border-primary/50'
                        }`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                      >
                        <div className="space-y-4">
                          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-medium">Drop your file here</h3>
                            <p className="text-sm text-muted-foreground">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Button type="button" variant="outline" asChild>
                              <label htmlFor="file-upload" className="cursor-pointer">
                                <ImageIcon className="h-4 w-4 mr-2" />
                                Choose File
                              </label>
                            </Button>
                            <input
                              id="file-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleFileSelect}
                              className="hidden"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden">
                            <ImageWithFallback
                              src={previewUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={removeFile}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>File: {draggedFile?.name}</p>
                          <p>Size: {draggedFile ? (draggedFile.size / 1024 / 1024).toFixed(2) : 0} MB</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Preview Card */}
                {previewUrl && formData.title && (
                  <Card>
                    <CardHeader>
                      <CardTitle>NFT Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-card border rounded-lg p-4">
                        <div className="aspect-square rounded-lg overflow-hidden mb-4">
                          <ImageWithFallback
                            src={previewUrl}
                            alt="NFT Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-semibold">{formData.title}</h3>
                          <p className="text-sm text-muted-foreground">by You</p>
                          <div className="flex items-center justify-between">
                            <span className="font-bold">{formData.price} ETH</span>
                            <Badge variant="secondary">{formData.category}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>NFT Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        placeholder="Enter NFT title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your NFT..."
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        required
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value: string) => setFormData(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.filter(cat => cat !== 'All').map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add a tag"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        />
                        <Button type="button" onClick={addTag} size="icon" variant="outline">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                              {tag} <X className="h-3 w-3 ml-1" />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pricing & Royalties</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Price */}
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (ETH) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.001"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        required
                      />
                    </div>

                    {/* Royalty */}
                    <div className="space-y-4">
                      <Label>Royalty Percentage: {formData.royalty[0]}%</Label>
                      <Slider
                        value={formData.royalty}
                        onValueChange={(value: number[]) => setFormData(prev => ({ ...prev, royalty: value }))}
                        max={20}
                        min={0}
                        step={0.5}
                        className="w-full"
                      />
                      <p className="text-sm text-muted-foreground">
                        You'll receive {formData.royalty[0]}% of sales price for any future sales of this NFT.
                      </p>
                    </div>

                    {/* License */}
                    <div className="space-y-2">
                      <Label htmlFor="license">License Type</Label>
                      <Select
                        value={formData.license}
                        onValueChange={(value: string) => setFormData(prev => ({ ...prev, license: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard License</SelectItem>
                          <SelectItem value="creative-commons">Creative Commons</SelectItem>
                          <SelectItem value="exclusive">Exclusive Rights</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Supply */}
                    <div className="space-y-2">
                      <Label htmlFor="supply">Supply</Label>
                      <Input
                        id="supply"
                        type="number"
                        min="1"
                        value={formData.supply}
                        onChange={(e) => setFormData(prev => ({ ...prev, supply: parseInt(e.target.value) || 1 }))}
                      />
                      <p className="text-sm text-muted-foreground">
                        Number of copies that can be minted. Most NFTs have a supply of 1.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Minting Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="lazy-mint" className="flex flex-col space-y-1">
                        <span>Lazy Minting</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                          Your NFT will be minted only when it's first sold. This saves you gas fees.
                        </span>
                      </Label>
                      <Switch
                        id="lazy-mint"
                        checked={isLazyMint}
                        onCheckedChange={setIsLazyMint}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            {/* Gas Fee Estimate */}
            {!isLazyMint && (
              <Alert>
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <div>
                      <strong>Estimated gas fee:</strong> ~0.008 ETH ($18.50)
                    </div>
                    <div className="text-sm text-muted-foreground">
                      This is an estimate. Actual cost may vary.
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <div className="flex justify-center">
              {!signer ? (
                <Button size="lg" onClick={handleConnectWallet} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-12">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="lg"
                  disabled={!isFormValid || isMinting}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-12"
                >
                  {isMinting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Minting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Mint NFT
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}