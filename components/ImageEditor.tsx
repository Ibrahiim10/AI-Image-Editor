'use client';

import React, { useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Paintbrush, Sparkles, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useDropzone } from 'react-dropzone';
import { resolve } from 'path';
import { rejects } from 'assert';

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
              <TabsContent value="edit">
                <h1>Edit Images</h1>
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
