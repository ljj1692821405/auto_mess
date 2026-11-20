'use client'

import React, { useEffect, useRef, useState } from 'react'

interface TransparentWhaleImageProps {
  src: string
  alt?: string
  className?: string
}

export function TransparentWhaleImage({ src, alt = '鲸鱼娘', className = '' }: TransparentWhaleImageProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src

    img.onload = () => {
      const width = img.naturalWidth || 400
      const height = img.naturalHeight || 400

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.drawImage(img, 0, 0, width, height)
      const imageData = ctx.getImageData(0, 0, width, height)
      const data = imageData.data

      // Flood-fill / BFS from borders to remove only outer white/light background
      const visited = new Uint8Array(width * height)
      const queue: [number, number][] = []

      // Push all 4 border pixels
      for (let x = 0; x < width; x++) {
        queue.push([x, 0])
        queue.push([x, height - 1])
      }
      for (let y = 0; y < height; y++) {
        queue.push([0, y])
        queue.push([width - 1, y])
      }

      const isBackground = (r: number, g: number, b: number) => {
        // Near white / light gray threshold
        return r > 225 && g > 225 && b > 225
      }

      let head = 0
      while (head < queue.length) {
        const [cx, cy] = queue[head++]
        const idx = cy * width + cx
        if (visited[idx]) continue
        visited[idx] = 1

        const pIdx = idx * 4
        const r = data[pIdx]
        const g = data[pIdx + 1]
        const b = data[pIdx + 2]

        if (isBackground(r, g, b)) {
          // Calculate distance to pure white for soft edge anti-aliasing
          const brightness = (r + g + b) / 3
          if (brightness > 245) {
            data[pIdx + 3] = 0 // completely transparent
          } else {
            // soft blend edge
            const alpha = Math.max(0, Math.min(255, (245 - brightness) * 12))
            data[pIdx + 3] = Math.round(alpha)
          }

          // Expand to 4 neighbors
          if (cx > 0) queue.push([cx - 1, cy])
          if (cx < width - 1) queue.push([cx + 1, cy])
          if (cy > 0) queue.push([cx, cy - 1])
          if (cy < height - 1) queue.push([cx, cy + 1])
        }
      }

      ctx.putImageData(imageData, 0, 0)
      setDataUrl(canvas.toDataURL('image/png'))
    }

    img.onerror = () => {
      // Fallback to original src if cors or loading error
      setDataUrl(src)
    }
  }, [src])

  return (
    <img
      src={dataUrl || src}
      alt={alt}
      className={`select-none pointer-events-none ${className}`}
    />
  )
}
