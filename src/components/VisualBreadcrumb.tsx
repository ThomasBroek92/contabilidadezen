import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItemData {
  label: string;
  href?: string;
}

interface VisualBreadcrumbProps {
  items: BreadcrumbItemData[];
  className?: string;
}

export function VisualBreadcrumb({ items, className }: VisualBreadcrumbProps) {
  return (
    <nav className={`bg-muted/30 py-3 ${className || ""}`} aria-label="Breadcrumb">
      <div className="container mx-auto px-4">
        <Breadcrumb>
          <BreadcrumbList>
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              return (
                <BreadcrumbItem key={index}>
                  {isLast ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <>
                      <BreadcrumbLink asChild>
                        <Link to={item.href || "/"}>{item.label}</Link>
                      </BreadcrumbLink>
                      <BreadcrumbSeparator />
                    </>
                  )}
                </BreadcrumbItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </nav>
  );
}
