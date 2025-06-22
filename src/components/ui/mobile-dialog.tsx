import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMobileOptimized } from "@/hooks/use-mobile-optimized";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MobileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function MobileDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: MobileDialogProps) {
  const { shouldUseDrawer, getDialogSize } = useMobileOptimized();

  if (shouldUseDrawer) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[95vh] flex flex-col">
          <DrawerHeader className="text-left flex-shrink-0">
            <DrawerTitle>{title}</DrawerTitle>
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </DrawerHeader>
          <ScrollArea className="flex-1 px-4">
            <div className="pb-4">{children}</div>
          </ScrollArea>
          {footer && (
            <DrawerFooter className="flex-shrink-0">{footer}</DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${getDialogSize()} overflow-hidden flex flex-col ${className || ""}`}
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <ScrollArea className="flex-1 max-h-[calc(95vh-8rem)]">
          <div className="pr-4">{children}</div>
        </ScrollArea>
        {footer && (
          <DialogFooter className="flex-shrink-0">{footer}</DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
