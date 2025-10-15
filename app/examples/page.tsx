import Link from "@comps/UI/button/link";
import Card from "@comps/UI/card";
import { Route } from "next";

type LinkProps = {
    label: string;
    href: Route;
    text: string;
};

export default function Page() {
    const linksLayout: LinkProps[] = [
        {
            label: "Auto-Layout",
            href: "/examples/auto-layout",
            text: "How to create a auto-layout",
        },
        {
            label: "Bouncy Height Resizer",
            href: "/examples/bouncy-height-resizer",
            text: "How to create a bouncy height resize",
        },
    ];

    const linksShadcn: LinkProps[] = [
        {
            label: "Shadcn Accordion",
            href: "/examples/accordion",
            text: "An accordion from origin/shadcn ui",
        },
        {
            label: "Shadcn Chart",
            href: "/examples/chart",
            text: "A chart from origin/shadcn ui",
        },
        {
            label: "Tanstack Table",
            href: "/examples/tanstack-table",
            text: "A table from tanstack with shadcn ui",
        },
    ];

    const linksCommon: LinkProps[] = [
        {
            label: "Components",
            href: "/examples/comps",
            text: "How to create reusable components",
        },
        {
            label: "Formulaire",
            href: "/examples/formulaire",
            text: "How to create a form with input, select...",
        },
        {
            label: "Perspective card",
            href: "/examples/perspective-card",
            text: "How to create a perspective card",
        },
    ];

    const linksDebugging: LinkProps[] = [
        {
            label: "Send Email",
            href: "/examples/email",
            text: "How to send an email with nodemailer",
        },
        {
            label: "SSR fetching",
            href: "/examples/ssr",
            text: "Debug SSR data fetching",
        },
    ];

    return (
        <div className="p-7">
            <Card className="space-y-6">
                <h1 className="w-full text-center text-2xl font-bold">Examples</h1>

                <section>
                    <h2 className="text-lg font-semibold">Layout</h2>
                    <hr className="mt-1 mb-4" />
                    <ul className="space-y-2">
                        {linksLayout.map((link, index) => (
                            <UnderlinedLink key={index} {...link} />
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-semibold">Shadcn UI</h2>
                    <hr className="mt-1 mb-4" />
                    <ul className="space-y-2">
                        {linksShadcn.map((link, index) => (
                            <UnderlinedLink key={index} {...link} />
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-semibold">Common</h2>
                    <hr className="mt-1 mb-4" />
                    <ul className="space-y-2">
                        {linksCommon.map((link, index) => (
                            <UnderlinedLink key={index} {...link} />
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-semibold">Debugging</h2>
                    <hr className="mt-1 mb-4" />
                    <ul className="space-y-2">
                        {linksDebugging.map((link, index) => (
                            <UnderlinedLink key={index} {...link} />
                        ))}
                    </ul>
                </section>
            </Card>
        </div>
    );
}

type UnderlinedLinkProps = LinkProps;

const UnderlinedLink = (props: UnderlinedLinkProps) => {
    const { href, label, text } = props;
    return (
        <li className="ml-4 list-disc">
            <Link href={href} variant="underline" label={label} className="decoration-gray-600" />
            <p className="pl-1 text-xs text-gray-500">{text}</p>
        </li>
    );
};
