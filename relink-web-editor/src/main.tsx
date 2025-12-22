/**
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import {createContext, StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ConfigProvider, notification} from "antd";
import {registerAllKotlinModules} from "kotlin-ts";
import type {NotificationInstance} from "antd/lib/notification/interface";
import * as React from "react";

registerAllKotlinModules();

const cssVar = (varName: string) => getComputedStyle(document.documentElement)
  .getPropertyValue(varName)
  .trim()

export const NotificationContext = createContext<NotificationInstance | null>(null);

export const NotificationContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  return (
    <NotificationContext.Provider value={api}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

function Root() {
  return <StrictMode>
    <ConfigProvider
      theme={{
        components: {
          Breadcrumb: {
            itemColor: cssVar('--on-background-color'),
            linkColor: cssVar('--secondary-color'),
            lastItemColor: cssVar('--primary-color'),
            separatorColor: cssVar('--secondary-color'),
          }
        },
        token: {
          // ===== Brand / Primary =====
          colorPrimary: cssVar('--primary-color'),
          colorPrimaryHover: cssVar('--primary-color-a-75'),
          colorPrimaryActive: cssVar('--primary-color-a-75'),

          // ===== Text =====
          colorText: cssVar('--on-background-color'),
          colorTextSecondary: cssVar('--secondary-color'),
          colorTextTertiary: cssVar('--secondary-color-a-25'),
          colorTextQuaternary: cssVar('--secondary-color-a-25'),

          // ===== Background =====
          colorBgBase: cssVar('--background-color'),
          colorBgContainer: cssVar('--background-container'),
          colorBgElevated: cssVar('--background-color'),

          // ==== Tooltips Background ====
          colorBgSpotlight: cssVar('--background-color'),

          // ===== Border =====
          colorBorder: 'transparent',
          colorBorderSecondary: cssVar('--secondary-color-a-25'),

          // ===== Control / State =====
          colorFill: cssVar('--secondary-color-a-25'),
          colorFillSecondary: cssVar('--secondary-color-a-50'),
          colorFillTertiary: cssVar('--secondary-color-a-75'),
          controlOutlineWidth: 0,

          // ===== On Primary =====
          colorTextLightSolid: cssVar('--on-primary'),
        }
      }}
    >
      <NotificationContextProvider>
        <App />
      </NotificationContextProvider>
    </ConfigProvider>
  </StrictMode>;
}

createRoot(document.getElementById('root')!).render(
  <Root />,
)
