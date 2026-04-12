"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function AnimatedBackground({
    children,
    defaultValue,
    className,
    transition,
    enableHover = true,
}) {
    const [active, setActive] = useState(defaultValue);

    return (
        <div
            className={`relative flex items-center ${className}`}
            onMouseLeave={() => setActive(defaultValue)}
        >
            {children.map((child) => {
                const id = child.props["data-id"];
                const isActive = active === id;

                return (
                    <div
                        key={id}
                        className="relative"
                        onMouseEnter={() => enableHover && setActive(id)}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="nav-bg"
                                className="absolute inset-0 rounded-md bg-white shadow-sm"
                                transition={transition}
                            />
                        )}

                        <div className="relative z-10 px-2 py-1">
                            {child}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}