/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import { ImagePlus, Upload, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  value: string
  onChange: (src: string) => void
  disabled?: boolean
}

const UploadImage = ({ value, onChange, disabled }: Props) => {
  const [isMounted, setIsMounted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  return (
    <div className="w-full flex flex-col items-start justify-start">
      <CldUploadWidget
        onUpload={(result: any) => onChange(result.info.secure_url)}
        options={{
          maxFiles: 1,
        }}
        signatureEndpoint="/api/upload-cloudinary"
      >
        {({ open }) => (
          <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => !disabled && open()}
            className={`
              relative group cursor-pointer
              w-full max-w-md aspect-video
              rounded-xl overflow-hidden
              transition-all duration-300 ease-in-out
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}
              ${isDragging ? 'scale-102 ring-4 ring-blue-500 ring-opacity-50' : ''}
            `}
          >
            {/* Background Pattern */}
            <div
              className={`
                absolute inset-0
                bg-gradient-to-br from-gray-50 to-gray-100
                ${!value ? 'block' : 'hidden'}
              `}
            >
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
            </div>

            {/* Image Preview */}
            {value && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative w-full h-full"
              >
                <Image
                  fill
                  src={value}
                  alt="Upload preview"
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            )}

            {/* Upload Icon & Text */}
            <AnimatePresence>
              {(isHovered || !value) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
                >
                  {value ? (
                    <Upload className="w-8 h-8 text-white mb-2" />
                  ) : (
                    <ImagePlus className="w-8 h-8 text-blue-500 mb-2" />
                  )}
                  <p className={`text-sm font-medium ${value ? 'text-white' : 'text-gray-600'}`}>
                    {value ? 'Change image' : 'Upload an image'}
                  </p>
                  <p className={`text-xs mt-1 ${value ? 'text-white/80' : 'text-gray-400'}`}>
                    Drag & drop or click to browse
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Clear Button */}
            {value && !disabled && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={(e) => {
                  e.stopPropagation()
                  onChange('')
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-200"
              >
                <X className="w-4 h-4 text-gray-600" />
              </motion.button>
            )}
          </motion.div>
        )}
      </CldUploadWidget>

      {/* Helper Text */}
      <p className="mt-2 text-xs text-gray-500">
        Supported formats: JPEG, PNG, GIF • Max file size: 10MB
      </p>
    </div>
  )
}

export default UploadImage;