import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useUser } from '@supabase/auth-helpers-react'; // Helper to get the current user

interface BiddingProps {
  nft: any;
}

export function Bidding({ nft }: BiddingProps) {
  const [currentBid, setCurrentBid] = useState(nft.current_bid);
  const [highestBidder, setHighestBidder] = useState(nft.highest_bidder);
  const [newBid, setNewBid] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const user = useUser();

  useEffect(() => {
    // Listen for new bids in real-time
    const channel = supabase
      .channel(`bids-for-${nft.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bids', filter: `nft_id=eq.${nft.id}` }, (payload) => {
        // When a new bid comes in, update the state
        setCurrentBid(payload.new.amount);
        setHighestBidder(payload.new.bidder_id);
      })
      .subscribe();

    // Calculate time left
    const interval = setInterval(() => {
      const endTime = new Date(nft.auction_end).getTime();
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance < 0) {
        setTimeLeft("Auction Ended");
        clearInterval(interval);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [nft.id, nft.auction_end]);

  const handlePlaceBid = async () => {
    if (!user) {
      alert('You must be logged in to place a bid.');
      return;
    }

    const bidAmount = parseFloat(newBid);
    if (isNaN(bidAmount) || bidAmount <= currentBid) {
      alert('Your bid must be higher than the current bid.');
      return;
    }

    const { error } = await supabase
      .from('bids')
      .insert({ nft_id: nft.id, bidder_id: user.id, amount: bidAmount });

    if (error) {
      console.error('Error placing bid:', error);
    } else {
      // The real-time subscription will handle the UI update
      setNewBid('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Auction</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-400">Current Bid</p>
          <p className="text-2xl font-bold">{currentBid} ETH</p>
          <p className="text-sm text-gray-400">Highest Bidder: {highestBidder ? highestBidder.substring(0, 8) : 'None'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Auction Ends In</p>
          <p className="text-2xl font-bold">{timeLeft}</p>
        </div>
        <div className="flex space-x-2">
          <Input
            type="number"
            placeholder="Your bid"
            value={newBid}
            onChange={(e) => setNewBid(e.target.value)}
          />
          <Button onClick={handlePlaceBid}>Place Bid</Button>
        </div>
      </CardContent>
    </Card>
  );
}