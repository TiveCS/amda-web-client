import { useMemo, useState } from "react";
import SidebarNav from "./SidebarNav";
import { RoleType } from "../../types";
import { checkRoleAllowed } from "../../utils";
import { useProfileStore } from "@zustand/profileStore";

export type AccordionItem = {
  title: string;
  to: string;
  allow?: RoleType[];
  disallow?: RoleType[];
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

  const { profile } = useProfileStore();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpen(!open);
  };

  const items = useMemo(() => {
    return props.items.map((item, index) => {
      const isAllowed = checkRoleAllowed(
        profile?.role.slug as unknown as RoleType,
        {
          whiteListedRoles: item.allow,
          blackListedRoles: item.disallow,
        }
      );

      if (!isAllowed) return null;

      return (
        <SidebarNav key={index} to={item.to}>
          {item.title}
        </SidebarNav>
      );
    });
  }, [profile?.role.slug, props.items]);

  const itemsAmount = useMemo(() => {
    return items.filter((item) => item !== null).length;
  }, [items]);

  return (
    <div
      id="accordion"
      className={`${
        itemsAmount === 0 ? "hidden " : ""
      } w-full h-fit flex flex-col cursor-pointer`}
    >
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
          {items}
        </div>
      )}
    </div>
  );
}
