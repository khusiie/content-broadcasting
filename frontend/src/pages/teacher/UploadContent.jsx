import { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, FileText, Image, X, Loader2 } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import Card from '../../components/ui/Card';
import useToast from '../../hooks/useToast';
import contentService from '../../services/content.service';
import { uploadContentSchema, validateFile } from '../../utils/validators';
const UploadContent = () => {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(uploadContentSchema),
    defaultValues: {
      title: '',
      subject: '',
      description: '',
      start_time: '',
      end_time: '',
      rotation_duration: 5,
    },
  });
  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    const error = validateFile(selectedFile);
    if (error) {
      setFileError(error);
      setFile(null);
      setFilePreview(null);
      toast.error(error);
      return;
    }
    setFileError(null);
    setFile(selectedFile);
    const previewUrl = URL.createObjectURL(selectedFile);
    setFilePreview(previewUrl);
  }, [toast]);
  const clearFile = useCallback(() => {
    setFile(null);
    setFileError(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
  }, [filePreview]);
  const onSubmit = useCallback(async (formData) => {
    if (!file) {
      setFileError('Please select a file');
      return;
    }
    setUploading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== '') {
          if ((key === 'start_time' || key === 'end_time') && formData[key]) {
            data.append(key, new Date(formData[key]).toISOString());
          } else {
            data.append(key, formData[key]);
          }
        }
      });
      data.append('file', file);
      await contentService.uploadContent(data);
      toast.success('Content uploaded successfully!');
      reset();
      clearFile();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [file, toast, reset, clearFile]);
  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Upload Content</h1>
          <p className="text-gray-400">Create a new broadcast for your students</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <Card hover={false}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <FormField label="Title" required error={errors.title?.message}>
                  <input
                    type="text"
                    className="glass-input"
                    placeholder="Enter content title"
                    {...register('title')}
                  />
                </FormField>
                <FormField label="Subject" required error={errors.subject?.message}>
                  <input
                    type="text"
                    className="glass-input"
                    placeholder="e.g. Mathematics, Science, English"
                    {...register('subject')}
                  />
                </FormField>
                <FormField label="Description" hint="Brief description of the content">
                  <textarea
                    className="glass-input resize-none h-24 text-sm"
                    placeholder="What is this content about?"
                    {...register('description')}
                  />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Start Time" required error={errors.start_time?.message}>
                    <input
                      type="datetime-local"
                      className="glass-input text-sm"
                      {...register('start_time')}
                    />
                  </FormField>
                  <FormField label="End Time" required error={errors.end_time?.message}>
                    <input
                      type="datetime-local"
                      className="glass-input text-sm"
                      {...register('end_time')}
                    />
                  </FormField>
                </div>
                <FormField label="Rotation Duration" hint="Time in minutes for content rotation">
                  <input
                    type="number"
                    className="glass-input"
                    min="1"
                    {...register('rotation_duration')}
                  />
                </FormField>
                <FormField label="Media File" required error={fileError}>
                  <input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    accept=".jpg,.jpeg,.png,.gif"
                    onChange={handleFileChange}
                  />
                  {!file ? (
                    <label
                      htmlFor="file-upload"
                      className="glass-input border-dashed cursor-pointer flex flex-col items-center py-8 hover:bg-white/5 transition-colors"
                    >
                      <Image className="text-gray-500 mb-3" size={32} />
                      <span className="text-sm text-gray-300 font-medium">Click to upload</span>
                      <span className="text-xs text-gray-500 mt-1">JPG, PNG, or GIF • Max 10MB</span>
                    </label>
                  ) : (
                    <div className="glass-input relative">
                      <div className="flex items-center gap-3">
                        {filePreview && (
                          <img
                            src={filePreview}
                            alt="Preview"
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={clearFile}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-rose-400 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </FormField>
                <Button
                  type="submit"
                  loading={uploading}
                  fullWidth
                  size="lg"
                  icon={Upload}
                >
                  {uploading ? 'Uploading...' : 'Upload Content'}
                </Button>
              </form>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card hover={false} className="sticky top-24">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">File Preview</h3>
              {filePreview ? (
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden bg-black/30 border border-white/5">
                    <img
                      src={filePreview}
                      alt="Content preview"
                      className="w-full h-auto max-h-80 object-contain"
                    />
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p><span className="text-gray-400">Name:</span> {file?.name}</p>
                    <p><span className="text-gray-400">Size:</span> {file ? (file.size / 1024 / 1024).toFixed(2) + ' MB' : 'N/A'}</p>
                    <p><span className="text-gray-400">Type:</span> {file?.type}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <FileText size={48} className="text-gray-700 mb-4" />
                  <p className="text-sm text-gray-600">No file selected</p>
                  <p className="text-xs text-gray-700 mt-1">Upload a file to see preview</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
export default UploadContent;
