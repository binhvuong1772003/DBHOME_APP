import { useMemo, useRef } from "react";
import { Image as ImageIcon, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface ImagesBrandingSettingProps {
  currentShop: { name?: string } | null;
  background: File | null;
  coverUrl: string | null;
  onBackgroundChange: (files: File[]) => void;
}

export const ImagesBrandingSetting = ({
  currentShop,
  background,
  coverUrl,
  onBackgroundChange,
}: ImagesBrandingSettingProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverPreview = useMemo(
    () => (background ? URL.createObjectURL(background) : coverUrl),
    [background, coverUrl],
  );

  return (
    <>
      <Card id="images-branding" className="scroll-mt-6 gap-0 py-0 shadow-xs">
        <CardHeader className="border-b border-border px-5 py-5 sm:px-6">
          <CardTitle className="text-lg">Shop Images</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage the cover image and gallery shown to customers.
          </p>
        </CardHeader>
        <CardContent className="space-y-7 px-5 py-6 sm:px-6">
          <section aria-labelledby="cover-image-heading">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <h2 id="cover-image-heading" className="text-sm font-semibold">
                  Cover / Banner
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Recommended ratio 16:5.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    onBackgroundChange(Array.from(e.target.files ?? []))
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload aria-hidden="true" />
                  Change cover
                </Button>
                {background && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => {
                      onBackgroundChange([]);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
            <div className="relative flex aspect-16/5 min-h-44 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/50">
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Cover"
                  className="absolute inset-0 size-full object-cover"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-primary/5" />
                  <div className="relative flex flex-col items-center text-center">
                    <div className="flex size-11 items-center justify-center rounded-lg bg-card text-primary shadow-xs">
                      <ImageIcon className="size-5" aria-hidden="true" />
                    </div>
                    <p className="mt-3 text-sm font-semibold">
                      No cover image yet
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {currentShop?.name ?? "Your shop"} storefront
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>

          <Separator />

          <section aria-labelledby="gallery-heading">
            <div>
              <h2 id="gallery-heading" className="text-sm font-semibold">
                Gallery
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Showcase your studio, team, and recent work.
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <article className="group overflow-hidden rounded-xl border border-border bg-muted/40">
                <div className="flex aspect-square items-center justify-center bg-primary/5">
                  <ImageIcon className="size-7 text-primary" aria-hidden="true" />
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-border p-2">
                  <Button type="button" variant="ghost" size="xs">
                    Replace
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Remove studio interior image"
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
              </article>
              <article className="group overflow-hidden rounded-xl border border-border bg-muted/40">
                <div className="flex aspect-square items-center justify-center bg-secondary/10">
                  <ImageIcon
                    className="size-7 text-secondary"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-border p-2">
                  <Button type="button" variant="ghost" size="xs">
                    Replace
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Remove nail service image"
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
              </article>
              <article className="group overflow-hidden rounded-xl border border-border bg-muted/40">
                <div className="flex aspect-square items-center justify-center bg-accent">
                  <ImageIcon
                    className="size-7 text-accent-foreground"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-border p-2">
                  <Button type="button" variant="ghost" size="xs">
                    Replace
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Remove salon team image"
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
              </article>
              <button
                type="button"
                className="flex aspect-square flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 text-muted-foreground outline-none transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <Plus className="size-6" aria-hidden="true" />
                <span className="mt-2 text-xs font-semibold">Add image</span>
              </button>
            </div>
          </section>
        </CardContent>
      </Card>

      <Card className="gap-0 py-0 shadow-xs">
        <CardHeader className="border-b border-border px-5 py-5 sm:px-6">
          <CardTitle className="text-lg">Branding</CardTitle>
          <p className="text-sm text-muted-foreground">
            Customize how your shop appears across the application.
          </p>
        </CardHeader>
        <CardContent className="grid gap-6 px-5 py-6 sm:grid-cols-2 sm:px-6">
          <div className="space-y-3">
            <Label>Favicon</Label>
            <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/25 p-4">
              <div className="flex size-10 items-center justify-center rounded-md border border-border bg-card text-sm font-bold text-primary">
                {currentShop?.name?.slice(0, 2).toUpperCase() ?? "SH"}
              </div>
              <div>
                <Button type="button" variant="outline" size="sm" disabled>
                  Change favicon
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">
                  ICO, SVG or PNG. Coming soon.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="display-name">Shop display name</Label>
            <Input
              id="display-name"
              defaultValue={currentShop?.name ?? ""}
              disabled
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Primary color</Label>
              <div className="flex h-10 items-center gap-2 rounded-lg border border-input bg-background px-3">
                <span className="size-5 rounded-full bg-primary ring-1 ring-border" />
                <span className="text-xs font-medium">Primary</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Secondary color</Label>
              <div className="flex h-10 items-center gap-2 rounded-lg border border-input bg-background px-3">
                <span className="size-5 rounded-full bg-secondary ring-1 ring-border" />
                <span className="text-xs font-medium">Secondary</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
