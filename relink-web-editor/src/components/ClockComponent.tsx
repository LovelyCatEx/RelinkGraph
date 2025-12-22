/*
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import { useEffect, useState } from "react";
import {ClockCircleOutlined} from "@ant-design/icons";

const formatTime = (date: Date) => {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

export const ClockComponent = () => {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(formatTime(new Date()));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <span
      className="
        pl-2 pr-2 pt-1 pb-1 rounded-md
        text-[var(--on-background-color)]
        flex flex-row
        space-x-2
        select-none
        opacity-90
        hover:text-[var(--primary-color)]
        hover:bg-white/10
        transition-all
        duration-100
        ease-in-out
      "
    >
      <ClockCircleOutlined />
      <span>{time}</span>
    </span>
  );
};