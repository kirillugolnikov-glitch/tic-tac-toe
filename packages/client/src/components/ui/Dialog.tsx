import * as React from 'react';
import { cn } from '../../lib/utils';

interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  ({ className, children, open, onOpenChange, ...props }, ref) => {
    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" {...props}>
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={() => onOpenChange?.(false)}
          aria-hidden="true"
        />
        <div
          ref={ref}
          className={cn(
            'relative z-50 w-full max-w-lg rounded-lg bg-background p-6 shadow-lg',
            className
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
        >
          {children}
        </div>
      </div>
    );
  }
);
Dialog.displayName = 'Dialog';

const DialogTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ children, onClick, ...props }, ref) => (
    <button ref={ref} onClick={onClick} {...props}>
      {children}
    </button>
  )
);
DialogTrigger.displayName = 'DialogTrigger';

const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>
      {children}
    </div>
  )
);
DialogContent.displayName = 'DialogContent';

const DialogHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
  )
);
DialogHeader.displayName = 'DialogHeader';

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} id="dialog-title" className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
  )
);
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
);
DialogDescription.displayName = 'DialogDescription';

const DialogFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
  )
);
DialogFooter.displayName = 'DialogFooter';

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter };