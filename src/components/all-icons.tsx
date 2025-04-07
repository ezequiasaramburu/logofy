import { icons } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { DEFAULT_ICON } from "@/constants/defaults";
import { Input } from "./ui/input";
import { Search, X } from "lucide-react";

interface AllIconsProps {
  selectedIcon: (i: any) => void;
}

const AllIcons: React.FC<AllIconsProps> = ({ selectedIcon }) => {
  const storageValue = localStorage.getItem("value")
    ? JSON.parse(localStorage.getItem("value")!)
    : null;

  const [icon, setIcon] = useState(
    storageValue ? storageValue?.icon : DEFAULT_ICON
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Get all icon names from lucide-react
  const allIcons = Object.keys(icons).sort();

  // Filter icons based on search term
  const filteredIcons = allIcons.filter((iconName) =>
    iconName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIconSelect = (iconName: string) => {
    selectedIcon(iconName);
    setIcon(iconName);
    setIsOpen(false);
  };

  const Icon = ({
    name,
    color,
    size,
  }: {
    name: string;
    color: string;
    size: number;
  }) => {
    const LucidIcon = (icons as Record<string, React.ComponentType<any>>)[name];

    if (!LucidIcon) {
      console.error(`Icon "${name}" not found.`);
      return null;
    }

    return <LucidIcon color={color} size={size} />;
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="my-1 py-4 font-bold"
          >
            <Icon name={icon} color="#000" size={20} />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl h-[90vh] duration-0">
          <div className="space-y-4">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle>Pick an Icon</DialogTitle>
            </DialogHeader>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search icons..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grid gap-4 grid-cols-5 md:grid-cols-7 lg:grid-cols-9 overflow-y-auto h-[70vh] pr-2">
              {filteredIcons.map((icon) => (
                <div
                  key={icon}
                  className="border p-2 rounded-sm flex items-center justify-center cursor-pointer hover:bg-gray-100 aspect-square w-full max-w-[50px]"
                  onClick={() => handleIconSelect(icon)}
                >
                  <Icon name={icon} color="#000" size={18} />
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllIcons;
