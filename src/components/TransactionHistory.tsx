import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { prettyDate } from '../utils/helpers.ts'; // We will create this helper function

interface TransactionHistoryProps {
  nftId: string;
}

export function TransactionHistory({ nftId }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [nftId]);

  async function fetchTransactions() {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        buyer:buyer_id ( username, avatar_url ),
        seller:seller_id ( username, avatar_url )
      `)
      .eq('nft_id', nftId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      setTransactions(data);
    }
    setLoading(false);
  }

  if (loading) {
    return <div>Loading transaction history...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {transactions.map((tx) => (
            <li key={tx.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={tx.buyer.avatar_url} />
                  <AvatarFallback>{tx.buyer.username?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p>
                    <span className="font-semibold">{tx.buyer.username}</span> bought from <span className="font-semibold">{tx.seller.username}</span>
                  </p>
                  <p className="text-sm text-gray-400">{prettyDate(tx.timestamp)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{tx.price} ETH</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}