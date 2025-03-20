
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DialogContentWrapperProps {
  title: string;
  children: (closeDialog: () => void) => React.ReactNode;
}

export const DialogContentWrapper = ({ title, children }: DialogContentWrapperProps) => {
  const [, forceUpdate] = React.useState({});
  
  // Create a function that can be passed to children for closing the dialog
  const closeDialog = () => {
    // Force a re-render to ensure DialogContent's animations work properly
    forceUpdate({});
    
    // Use setTimeout to ensure the dialog has time to animate before any state is reset
    setTimeout(() => {
      const closeButton = document.querySelector('[data-radix-collection-item]') as HTMLElement;
      if (closeButton) closeButton.click();
    }, 0);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      {children(closeDialog)}
    </DialogContent>
  );
};
