import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import React, { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

type LinkType = {
    label: string;
    route: string;
};

interface Props {
    title: string;
    links: LinkType[];
    className?: React.HTMLAttributes<HTMLDivElement>['className'];
}

export default function NavAccordion({ title, links, className }: Props) {
    const activeChild = true;
    const hasActiveChild = Boolean(activeChild);

    const [isOpen, setIsOpen] = React.useState(hasActiveChild);

    return (
        <div className={className}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative inline-flex items-center justify-between w-full font-medium text-white"
            >
                {title}

                <div>
                    {isOpen ? (
                        <IconChevronDown className="w-3 h-3 ml-2" />
                    ) : (
                        <IconChevronRight className="w-3 h-3 ml-2" />
                    )}
                </div>
            </button>

            <div
                id="accordion-items"
                className={`flex flex-col mt-4 ml-2 transition-all duration-500 overflow-hidden rounded-md ${
                    isOpen ? 'max-h-64' : 'max-h-0'
                }`}
            >
                {links.map(link => (
                    <Link
                        key={link.route}
                        to={"/"}
                        className={`${
                           false ? 'bg-red-700' : ''
                        } px-3 py-2 rounded-md text-white`}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
