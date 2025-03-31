
import { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const Settings = () => {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Settings saved successfully');
    }, 1000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Button 
          onClick={handleSave}
          className="bg-primary hover:bg-primary/90"
          disabled={saving}
        >
          {saving ? 'Saving...' : (
            <>
              <Save size={16} className="mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full max-w-md grid grid-cols-4 mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic settings for your signage system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input defaultValue="Campus Digital Signage" />
                  </FormControl>
                </FormItem>
                
                <FormItem>
                  <FormLabel>Admin Email</FormLabel>
                  <FormControl>
                    <Input defaultValue="admin@example.edu" type="email" />
                  </FormControl>
                </FormItem>
                
                <FormItem>
                  <FormLabel>Default Time Zone</FormLabel>
                  <Select defaultValue="utc-8">
                    <SelectTrigger>
                      <SelectValue placeholder="Select time zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                      <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                      <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
                
                <FormItem>
                  <FormLabel>Date Format</FormLabel>
                  <Select defaultValue="mdy">
                    <SelectTrigger>
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Display Settings</h3>
                <div className="space-y-4">
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Client Auto-Refresh</FormLabel>
                      <FormDescription>
                        Automatically refresh client content every hour
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch defaultChecked />
                    </FormControl>
                  </FormItem>
                  
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Show Offline Clients</FormLabel>
                      <FormDescription>
                        Display inactive clients in the dashboard
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch defaultChecked />
                    </FormControl>
                  </FormItem>
                  
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Debug Mode</FormLabel>
                      <FormDescription>
                        Enable extended logging for troubleshooting
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch />
                    </FormControl>
                  </FormItem>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
              <div className="space-y-4">
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Client Disconnections</FormLabel>
                    <FormDescription>
                      Receive an email when a client disconnects
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch defaultChecked />
                  </FormControl>
                </FormItem>
                
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Storage Alerts</FormLabel>
                    <FormDescription>
                      Receive an email when storage is running low
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch defaultChecked />
                  </FormControl>
                </FormItem>
                
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">System Updates</FormLabel>
                    <FormDescription>
                      Receive an email about system updates
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch />
                  </FormControl>
                </FormItem>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security and access control settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-medium mb-4">Authentication</h3>
              <div className="space-y-4">
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Two-Factor Authentication</FormLabel>
                    <FormDescription>
                      Require 2FA for all admin accounts
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch defaultChecked />
                  </FormControl>
                </FormItem>
                
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Session Timeout</FormLabel>
                    <FormDescription>
                      Automatically log out inactive users
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch defaultChecked />
                  </FormControl>
                </FormItem>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Configure advanced system settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormItem>
                    <FormLabel>API Rate Limit</FormLabel>
                    <FormControl>
                      <Input defaultValue="100" type="number" />
                    </FormControl>
                    <FormDescription>
                      Maximum API requests per minute
                    </FormDescription>
                  </FormItem>
                  
                  <FormItem>
                    <FormLabel>Content Cache Duration</FormLabel>
                    <Select defaultValue="60">
                      <SelectTrigger>
                        <SelectValue placeholder="Select cache duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                        <SelectItem value="1440">24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How long to cache content on clients
                    </FormDescription>
                  </FormItem>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">System Maintenance</h3>
                  <div className="space-y-4">
                    <Button variant="outline">Run System Diagnostics</Button>
                    <Button variant="outline" className="ml-4">Clear System Cache</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
