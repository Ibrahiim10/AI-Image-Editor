'use client';

import React, { useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  ImageIcon,
  Loader2,
  Paintbrush,
  Sparkles,
  Upload,
  Wand2,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

const ImageEditor = () => {
  const [activeTab, setActiveTab] = useState('edit');

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreview, setImagesPreview] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

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
                  Generate Image
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
              <TabsContent value="generate" className="space-y-6 mt-6">
                {/* Generation preview */}
                <div className="border-2 border-dashed rounded-lg p-8 text-center bg-gradient-to-br from primary/5 to-secondary/5">
                  <div className="space-y-4">
                    <Sparkles className="w-12 h-12 mx-auto text-primary" />
                    <div>
                      <p className="text-lg font-medium">AI Image Generation</p>
                      <p className="text-sm text-muted-foreground">
                        Describe what you want to create and AI will generate it
                      </p>
                    </div>
                  </div>
                </div>
                {/* Model info for Generation */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="font-medium">Google Gemini 2.5 Flash</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Advanced AI model for generating high-quality, realistic
                    images from text descriptions.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {/* prompt input */}
            <div className="space-y-2">
              <Label htmlFor="prompt">
                {activeTab === 'edit' ? 'Editing Prompt' : 'Generation Prompt'}
              </Label>

              <Textarea
                id="prompt"
                placeholder={
                  activeTab === 'edit'
                    ? 'Describe what you want to do with the image...'
                    : 'Describe the image you want to generate...'
                }
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="resize-none"
              />

              {activeTab === 'generate' && (
                <p className="text-sm text-muted-foreground">
                  Example: "a tiger fighting with a lion in a city, realistic
                  photo 8k"
                </p>
              )}
            </div>

            {/* Process Button */}
            <Button
              //   onClick={handleProcessImage}
              disabled={
                (activeTab === 'edit' &&
                  (selectedImages.length === 0 || !prompt.trim())) ||
                (activeTab === 'generate' && !prompt.trim()) ||
                isProcessing
              }
              className="w-full"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {activeTab === 'edit' ? (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Edit{' '}
                      {selectedImages.length > 0
                        ? `${selectedImages.length} Image(s)`
                        : 'Images'}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Image
                    </>
                  )}
                </>
              )}
            </Button>

            {/* Progress Bar */}
            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">
                  {progress < 30
                    ? 'Uploading image...'
                    : progress < 60
                      ? 'Processing with nano-banana...'
                      : progress < 90
                        ? 'Generating result...'
                        : 'Almost done...'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImageEditor;
