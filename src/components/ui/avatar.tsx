"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "./utils";

const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://dweb.link/ipfs/',
];

const resolveUrl = (url: string | undefined, gatewayIndex: number): string => {
  if (!url) return '';
  if (url.startsWith('ipfs://')) {
    const hash = url.substring(7);
    return `${IPFS_GATEWAYS[gatewayIndex]}${hash}`;
  }
  return url;
};

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  src,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  const [gatewayIndex, setGatewayIndex] = React.useState(0);
  const [currentSrc, setCurrentSrc] = React.useState(resolveUrl(src, 0));

  React.useEffect(() => {
    console.log('AvatarImage src changed:', src);
    setGatewayIndex(0);
    const initialSrc = resolveUrl(src, 0);
    console.log('AvatarImage initial resolved src:', initialSrc);
    setCurrentSrc(initialSrc);
  }, [src]);

  const handleError = () => {
    console.log('AvatarImage error for src:', currentSrc);
    if (src?.startsWith('ipfs://')) {
      const nextGatewayIndex = gatewayIndex + 1;
      if (nextGatewayIndex < IPFS_GATEWAYS.length) {
        const nextSrc = resolveUrl(src, nextGatewayIndex);
        console.log(`AvatarImage retrying with gateway ${nextGatewayIndex}: ${nextSrc}`);
        setGatewayIndex(nextGatewayIndex);
        setCurrentSrc(nextSrc);
      } else {
        console.log('AvatarImage all gateways failed for:', src);
      }
    }
  };

  return (
    <AvatarPrimitive.Image
      src={currentSrc}
      className={cn("aspect-square size-full", className)}
      onLoadingStatusChange={(status) => {
        if (status === 'error') {
          handleError();
        }
      }}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
