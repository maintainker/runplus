// contexts/WebViewBridgeContext.tsx
import React, {createContext, useContext, useRef, ReactNode} from 'react';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import handlers from './fromWebHandler';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../@types/navigation';
import {NavigationProp} from '@react-navigation/native';

type MessageType = {
  type: 'NAVIGATE_BACK' | 'NAVIGATE';
  payload?: unknown;
};

type WebViewBridgeContextType = {
  sendMessage: (type: string, payload?: any) => void;
  handleMessage: (event: WebViewMessageEvent) => void;
  webViewRef: React.RefObject<WebView>;
};

const WebViewBridgeContext = createContext<WebViewBridgeContextType | null>(
  null,
);

export const WebViewBridgeProvider = ({children}: {children: ReactNode}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const webViewRef = useRef<WebView>(null);
  const sendMessage = (type: string, payload?: any) => {
    if (webViewRef.current) {
      const message = JSON.stringify({type, payload});
      webViewRef.current.postMessage(message);
    } else {
      console.warn('WebView ref is not available');
    }
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    const {type, payload}: MessageType = JSON.parse(event.nativeEvent.data);
    if (handlers[type]) {
      handlers[type](navigation, payload);
    }
  };

  return (
    <WebViewBridgeContext.Provider
      value={{handleMessage, sendMessage, webViewRef}}>
      {children}
    </WebViewBridgeContext.Provider>
  );
};

export const useWebViewBridge = () => {
  const context = useContext(WebViewBridgeContext);
  if (!context) {
    throw new Error(
      'useWebViewBridge must be used within WebViewBridgeProvider',
    );
  }
  return context;
};
