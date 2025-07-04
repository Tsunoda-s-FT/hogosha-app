import React, { useContext } from 'react';
import * as Notifications from 'expo-notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider, useSession } from '@/contexts/auth-context';
import { sendPushTokenToBackend } from '@/utils/utils';
import { router, Slot } from 'expo-router';
import { StudentProvider } from '@/contexts/student-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontSizeProvider } from '@/contexts/FontSizeContext';
import { initPushNotifications } from '@/utils/notifications';
import { Platform, Alert, Linking } from 'react-native';
import { I18nContext } from '@/contexts/i18n-context';

// Helper function to guide users for battery optimization
const showBatteryOptimizationAlert = async (i18n: any, language: string) => {
  if (Platform.OS === 'android') {
    Alert.alert(
      i18n[language].notificationsNotWorking,
      i18n[language].batteryOptimizationAlert,
      [
        { text: i18n[language].later, style: 'cancel' },
        {
          text: i18n[language].openSettings,
          onPress: async () => {
            try {
              await Linking.openSettings();
            } catch (error) {
              console.error('Failed to open settings:', error);
            }
          },
        },
      ]
    );
  }
};

function useNotificationObserver() {
  React.useEffect(() => {
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url as string;
      console.log('Notification URL:', url);
      if (url) {
        router.push(url);
      }
    }

    Notifications.getLastNotificationResponseAsync().then(response => {
      if (!isMounted || !response?.notification) {
        return;
      }
      redirect(response?.notification);
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      response => {
        redirect(response.notification);
      }
    );

    const receivedSubscription = Notifications.addNotificationReceivedListener(
      async notification => {
        console.log('Notification received in foreground:', notification);

        if (Platform.OS === 'android') {
          // Custom handling for Android foreground notifications
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.remove();
      receivedSubscription.remove();
    };
  }, []);
}

// Component that handles session-dependent push token logic
const SessionDependentPushTokenHandler: React.FC<{
  pushToken: string | null;
}> = ({ pushToken }) => {
  const { session } = useSession();

  // Retry token registration when session becomes available
  React.useEffect(() => {
    if (session && pushToken) {
      (async () => {
        console.log('[Push] Session available, retrying token registration');
        const success = await sendPushTokenToBackend(pushToken);
        if (success) {
          console.log('[Push] Token successfully registered after login');
        } else {
          console.warn('[Push] Token registration failed even with session');
        }
      })();
    }
  }, [session, pushToken]);

  return null; // This component only handles side effects
};

const AppWithNotifications: React.FC = () => {
  const { language, i18n } = useContext(I18nContext);
  const [pushToken, setPushToken] = React.useState<string | null>(null);

  // Initialize push notifications once
  React.useEffect(() => {
    (async () => {
      const result = await initPushNotifications();

      if (result.status === 'granted' && result.token) {
        setPushToken(result.token);

        // Try to send token immediately (will work if already logged in)
        const success = await sendPushTokenToBackend(result.token);
        if (!success) {
          console.log('[Push] Token registration will retry after login');
        }
      } else if (result.status === 'denied') {
        console.log('[Push] User denied permission');

        setTimeout(() => {
          Alert.alert(
            i18n[language].notificationsDisabled,
            i18n[language].notificationsDisabledMessage,
            [
              { text: i18n[language].ok, style: 'cancel' },
              {
                text: i18n[language].openSettings,
                onPress: async () => {
                  try {
                    await Linking.openSettings();
                  } catch (error) {
                    console.error('Failed to open settings:', error);
                  }
                },
              },
            ]
          );
        }, 3000);
      } else if (result.status === 'device_unsupported') {
        console.log('[Push] Running in simulator - notifications disabled');
      } else if (result.status === 'error') {
        console.error('[Push] Setup failed:', result.error);
      }

      // Show battery optimization alert for Android users after setup
      if (Platform.OS === 'android' && result.status === 'granted') {
        const shouldShowAlert = await AsyncStorage.getItem(
          'battery_opt_alert_shown'
        );
        if (!shouldShowAlert) {
          setTimeout(() => showBatteryOptimizationAlert(i18n, language), 5000);
          await AsyncStorage.setItem('battery_opt_alert_shown', 'true');
        }
      }
    })();

    // Keep backend in sync when token rotates
    const sub = Notifications.addPushTokenListener(async ({ data }) => {
      const success = await sendPushTokenToBackend(data);
      if (!success) {
        console.warn('[Push] Failed to update token with backend');
      }
    });

    return () => sub.remove();
  }, [language, i18n]);

  useNotificationObserver();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          if (error instanceof Error && error.message.includes('4')) {
            return false;
          }
          return failureCount < 3;
        },
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <SessionDependentPushTokenHandler pushToken={pushToken} />
        <StudentProvider>
          <FontSizeProvider>
            <Slot />
          </FontSizeProvider>
        </StudentProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default AppWithNotifications;
