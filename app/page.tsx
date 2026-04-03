"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Copy, 
  RefreshCw, 
  ShieldCheck, 
  Key, 
  Binary, 
  Hash, 
  Code,
  Check,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type BitLength = "32" | "64" | "128" | "256";
type Encoding = "hex" | "base64" | "base64url";

export default function Home() {
  const [bitLength, setBitLength] = useState<BitLength>("128");
  const [encoding, setEncoding] = useState<Encoding>("hex");
  const [secret, setSecret] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const generateSecret = useCallback(() => {
    setIsGenerating(true);
    
    // Convert bits to bytes
    const byteLength = parseInt(bitLength) / 8;
    const array = new Uint8Array(byteLength);
    window.crypto.getRandomValues(array);

    let result = "";
    if (encoding === "hex") {
      result = Array.from(array)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    } else if (encoding === "base64") {
      result = btoa(String.fromCharCode(...array));
    } else if (encoding === "base64url") {
      result = btoa(String.fromCharCode(...array))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
    }

    // Simulate a small delay for visual feedback
    setTimeout(() => {
      setSecret(result);
      setIsGenerating(false);
      setCopied(false);
    }, 150);
  }, [bitLength, encoding]);

  useEffect(() => {
    if (mounted) {
      generateSecret();
    }
  }, [generateSecret, mounted]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      toast.success("Secret copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy secret.");
    }
  };

  if (!mounted) return null;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header Section */}
        <header className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-2"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure & Private Generation</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400"
          >
            SecretGen
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-neutral-500 dark:text-neutral-400 text-lg max-w-lg mx-auto"
          >
            Generate cryptographically strong authentication secrets locally in your browser.
          </motion.p>
        </header>

        {/* Main Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-neutral-200 dark:border-neutral-800/50 shadow-2xl overflow-hidden bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl">
            <CardContent className="p-6 md:p-10 space-y-10">
              {/* Configuration Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label htmlFor="bit-length" className="text-sm font-semibold flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                    <Binary className="w-4 h-4 text-primary" /> Bit Length
                  </Label>
                  <Select value={bitLength} onValueChange={(v) => setBitLength(v as BitLength)}>
                    <SelectTrigger id="bit-length" className="h-12 bg-neutral-50/50 dark:bg-neutral-950/50 border-neutral-200 dark:border-neutral-800 transition-all hover:border-primary/50">
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="32">32-bit (4 bytes)</SelectItem>
                      <SelectItem value="64">64-bit (8 bytes)</SelectItem>
                      <SelectItem value="128">128-bit (16 bytes)</SelectItem>
                      <SelectItem value="256">256-bit (32 bytes)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-neutral-400 italic">Higher bit length increases entropy and security.</p>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="encoding" className="text-sm font-semibold flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                    <Code className="w-4 h-4 text-primary" /> Encoding
                  </Label>
                  <Select value={encoding} onValueChange={(v) => setEncoding(v as Encoding)}>
                    <SelectTrigger id="encoding" className="h-12 bg-neutral-50/50 dark:bg-neutral-950/50 border-neutral-200 dark:border-neutral-800 transition-all hover:border-primary/50">
                      <SelectValue placeholder="Select encoding" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hex">Hexadecimal (0-9, a-f)</SelectItem>
                      <SelectItem value="base64">Base64 (Standard)</SelectItem>
                      <SelectItem value="base64url">Base64URL (URL Safe)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-neutral-400 italic">Choose the format required by your application.</p>
                </div>
              </div>

              <Separator className="bg-neutral-100 dark:bg-neutral-800/50" />

              {/* Secret Display */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                    <Key className="w-4 h-4 text-primary" /> Generated Secret
                  </Label>
                  <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-widest border-primary/30 text-primary bg-primary/5">
                    {bitLength} BIT {encoding}
                  </Badge>
                </div>
                
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Input
                        readOnly
                        value={secret}
                        className="h-16 font-mono text-lg md:text-xl pr-12 bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 focus-visible:ring-primary shadow-inner"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {isGenerating && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          >
                            <RefreshCw className="w-5 h-5 text-primary/50" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="h-16 px-8 shrink-0 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                      onClick={copyToClipboard}
                    >
                      <AnimatePresence mode="wait">
                        {copied ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="flex items-center gap-2"
                          >
                            <Check className="w-5 h-5 text-green-500" />
                            <span className="font-semibold">Copied</span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="copy"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="flex items-center gap-2"
                          >
                            <Copy className="w-5 h-5" />
                            <span className="font-semibold">Copy</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: ShieldCheck, label: "Entropy", value: `${bitLength} Bits`, color: "text-green-500" },
                  { icon: Hash, label: "Length", value: `${secret.length} Chars`, color: "text-blue-500" },
                  { icon: Info, label: "Security", value: parseInt(bitLength) >= 128 ? "High" : "Standard", color: "text-amber-500" }
                ].map((stat, i) => (
                  <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    className="p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-neutral-900/50 flex flex-col items-center text-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-default"
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{stat.label}</span>
                    <span className="text-base font-bold text-neutral-700 dark:text-neutral-200">{stat.value}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="p-6 md:p-10 pt-0">
              <Button 
                className="w-full h-14 text-lg font-bold gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
                onClick={generateSecret}
                disabled={isGenerating}
              >
                <RefreshCw className={`w-5 h-5 ${isGenerating ? "animate-spin" : ""}`} />
                Regenerate Secret
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Footer / Info Section */}
        <footer className="pt-8 pb-12 text-center space-y-8">
          <div className="max-w-xl mx-auto space-y-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Secrets are generated locally using the 
              <code className="mx-1 px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-md text-xs font-mono text-primary">Web Crypto API</code>. 
              No data ever leaves your device.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {[
              { label: "Documentation", href: "#" },
              { label: "Security Audit", href: "#" },
              { label: "Privacy Policy", href: "#" },
              { label: "GitHub", href: "#" }
            ].map((link) => (
              <a 
                key={link.label}
                href={link.href} 
                className="text-xs font-semibold text-neutral-400 hover:text-primary transition-colors tracking-wide uppercase"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800/50">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              &copy; {new Date().getFullYear()} SecretGen &bull; Built for Security
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
