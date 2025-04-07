import { Button } from "./ui/button";

interface ButtonProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Buttons = ({ activeTab, setActiveTab }: ButtonProps) => {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] border-r p-3">
      <div className="flex flex-col gap-3">
        <Button
          onClick={() => setActiveTab("text")}
          variant={activeTab === "text" ? "default" : "secondary"}
        >
          Text
        </Button>
        <Button
          onClick={() => setActiveTab("icon")}
          variant={activeTab === "icon" ? "default" : "secondary"}
        >
          Icon
        </Button>
        <Button
          onClick={() => setActiveTab("background")}
          variant={activeTab === "background" ? "default" : "secondary"}
        >
          Background
        </Button>
      </div>

      <div className="mt-auto pt-4 mb-4 flex justify-center flex-col gap-4">
        <p className="text-xs text-muted-foreground text-center">
          Made with 🧉 & 💙 by{" "}
          <a
            href="https://ezequias.me"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Ezequías
          </a>
        </p>
        <p className="text-xs text-muted-foreground text-center">
          Icons by{" "}
          <a
            href="https://lucide.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Lucide
          </a>
        </p>
      </div>
    </div>
  );
};

export default Buttons;
