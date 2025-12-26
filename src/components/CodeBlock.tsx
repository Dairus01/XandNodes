"use client";

import React from "react";
import { CopyButton } from "./CopyButton";
import { Terminal } from "lucide-react";

interface CodeBlockProps {
    code: string;
    language?: string;
    title?: string;
    showLineNumbers?: boolean;
}

export function CodeBlock({ code, language, title, showLineNumbers = false }: CodeBlockProps) {
    const lines = code.trim().split("\n");

    return (
        <div className="group relative my-6 overflow-hidden rounded-xl border border-white/5 bg-[#0a0a0a] transition-all hover:border-primary/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.05)]">
            {/* Window Header */}
            <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-2">
                <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-[#FF003C]/40" />
                        <div className="h-2.5 w-2.5 rounded-full bg-[#FFB000]/40" />
                        <div className="h-2.5 w-2.5 rounded-full bg-[#00F0FF]/40" />
                    </div>
                    {title && (
                        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
                            <Terminal size={12} className="opacity-50" />
                            {title}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {language && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/40">
                            {language}
                        </span>
                    )}
                    <CopyButton
                        content={code.trim()}
                        className="h-6 w-6 opacity-40 transition-opacity group-hover:opacity-100"
                    />
                </div>
            </div>

            {/* Code Area */}
            <div className="max-h-[500px] overflow-auto p-4 custom-scrollbar">
                <table className="border-collapse text-sm">
                    <tbody>
                        {lines.map((line, i) => (
                            <tr key={i} className="group/line">
                                {showLineNumbers && (
                                    <td className="pr-4 text-right font-mono text-xs text-muted-foreground/20 select-none w-8">
                                        {i + 1}
                                    </td>
                                )}
                                <td className="font-mono leading-relaxed text-muted-foreground/90 group-hover/line:text-primary/90 transition-colors whitespace-pre">
                                    {line || " "}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Subtle Glow Bottom */}
            <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
    );
}
