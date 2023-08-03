import { Link, useMatch } from "react-router-dom";

interface SidebarNavProps {
  children: React.ReactNode;
  to: string;
}

export default function SidebarNav(props: SidebarNavProps) {
  const isMatch = useMatch(props.to);

  return (
    <Link
      to={props.to}
      className={`text-gray-50 w-full h-fit no-underline px-4 py-2 group hover:bg-black rounded-md ${
        isMatch ? "bg-black" : ""
      }`}
    >
      {props.children}
    </Link>
  );
}
