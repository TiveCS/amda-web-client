import { useState } from "react";
import SidebarNav from "./SidebarNav";

export type AccordionItem = {
  title: string;
  to: string;
};

interface AccordionProps {
  items: AccordionItem[];
  text: string;
}

export default function Accordion(props: AccordionProps) {
  const isMatch = props.items.some((item) => {
    return window.location.pathname === item.to;
  });
  const [open, setOpen] = useState(isMatch);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpen(!open);
  };

  return (
    <div id="accordion" className="w-full h-fit flex flex-col cursor-pointer">
      <button
        id="accordion-button"
        onClick={handleClick}
        className="text-gray-50 cursor-pointer w-full font-poppins h-fit no-underline px-4 py-3 group bg-transparent border-none text-left hover:bg-black rounded-md"
      >
        {props.text}
      </button>

      {open && (
        <div
          id="accordion-content"
          className="relative ml-4 mt-4 w-full flex flex-col gap-y-2"
        >
          {props.items.map((item, index) => {
            return (
              <SidebarNav key={index} to={item.to}>
                {item.title}
              </SidebarNav>
            );
          })}
        </div>
      )}
    </div>
  );
}
