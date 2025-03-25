import { Button } from "./ui/button";

interface ButtonProps {
  setActive: (i: number) => void;
  active: number;
}

const Buttons: React.FC<ButtonProps> = ({ setActive, active }) => {
  const BUTTONS = ["Icon", "Text", "BackGround"];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] border-r p-3">
      <div className="flex flex-col gap-3">
        {BUTTONS.map((itm, idx) => (
          <Button
            key={idx}
            onClick={() => setActive(idx)}
            variant={active === idx ? "default" : "secondary"}
          >
            {itm}
          </Button>
        ))}
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
