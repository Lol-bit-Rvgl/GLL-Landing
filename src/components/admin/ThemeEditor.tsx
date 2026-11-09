"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, AlertCircle, Check } from "lucide-react";
import type { MemberThemeFont } from "@/types/member";

const presetColors = ["#ec4899", "#f59e0b", "#38bdf8", "#dc2626", "#10b981", "#8b5cf6", "#06b6d4", "#f97316"];

interface ThemeEditorProps {
  initialTheme?: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
    glow: string;
    font: "sans" | "serif" | "mono" | "display";
    radius: string;
    texture: "none" | "scanlines" | "grid" | "static" | "vhs";
    effects: {
      scanlines: boolean;
      noise: boolean;
      glitch: boolean;
      glow: "none" | "soft" | "strong";
    };
  };
  memberSlug?: string;
}

export function ThemeEditor({ initialTheme, memberSlug }: ThemeEditorProps) {
  const [theme, setTheme] = useState(initialTheme || {
    primary: "#ec4899",
    secondary: "#f59e0b",
    background: "#050507",
    foreground: "#e7e4de",
    muted: "#a1a1aa",
    border: "rgba(255, 255, 255, 0.08)",
    glow: "#ec4899",
    font: "mono" as const,
    radius: "0.5rem",
    texture: "none" as const,
    effects: {
      scanlines: false,
      noise: false,
      glitch: false,
      glow: "none" as const,
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!memberSlug) return;
    
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/members/${memberSlug}/theme`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ theme }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save theme");
      }
      
      console.log("Theme saved:", memberSlug, theme);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Error saving theme:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Messages */}
      {saved && (
        <div className="flex items-center gap-2 rounded-md bg-emerald-600/20 p-3 text-emerald-200">
          <Check className="h-5 w-5" />
          <span className="text-sm">Tema guardado exitosamente</span>
        </div>
      )}

      {/* Warning */}
      {!memberSlug && (
        <div className="flex items-center gap-2 rounded-md border border-amber-600/30 bg-amber-600/10 p-3 text-amber-200">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">Selecciona un miembro para editar su tema</span>
        </div>
      )}

      {/* Preview Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-zinc-400">VISUAL PREVIEW</h3>
        <Badge className="bg-red-600/20 text-red-300 border-red-600/50 font-mono text-xs">
          LIVE
        </Badge>
      </div>

      {/* Live Preview Card */}
      <Card style={{ background: theme.background, borderColor: theme.border, color: theme.foreground }}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ background: theme.primary, borderColor: theme.border }}
            >
              TEST
            </div>
            <div>
              <p className="font-bold text-zinc-100">Test Member</p>
              <p className="text-xs text-zinc-400">Test Role</p>
            </div>
          </div>

          <div style={{ background: theme.background, borderColor: theme.border }}>
            <p className="font-mono text-xs text-zinc-400 mb-2">CARD PREVIEW</p>
            <h3 className="font-bold text-lg" style={{ color: theme.primary }}>
              Card Title
            </h3>
          </div>
        </CardContent>
      </Card>

      {/* Color Controls */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ColorPicker
          label="PRIMARY"
          value={theme.primary}
          onChange={(v) => setTheme((p) => ({ ...p, primary: v }))}
        />
        <ColorPicker
          label="SECONDARY"
          value={theme.secondary}
          onChange={(v) => setTheme((p) => ({ ...p, secondary: v }))}
        />
        <ColorPicker
          label="BACKGROUND"
          value={theme.background}
          onChange={(v) => setTheme((p) => ({ ...p, background: v }))}
        />
      </div>

      {/* Font Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="font-mono text-sm">Typography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-mono text-xs text-zinc-400">FONT</Label>
            <select
              value={theme.font}
              onChange={(e) => setTheme((p) => ({ ...p, font: e.target.value as MemberThemeFont }))}
              className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200"
            >
              <option value="mono">Monospace</option>
              <option value="sans">Sans</option>
              <option value="serif">Serif</option>
              <option value="display">Display</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="font-mono text-xs text-zinc-400">RADIUS</Label>
            <Input
              type="number"
              min="0"
              max="9999"
              value={parseInt(theme.radius?.replace("rem", "") || "0.5")}
              onChange={(e) => setTheme((p) => ({ ...p, radius: `${e.target.value}rem` }))}
              className="font-mono text-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Effects */}
      <Card>
        <CardHeader>
          <CardTitle className="font-mono text-sm">Effects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-red-600/30 bg-black/30 p-3">
            <Label className="font-mono text-xs text-zinc-200">GLITCH HOVER</Label>
            <input
              type="checkbox"
              checked={theme.effects.glitch}
              onChange={(e) =>
                setTheme((p) => ({ ...p, effects: { ...p.effects, glitch: e.target.checked } }))
              }
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-red-600/30 bg-black/30 p-3">
            <Label className="font-mono text-xs text-zinc-200">SCANLINES</Label>
            <input
              type="checkbox"
              checked={theme.effects.scanlines}
              onChange={(e) =>
                setTheme((p) => ({ ...p, effects: { ...p.effects, scanlines: e.target.checked } }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Button
        className="border-2 border-pink-400 bg-pink-400/10 text-pink-300 hover:bg-pink-400/20"
        onClick={handleSave}
        disabled={isSaving || !memberSlug}
      >
        <Save className="mr-2 h-4 w-4" />
        {isSaving ? "GUARDANDO..." : "GUARDAR TEMA"}
      </Button>
    </div>
  );
}

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="font-mono text-xs text-zinc-400">{label}</Label>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            const input = document.createElement("input");
            input.type = "color";
            input.value = value;
            input.onchange = () => onChange(input.value);
            input.click();
          }}
          className="h-10 w-10 rounded-md border border-red-600/30"
          style={{ backgroundColor: value }}
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono text-xs"
        />
      </div>
      <div className="flex flex-wrap gap-1">
        {presetColors.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className="h-6 w-6 rounded-full border-2 border-red-600/30"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}