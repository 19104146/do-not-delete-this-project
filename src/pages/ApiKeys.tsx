
import { useState } from 'react';
import { PlusCircle, Copy, EyeOff, Eye, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// Mock data
const apiKeys = [
  { id: '1', name: 'Client Integration', key: 'sk_live_1a2b3c4d5e6f7g8h9i0j', createdAt: '2023-04-15', lastUsed: '2023-05-14' },
  { id: '2', name: 'Content Management', key: 'sk_live_2b3c4d5e6f7g8h9i0j1k', createdAt: '2023-03-22', lastUsed: '2023-05-15' },
  { id: '3', name: 'Monitoring System', key: 'sk_live_3c4d5e6f7g8h9i0j1k2l', createdAt: '2023-02-10', lastUsed: '2023-05-10' },
];

const ApiKeys = () => {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('API key copied to clipboard');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">API Keys</h1>
        <Button className="bg-primary hover:bg-primary/90">
          <PlusCircle size={16} className="mr-2" />
          Create New Key
        </Button>
      </div>
      
      <Card className="mb-6 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-medium">API Usage Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-2">
            <p>API keys are used to authenticate requests to the SignageUI API. Keep your API keys secure and do not share them in public repositories or client-side code.</p>
            <p>Each key should have a specific purpose and only the permissions it needs. Rotate your keys regularly for enhanced security.</p>
            <p>See the <a href="#" className="text-primary hover:underline">API documentation</a> for more information on available endpoints and usage examples.</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="border rounded-lg shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>API Key</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.map(apiKey => (
              <TableRow key={apiKey.id}>
                <TableCell className="font-medium">{apiKey.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                      {showKeys[apiKey.id] ? apiKey.key : apiKey.key.substring(0, 8) + '•••••••••••••••'}
                    </code>
                    <Button variant="ghost" size="icon" className="h-8 w-8"
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                    >
                      {showKeys[apiKey.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"
                      onClick={() => copyToClipboard(apiKey.key)}
                    >
                      <Copy size={16} />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{apiKey.createdAt}</TableCell>
                <TableCell>{apiKey.lastUsed}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Regenerate key">
                      <RefreshCw size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-error" title="Delete key">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ApiKeys;
