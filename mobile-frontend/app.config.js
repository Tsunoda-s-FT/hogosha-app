require('dotenv').config();

// Preview ビルドだけ別の packageId / bundleId でインストールできるように
// APP_VARIANT 環境変数（preview / development / undefined）で切り替える
const isPreview = process.env.APP_VARIANT === 'preview';

module.exports = () => {
  const config = {
    expo: {
      runtimeVersion: '1.0.0',
      name: isPreview ? 'parent-notification (Preview)' : 'parent-notification',
      slug: 'parent-notification',
      version: '1.0.1',
      orientation: 'portrait',
      icon: './assets/images/icon.png',
      scheme: 'jduapp',
      platforms: ['ios', 'android', 'web'],
      userInterfaceStyle: 'automatic',
      splash: {
        image: './assets/images/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
      ios: {
        supportsTablet: true,
        buildNumber: '2',
        bundleIdentifier: isPreview
          ? 'com.jduapp.parentnotification.preview'
          : 'com.jduapp.parentnotification',
        infoPlist: {
          CFBundleAllowMixedLocalizations: true,
          ITSAppUsesNonExemptEncryption: false,
          NSCameraUsageDescription:
            'This app uses the camera to take photos for messages.',
          NSPhotoLibraryUsageDescription:
            'This app accesses your photo library to select images for messages.',
          NSUserNotificationsUsageDescription:
            'This app uses notifications to alert you about new messages from school.',
        },
        googleServicesFile: isPreview
          ? './GoogleService-Info-preview.plist'
          : './GoogleService-Info.plist',
      },
      android: {
        adaptiveIcon: {
          foregroundImage: './assets/images/adaptive-icon.png',
          backgroundColor: '#ffffff',
        },
        allowBackup: false,
        versionCode: 2,
        package: isPreview
          ? 'com.jduapp.parentnotification.preview'
          : 'com.jduapp.parentnotification',
        googleServicesFile: isPreview
          ? './google-services-preview.json'
          : './google-services.json',
        permissions: [
          'android.permission.CAMERA',
          'android.permission.READ_EXTERNAL_STORAGE',
          'android.permission.WRITE_EXTERNAL_STORAGE',
          'android.permission.NOTIFICATIONS',
        ],
        intentFilters: [
          {
            autoVerify: true,
            action: 'VIEW',
            data: [
              {
                scheme: 'https',
                host: 'appuri-hogosha.vercel.app',
                pathPrefix: '/parentnotification',
              },
            ],
            category: ['BROWSABLE', 'DEFAULT'],
          },
        ],
      },
      web: {
        bundler: 'metro',
        output: 'static',
        favicon: './assets/images/favicon.png',
      },
      plugins: [
        [
          'expo-notifications',
          {
            icon: './assets/images/icon.png',
            color: '#000000',
            sounds: [],
            mode: 'production',
          },
        ],
        'expo-router',
        'expo-font',
        'expo-localization',
      ],
      experiments: {},
      extra: {
        router: {
          origin: false,
        },
        eas: {
          // 環境変数 EAS_PROJECT_ID があればそれを使用し、なければデフォルト値を使う
          projectId:
            process.env.EAS_PROJECT_ID ||
            '2b7c7844-0299-4395-8f26-fcc8f40e1b1c',
        },
      },
    },
  };
  return config;
};
