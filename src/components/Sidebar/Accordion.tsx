import { useProfileStore } from "@zustand/profileStore";
import { useMemo } from "react";
import { RoleType } from "../../types";
import { checkRoleAllowed } from "../../utils";
import SidebarNav from "./SidebarNav";

export type AccordionItem = {
  title: string;
  to: string;
  allow?: RoleType[];
  disallow?: RoleType[];
};

interface AccordionProps {
  items: AccordionItem[];
  text: string;
  isOpen: boolean;
  onOpen: () => void;
}

export default function Accordion(props: AccordionProps) {
  const { profile } = useProfileStore();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    props.onOpen();
  };

  const items = useMemo(() => {
    return props.items.map((item) => {
      const isAllowed = checkRoleAllowed(
        profile?.role.slug as unknown as RoleType,
        {
          whiteListedRoles: item.allow,
          blackListedRoles: item.disallow,
        }
      );

      if (!isAllowed) return null;

      return (
        <SidebarNav key={item.title} to={item.to}>
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

      {props.isOpen && (
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
