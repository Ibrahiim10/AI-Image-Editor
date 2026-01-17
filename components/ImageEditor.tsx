'use client';

import React, { useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ImageIcon, Paintbrush, Sparkles, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useDropzone } from 'react-dropzone';
import { resolve } from 'path';
import { rejects } from 'assert';
import Image from 'next/image';

const ImageEditor = () => {
  const [activeTab, setActiveTab] = useState('edit');

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreview, setImagesPreview] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedImages(acceptedFiles);
    const previewPromises = acceptedFiles.map((file) => {
      return new Promise<string>((resolve, rejects) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(previewPromises).then((previews) => {
      setImagesPreview(previews);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    multiple: true,
    onDrop: onDrop,
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024,
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* upload an& controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              {activeTab === 'edit' ? 'Upload & Edit' : 'Generate Image'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit" className="flex items-center gap-2">
                  <Paintbrush className="w-4 h-4" />
                  Edit Images
                </TabsTrigger>
                <TabsTrigger
                  value="generate"
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                </TabsTrigger>
              </TabsList>
              <TabsContent value="edit" className="space-y-6 mt-6">
                {/* image upload for editing */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50'}`}
                >
                  <input {...getInputProps()} />

                  {imagePreview.length > 0 ? (
                    <div className="space-y-4">
                      {/* grid layout for multiple image */}
                      <div
                        className={`grid gap-3 ${imagePreview.length === 1 ? 'grid-cols-1' : imagePreview.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}
                      >
                        {imagePreview.map((preview, index) => (
                          <div key={index} className="relative">
                            <Image
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              width={150}
                              height={150}
                              className="w-full h-32 object cover rounded-lg border"
                            />
                            <div className="absolute top-1 right-1 bg-black/70 text-white text-sm px-1.5 py-0.5 rounded">
                              {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground text-center">
                        <p>{selectedImages.length} image(s) selected</p>
                        <p>Click or drag to replace images</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground" />
                      <div>
                        <p className="text-lg font-medium">
                          {isDragActive
                            ? 'Drop image here'
                            : 'Drag & drop images'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          or click to browse (max 5 images, 100 each)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Model info for Editing */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Paintbrush className="w-4 h-4 text-primary" />
                    <span className="font-medium">Google Nano Banana</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Google's latest image editing model in Gemini 2.5. Supports
                    natural scene editing and style transfer.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="generate">
                <h1>Generate Images</h1>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImageEditor;
