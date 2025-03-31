
import React from 'react';
import { useForm } from 'react-hook-form';
import { Group } from '@/types/clientTypes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface GroupFormProps {
  group?: Group;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (group: Omit<Group, 'id' | 'clients'>) => void;
}

interface FormValues {
  name: string;
}

export const GroupForm: React.FC<GroupFormProps> = ({
  group,
  open,
  onOpenChange,
  onSave,
}) => {
  const form = useForm<FormValues>({
    defaultValues: {
      name: group?.name || '',
    },
  });

  const onSubmit = (values: FormValues) => {
    onSave(values);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{group ? 'Edit Group' : 'Add New Group'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter group name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
