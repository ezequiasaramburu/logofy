import { cn } from "@/lib/utils";

const MaxWidth = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn("max-w-[2250px] mx-auto", className)}>{children}</div>
  );
};

export default MaxWidth;
