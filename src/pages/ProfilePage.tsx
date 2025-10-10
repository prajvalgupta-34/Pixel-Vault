import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../utils/supabase/client';
import { NFTCard } from '../components/NFTCard';
import { CollectionCard } from '../components/CollectionCard';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [nfts, setNfts] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  async function fetchProfile() {
    setLoading(true);
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
    } else {
      setProfile(profileData);
      fetchNfts(profileData.id);
      fetchCollections(profileData.id);
    }
    setLoading(false);
  }

  async function fetchNfts(userId: string) {
    const { data, error } = await supabase
      .from('nfts')
      .select('*')
      .eq('creator_id', userId);

    if (error) {
      console.error('Error fetching NFTs:', error);
    } else {
      setNfts(data);
    }
  }

  async function fetchCollections(userId: string) {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching collections:', error);
    } else {
      setCollections(data);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center">
        <Avatar className="h-32 w-32 border-4 border-purple-500/50">
          <AvatarImage src={profile.avatar_url || 'https://i.imgur.com/5d8bSzg.png'} />
          <AvatarFallback>{profile.username?.[0]}</AvatarFallback>
        </Avatar>
        <h1 className="text-4xl font-bold mt-4">{profile.username}</h1>
        <p className="text-gray-400">{profile.website}</p>
        <Button className="mt-4">Follow</Button>
      </div>

      <Tabs defaultValue="created" className="mt-8">
        <TabsList>
          <TabsTrigger value="created">Created</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
        </TabsList>
        <TabsContent value="created">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
            {nfts.map((nft) => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="collections">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}