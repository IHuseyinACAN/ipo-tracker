"use client"

import { Mail, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

export function Footer() {
    return (
        <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-8 relative z-10 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center space-x-2 text-sm text-muted-foreground"
                    >
                        <span>© {new Date().getFullYear()}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1.5 group">
                            <span>Hüseyin Acan tarafından</span>
                            <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" />
                            <span>yapıldı</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <a
                            href="mailto:0hsynacan@gmail.com"
                            className="group relative flex items-center space-x-2 px-4 py-2 rounded-full glass border border-primary/20 hover:border-primary/40 transition-all hover:shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Mail className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r from-blue-400 to-emerald-400 transition-all">
                                0hsynacan@gmail.com
                            </span>
                        </a>
                    </motion.div>

                    <div className="text-[10px] text-muted-foreground/30 uppercase tracking-[0.2em]">
                        Advanced Portfolio Tracking System
                    </div>
                </div>
            </div>

            {/* Subtle glow effect in the footer */}
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        </footer>
    )
}
