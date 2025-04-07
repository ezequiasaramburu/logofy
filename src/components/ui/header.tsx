import { ChevronDown, FileIcon, ImageIcon, FileCodeIcon } from "lucide-react";
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
    <div className="px-4 fixed top-0 backdrop-blur-lg py-3 flex justify-between border-b shadow-sm  w-full z-50 ">
      <div className="flex gap-2 items-center ml-2">
        <Image src="/icon.svg" alt="logo" width={28} height={28} />

        <h1 className="font-semibold text-xl">Logofy</h1>
      </div>

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
          <DropdownMenuItem
            onClick={() =>
              DownloadIcon({ format: "ico", timestamp: Date.now() })
            }
            className="flex items-center gap-2"
          >
            <FileIcon className="w-4 h-4" />
            Download ICO
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Header;
