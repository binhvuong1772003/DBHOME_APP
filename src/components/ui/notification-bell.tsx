import { Button } from './button';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from './sheet';
import { Bell, GripHorizontal } from 'lucide-react';
import { useNotification } from '@/hooks/useNotification';
import { Label } from './label';
import { useState } from 'react';
import { XIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardTitle } from './card';
export const NotificationBell = () => {
  const { unreadCount, notifications, markRead, deleteNoti } =
    useNotification();
  const [status, setStatus] = useState<'all' | 'unread'>('all');
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-3 h-3 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 p-0">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <Label className="font-bold text-lg">Thông báo</Label>
            <Button variant="ghost" size="icon">
              <GripHorizontal />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setStatus('all')}
              className={`px-3 py-1 rounded-full font-medium ${status === 'all' ? 'bg-primary text-primary-foreground' : 'bg-primary text-muted-foreground bg-* hover:bg-* hover:opacity-70 transition-opacity'}`}
            >
              Tất cả
            </Button>
            <Button
              onClick={() => setStatus('unread')}
              className={`px-3 py-1 rounded-full font-medium ${status === 'unread' ? 'bg-primary text-primary-foreground' : 'bg-primary text-muted-foreground bg-* hover:bg-* hover:opacity-70 transition-opacity'}`}
            >
              Chưa đọc
            </Button>
          </div>
        </SheetHeader>
        {status === 'all' ? (
          <div>
            {notifications.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-8">
                Không có thông báo
              </p>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <Card
                    className={`rounded-none border-b border-border cursor-pointer hover:bg-muted transition-colors ${
                      notification.isRead
                        ? 'opacity-60'
                        : 'border-l-2 border-l-secondary bg-secondary/5'
                    }`}
                    onClick={() =>
                      !notification.isRead && markRead(notification.id)
                    }
                  >
                    <CardContent className="flex items-start justify-between gap-3 px-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm">
                          {notification.title}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {notification.content}
                        </CardDescription>
                      </div>
                      {!notification.isRead ? (
                        <div className="w-2 h-2 rounded-full bg-secondary shrink-0 mt-1" />
                      ) : (
                        <button
                          onClick={() => deleteNoti(notification.id)}
                          className="cursor-pointer"
                        >
                          <XIcon className="w-5 h-5" />
                        </button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {notifications.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-8">
                Không có thông báo
              </p>
            ) : (
              <div>
                {notifications.map((notification) =>
                  notification.isRead ? null : (
                    <Card
                      className={`rounded-none border-b border-border cursor-pointer hover:bg-muted transition-colors ${
                        notification.isRead
                          ? 'opacity-60'
                          : 'border-l-2 border-l-secondary bg-secondary/5'
                      }`}
                      onClick={() =>
                        !notification.isRead && markRead(notification.id)
                      }
                    >
                      <CardContent className="flex items-start justify-between gap-3 px-4">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm">
                            {notification.title}
                          </CardTitle>
                          <CardDescription className="text-xs mt-1">
                            {notification.content}
                          </CardDescription>
                        </div>
                        {!notification.isRead ? (
                          <div className="w-2 h-2 rounded-full bg-secondary shrink-0 mt-1" />
                        ) : (
                          <button
                            onClick={() => deleteNoti(notification.id)}
                            className="cursor-pointer"
                          >
                            <XIcon className="w-5 h-5" />
                          </button>
                        )}
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
