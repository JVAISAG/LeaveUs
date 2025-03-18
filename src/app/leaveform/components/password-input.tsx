import { EyeOffIcon, EyeIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Box } from "./box";
import {
    FormField,
    FormItem,
    FormControl,
    FormMessage,
    FormDescription,
} from "./form";
import { Input } from "./input";
import { createElement, useState } from "react";

type PasswordFieldProps = {
    name?: string;
    placeholder?: string;
    description?: string | JSX.Element;
};

export function PasswordField({
    name = "password",
    placeholder = "Enter password",
    description,
}: PasswordFieldProps) {
    const { control, getFieldState } = useFormContext();
    const [passwordVisibility, setPasswordVisibility] = useState(false);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Box className="relative">
                            <Input
                                {...field}
                                type={passwordVisibility ? "text" : "password"}
                                autoComplete="on"
                                placeholder={placeholder}
                                className={`pr-12 ${getFieldState(name).error && "text-destructive"}`}
                                value={field.value ?? ""}
                            />
                            <Box
                                className="absolute inset-y-0 right-0 flex cursor-pointer items-center p-3 text-muted-foreground"
                                onClick={() => setPasswordVisibility(!passwordVisibility)}
                            >
                                {createElement(passwordVisibility ? EyeOffIcon : EyeIcon, {
                                    className: "h-6 w-6",
                                })}
                            </Box>
                        </Box>
                    </FormControl>

                    {description && <FormDescription>{description}</FormDescription>}
                </FormItem>
            )}
        />
    );
}