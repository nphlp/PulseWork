import { combo } from "@lib/combo";
import { MouseEvent, ReactNode, useContext } from "react";
import { theme } from "../theme";
import { Context } from "./context";

type ComponentProps = {
    children: ReactNode;
};

const Component = (props: ComponentProps) => {
    const { children } = props;

    const { variant, className } = useContext(Context);

    const preventDefault = (e: MouseEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <label className={combo(theme[variant].component, className?.component)} onClick={preventDefault}>
            {children}
        </label>
    );
};

export default Component;
