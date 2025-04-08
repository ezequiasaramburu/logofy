import { ChevronDown, ImageIcon, FileCodeIcon } from "lucide-react";
import { Button } from "./button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

interface HeaderProps {
  DownloadIcon: (date: any) => void;
}

const Header: React.FC<HeaderProps> = ({ DownloadIcon }) => {
  return (
    <div className="fixed top-0 backdrop-blur-lg py-3 w-full z-50 border-b shadow-sm">
      <div className="max-w-[2250px] mx-auto px-4 flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Image src="/icon.svg" alt="logo" width={28} height={28} />
          <h1 className="font-semibold text-xl">SimpleLogo</h1>
        </div>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex gap-2 font-semibold mr-2">
                Download
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() =>
                  DownloadIcon({ format: "svg", timestamp: Date.now() })
                }
                className="flex items-center gap-2"
              >
                <FileCodeIcon className="w-4 h-4" />
                Download SVG
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  DownloadIcon({ format: "png", timestamp: Date.now() })
                }
                className="flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                Download PNG
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Header;
