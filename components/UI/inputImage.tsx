"use client";

import ImageRatio from "@comps/UI/imageRatio";
import { combo } from "@lib/combo";
import { Image as ImageTemplate, X } from "lucide-react";
import { ChangeEvent, DragEvent, InputHTMLAttributes, MouseEvent, useRef } from "react";
import Button from "./button/button";

type InputFileProps = {
    label: string;
    variant?: "default" | false;
    required?: boolean;
    onChange: (file: File | null) => void;
    imagePreview: File | null;
    classComponent?: string;
    classLabel?: string;
    classContent?: string;
} & Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "label" | "type" | "accept" | "className" | "required" | "label" | "onChange"
>;

/**
 * Input image with preview
 * @example
 * ```tsx
 * // Define the state
 * const [image, setImage] = useState<File | null>(null);
 *
 * // Use the component
 * <InputImage
 *     label="Image"
 *     onChange={setImage}
 *     imagePreview={image}
 * />
 * ```
 */
export default function InputImage(props: InputFileProps) {
    const {
        label,
        variant = "default",
        required = true,
        onChange,
        imagePreview,
        classComponent,
        classLabel,
        classContent,
        ...others
    } = props;

    /** Ref of input image */
    const refInputImage = useRef<HTMLInputElement>(null);

    /** Do not trigger onChange event of file input when image is already set */
    const preventDefault = (e: MouseEvent<HTMLLabelElement>) => {
        if (imagePreview) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    /** Add image to parent state */
    const handleAddImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (!imagePreview) onChange(e.target.files?.[0] as File);
    };

    /** Prevent default browser behavior of drag over event */
    const preventBrowserDropBehavior = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    /** Add image to parent state when dropping a file */
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!imagePreview) onChange(e.dataTransfer.files?.[0]);
    };

    /** Reset parent state and input field */
    const handleReset = () => {
        // Reset parent state
        onChange(null);
        // Reset input field
        if (refInputImage.current) {
            refInputImage.current.value = "";
        }
    };

    const theme = {
        default: {
            component: combo("block"),
            label: combo("text-sm mb-1 font-semibold text-foreground"),
            content: combo(
                "rounded-xl bg-background",
                "border-[1.5px] border-dashed border-gray-low focus:border-gray-medium",
                // Accessibility
                "outline-none ring-0 focus:ring-2 ring-teal-300",
                "transition-all duration-150",
            ),
        },
    };

    return (
        <label className={combo(variant && theme[variant].component, classComponent)} onClick={preventDefault}>
            {/* Label */}
            <div className={combo(variant && theme[variant].label, classLabel)}>{label}</div>

            {/* Content */}
            <div
                className={combo(!imagePreview && "cursor-pointer", variant && theme[variant].content, classContent)}
                onDragOver={preventBrowserDropBehavior}
                onDrop={handleDrop}
                // Allow to focus to enable key down listeners for Enter or Space
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!imagePreview && refInputImage.current) {
                            refInputImage.current.click();
                        }
                    }
                    if (e.key === "Delete" || e.key === "Backspace") {
                        e.preventDefault();
                        e.stopPropagation();
                        handleReset();
                    }
                }}
            >
                {imagePreview ? (
                    // Image preview
                    <div className="relative">
                        <ImageRatio
                            src={URL.createObjectURL(imagePreview)}
                            alt="Preview"
                            className={{ div: "w-full rounded-xl" }}
                            mode="onPageLoad"
                        />
                        <Button
                            label="Retirer l'image"
                            variant="none"
                            className={{
                                button: combo(imagePreview && "cursor-pointer", "absolute top-2 right-2 rounded-lg"),
                            }}
                            onClick={handleReset}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " " || e.key === "Delete" || e.key === "Backspace") {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleReset();
                                }
                            }}
                        >
                            <X className="size-8 text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.7)]" />
                        </Button>
                    </div>
                ) : (
                    // Placeholder
                    <div className="m-5 flex flex-col items-center gap-2">
                        <ImageTemplate className="text-gray-middle size-10 stroke-[1.5px]" />
                        <div className="text-gray-middle text-center text-sm">
                            Glissez une image ou cliquez pour sélectionner
                        </div>
                    </div>
                )}
            </div>

            {/* Hidden input field */}
            <input
                ref={refInputImage}
                type="file"
                onChange={handleAddImage}
                disabled={!!imagePreview}
                accept="image/*"
                className="hidden"
                required={required}
                {...others}
            />
        </label>
    );
}
