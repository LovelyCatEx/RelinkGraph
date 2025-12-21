/**
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ConfigProvider} from "antd";

const cssVar = (varName: string) => getComputedStyle(document.documentElement)
  .getPropertyValue(varName)
  .trim()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
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
          colorBgContainer: cssVar('--background-color'),
          colorBgElevated: cssVar('--background-color'),

          // ===== Border =====
          colorBorder: cssVar('--secondary-color-a-50'),
          colorBorderSecondary: cssVar('--secondary-color-a-25'),

          // ===== Control / State =====
          colorFill: cssVar('--secondary-color-a-25'),
          colorFillSecondary: cssVar('--secondary-color-a-50'),
          colorFillTertiary: cssVar('--secondary-color-a-75'),
          controlOutlineWidth: 0,

          // ===== On Primary =====
          colorTextLightSolid: cssVar('--on-primary'),
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
)
