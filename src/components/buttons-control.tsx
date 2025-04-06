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
          onClick={() => setActiveTab("icon")}
          variant={activeTab === "icon" ? "default" : "secondary"}
        >
          Icon
        </Button>
        <Button
          onClick={() => setActiveTab("text")}
          variant={activeTab === "text" ? "default" : "secondary"}
        >
          Text
        </Button>
        <Button
          onClick={() => setActiveTab("background")}
          variant={activeTab === "background" ? "default" : "secondary"}
        >
          Background
        </Button>
      </div>

      <div className="mt-auto pt-4 mb-6 flex justify-center">
        <p className="text-xs text-muted-foreground text-center">
          Made with 🧉 & 💙 by Ezequías
        </p>
      </div>
    </div>
  );
};

export default Buttons;
