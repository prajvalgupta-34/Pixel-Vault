import React, { useState, useEffect } from 'react';

const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://dweb.link/ipfs/',
];

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

const resolveUrl = (url: string | undefined, gatewayIndex: number): string => {
  if (!url) return '';
  if (url.startsWith('ipfs://')) {
    const hash = url.substring(7);
    return `${IPFS_GATEWAYS[gatewayIndex]}${hash}`;
  }
  return url;
};

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const { src: originalSrc, alt, style, className, ...rest } = props;
  const [gatewayIndex, setGatewayIndex] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(resolveUrl(originalSrc, 0));
  const [didError, setDidError] = useState(false);

  useEffect(() => {
    setGatewayIndex(0);
    setDidError(false);
    setCurrentSrc(resolveUrl(originalSrc, 0));
  }, [originalSrc]);

  const handleError = () => {
    if (originalSrc?.startsWith('ipfs://')) {
      const nextGatewayIndex = gatewayIndex + 1;
      if (nextGatewayIndex < IPFS_GATEWAYS.length) {
        setGatewayIndex(nextGatewayIndex);
        setCurrentSrc(resolveUrl(originalSrc, nextGatewayIndex));
      } else {
        setDidError(true);
      }
    } else {
      setDidError(true);
    }
  };

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={originalSrc} />
      </div>
    </div>
  ) : (
    <img src={currentSrc} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  );
}
