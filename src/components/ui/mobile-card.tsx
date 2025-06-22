import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMobileOptimized } from "@/hooks/use-mobile-optimized";

interface MobileCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  compact?: boolean;
}

export function MobileCard({
  title,
  children,
  className,
  contentClassName,
  compact = false,
}: MobileCardProps) {
  const { isMobile } = useMobileOptimized();

  return (
    <Card className={className}>
      {title && (
        <CardHeader className={isMobile && compact ? "pb-3" : undefined}>
          <CardTitle className={isMobile ? "text-lg" : "text-xl"}>
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent
        className={`${isMobile && compact ? "pt-0" : ""} ${contentClassName || ""}`}
      >
        {children}
      </CardContent>
    </Card>
  );
}
