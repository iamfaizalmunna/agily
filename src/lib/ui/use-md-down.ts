"use client";

import { useEffect, useState } from "react";
import { KANBAN_MOBILE_MAX_PX } from "@/lib/board/mobile-kanban";

export function useMdDown() {
  const [mdDown, setMdDown] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${KANBAN_MOBILE_MAX_PX - 1}px)`);
    const update = () => setMdDown(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return mdDown;
}
