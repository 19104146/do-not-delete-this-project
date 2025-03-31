
import { PlusCircle, Search, Filter, Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

// Mock data
const templates = [
  { id: '1', name: 'Holiday Promotion', type: 'Landscape', updatedAt: '2 days ago' },
  { id: '2', name: 'Campus News', type: 'Portrait', updatedAt: '5 days ago' },
  { id: '3', name: 'Computer Lab Rules', type: 'Landscape', updatedAt: '1 week ago' },
  { id: '4', name: 'Upcoming Events', type: 'Landscape', updatedAt: '2 weeks ago' },
  { id: '5', name: 'Library Hours', type: 'Portrait', updatedAt: '3 weeks ago' },
  { id: '6', name: 'Emergency Procedures', type: 'Landscape', updatedAt: '1 month ago' },
];

const Templates = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Templates</h1>
        <Button className="bg-primary hover:bg-primary/90">
          <PlusCircle size={16} className="mr-2" />
          Create Template
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            type="search" 
            placeholder="Search templates..." 
            className="pl-10 w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center">
            <Filter size={16} className="mr-2" />
            Filter
          </Button>
          
          <div className="flex rounded-md border overflow-hidden">
            <Button
              variant="default"
              className="rounded-none border-0 px-3"
            >
              <Grid3X3 size={18} />
            </Button>
            <Button
              variant="outline"
              className="rounded-none border-0 px-3"
            >
              <List size={18} />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(template => (
          <Card key={template.id} className="cursor-pointer hover:border-primary/50 transition-colors shadow-card">
            <CardContent className="p-0">
              <div className="aspect-video bg-gray-100 rounded-t-lg flex items-center justify-center">
                <span className="text-gray-400">Template Preview</span>
              </div>
              <div className="p-4">
                <h3 className="font-medium">{template.name}</h3>
                <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                  <span>{template.type}</span>
                  <span>Updated {template.updatedAt}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Templates;
