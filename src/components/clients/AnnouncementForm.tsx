
import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useClients } from '@/contexts/ClientContext';
import { BellRing } from 'lucide-react';
import { toast } from 'sonner';

interface AnnouncementFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetGroupId?: string;
  targetClientId?: string;
}

interface FormValues {
  title: string;
  message: string;
  priority: 'normal' | 'high' | 'emergency';
}

export const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  open,
  onOpenChange,
  targetGroupId,
  targetClientId,
}) => {
  const { getClient, getGroup, selectedClients, selectedGroups } = useClients();
  
  const form = useForm<FormValues>({
    defaultValues: {
      title: '',
      message: '',
      priority: 'normal',
    },
  });

  // Determine the target audience
  let targetDescription = '';
  if (targetClientId) {
    const client = getClient(targetClientId);
    targetDescription = `client ${client?.name || targetClientId}`;
  } else if (targetGroupId) {
    const group = getGroup(targetGroupId);
    targetDescription = `group ${group?.name || targetGroupId}`;
  } else if (selectedClients.length > 0 || selectedGroups.length > 0) {
    const clientCount = selectedClients.length;
    const groupCount = selectedGroups.length;
    
    const parts = [];
    if (clientCount > 0) {
      parts.push(`${clientCount} client${clientCount !== 1 ? 's' : ''}`);
    }
    if (groupCount > 0) {
      parts.push(`${groupCount} group${groupCount !== 1 ? 's' : ''}`);
    }
    
    targetDescription = parts.join(' and ');
  } else {
    targetDescription = 'all clients';
  }

  const onSubmit = (values: FormValues) => {
    // In a real application, this would send the announcement to the selected targets
    console.log('Sending announcement', values);
    console.log('Target client:', targetClientId);
    console.log('Target group:', targetGroupId);
    console.log('Selected clients:', selectedClients);
    console.log('Selected groups:', selectedGroups);
    
    // Show success message
    toast.success(`Announcement sent to ${targetDescription}`, {
      description: values.title,
      icon: <BellRing className="h-4 w-4" />,
    });
    
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Send Announcement</DialogTitle>
          <DialogDescription>
            Send an announcement to {targetDescription}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Announcement title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter your announcement message"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">Send Announcement</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
