import { KeyRound, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SecuritySettingCardProps {
  email?: string;
}

// Ghi chú: backend chưa có API đổi email/mật khẩu/2FA cho shop, đây vẫn là UI tĩnh.
export const SecuritySettingCard = ({ email }: SecuritySettingCardProps) => {
  return (
    <Card id="security" className="scroll-mt-6 gap-0 py-0 shadow-xs">
      <CardHeader className="border-b border-border px-5 py-5 sm:px-6">
        <CardTitle className="text-lg">Security</CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage account access and authentication security.
        </p>
      </CardHeader>
      <CardContent className="divide-y divide-border px-5 sm:px-6">
        <div className="grid gap-2 py-5 sm:grid-cols-[160px_minmax(0,1fr)_auto] sm:items-center">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Mail className="size-4 text-muted-foreground" aria-hidden="true" />
            Email
          </div>
          <p className="truncate text-sm text-muted-foreground">
            {email ?? "user@example.com"}
          </p>
          <Button type="button" variant="outline" size="sm">
            Update email
          </Button>
        </div>
        <div className="grid gap-2 py-5 sm:grid-cols-[160px_minmax(0,1fr)_auto] sm:items-center">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <KeyRound
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
            Password
          </div>
          <p className="font-mono text-sm text-muted-foreground">
            ••••••••••••
          </p>
          <Button type="button" variant="outline" size="sm">
            Change password
          </Button>
        </div>
        <div className="flex items-center justify-between gap-6 py-5">
          <div className="flex gap-3">
            <LockKeyhole
              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-semibold">Two-factor authentication</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Add an extra verification step when signing in.
              </p>
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" disabled>
            Enable
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
