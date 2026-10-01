import React from "react";
import { Image } from "@mantine/core";
import { SITE } from "@/config/site";

// Componente de logo reutilizável: ícone + nome da empresa.
// Props:
//  - variant: "navbar" | "footer" (ajusta tamanho do texto)
//  - withName: false para renderizar só o ícone
export default function Logo({ variant = "navbar", withName = true }) {
  const isFooter = variant === "footer";
  const iconCls = isFooter ? "h-10 w-10" : "h-9 w-9 sm:h-10 sm:w-10";
  const textCls = isFooter
    ? "text-xl"
    : "text-lg sm:text-xl";

  return (
    <span className="flex items-center gap-2.5">
      <span
        className={`${iconCls} rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-[#22C55E]/25 bg-black`}
      >
        <Image
          src={SITE.logoUrl}
          alt={`Logo ${SITE.companyName}`}
          fit="fill"
          className="w-full h-full"
        />
      </span>
      {withName && (
        <span className={`font-heading font-bold tracking-tight text-white ${textCls}`}>
          {SITE.companyName}
        </span>
      )}
    </span>
  );
}
