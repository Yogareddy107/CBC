'use client';

import { ArrowRight } from "lucide-react"
import { useState, Suspense, lazy } from "react"

const Dithering = lazy(() =>
    import("@paper-design/shaders-react").then((mod) => ({ default: mod.Dithering }))
)

export function CTASection({ children }: { children?: React.ReactNode }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <section className="w-full flex justify-center items-center px-4 md:px-6">
            <div
                className="w-full max-w-[1200px] relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative overflow-hidden rounded-[48px] border border-[#1A1A1A]/5 bg-white shadow-sm py-20 px-[60px] flex flex-col items-center justify-center duration-500">
                    <Suspense fallback={<div className="absolute inset-0 bg-muted/20" />}>
                        <div className="absolute inset-0 z-0 pointer-events-none opacity-25 mix-blend-multiply">
                            <Dithering
                                colorBack="#00000000" // Transparent
                                colorFront="#FF7D29"  // Using CheckBeforeCommit primary orange
                                shape="warp"
                                type="4x4"
                                speed={isHovered ? 0.6 : 0.2}
                                className="size-full"
                                minPixelRatio={1}
                            />
                        </div>
                    </Suspense>

                    <div className="relative z-10 w-full max-w-4xl mx-auto text-center flex flex-col items-center">

                        <div className="mt-6 mb-8 inline-flex items-center gap-2 rounded-full border border-[#FF7D29]/10 bg-[#FF7D29]/5 px-4 py-1.5 text-sm font-medium text-[#FF7D29] backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF7D29] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF7D29]"></span>
                            </span>
                            Architectural Analysis
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#1A1A1A] mb-8 leading-[1.15] text-balance drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]">
                            Understand any codebase in <span className="bg-gradient-to-r from-[#E65A00] to-[#FF8C38] bg-clip-text text-transparent">minutes.</span>
                        </h1>

                        {/* Description */}
                        <p className="text-[#1A1A1A]/60 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
                            Stop digging through code manually.
                            See the system architecture, problem areas, and integration risks instantly
                        </p>

                        {children}
                    </div>
                </div>
            </div>
        </section>
    )
}
