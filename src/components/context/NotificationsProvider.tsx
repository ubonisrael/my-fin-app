import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { Fade } from '@progress/kendo-react-animation';

interface NotificationState {
  status: boolean;
  message: "";
  type: "success" | "error" | "undefined"
}

interface NotificationContextType {
  setNotificationMessage: (type: string, message:string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationsProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationState>({ status: false, message: "", type: "undefined" });

  const setNotificationMessage = (type: string, message: string) => setNotifications((prev) => ({
    status: true, message, type
  }))

  // remove notification after 3 seconds
  useEffect(() => {
    if (notifications.status) {
      setTimeout(() => {
        setNotifications((prev) => ({ status: false, message: "", type: "undefined" }))
      }, 3000);
    }
  }, [notifications.status])

  return (
    <NotificationContext.Provider value={{ setNotificationMessage }}>
      {children}
      <NotificationGroup
        style={{
          right: 0,
          bottom: 16,
          alignItems: 'flex-start',
          flexWrap: 'wrap-reverse'
        }}
      >
        <Fade>
          {notifications.status && <Notification
            type={{ style: notifications.type, icon: true }}
            closable={true}
            onClose={() => setNotifications({ status: false, message: "", type: "undefined" })}
          >
            <span>{notifications.message}</span>
          </Notification>}
        </Fade>
      </NotificationGroup>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
