import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";

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

      <Button
        onClick={() => DownloadIcon(Date.now())}
        className="flex gap-2 font-semibold mr-2"
      >
        Download
        <ChevronDown className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default Header;
