import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import api from '../utils/api/api';

const ScanUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error' | 'in progress'>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for loader
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDoctorTable, setShowDoctorTable] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  interface Doctor {
    first_name : string;
    last_name : string;
    specialty : string;
    wilaya  : string;
    license_number : string;
    phone_number : string;
    status : string;
    address : string;
    email : string;
    external_id : string;
}

  const fetchDoctors = async () => {
    try {
      const response = await api.get('admin/list-doctors/');
      setDoctors(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const SendScan = async () => {
        setUploadStatus('in progress');
        setIsLoading(true); // Show loader
        const selectedModel = '2';
        const formData = new FormData();
        formData.append('scan', file);
        formData.append('model_id', selectedModel);
        try {
          const response = await api.post('users/ai/infer/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log('Scan uploaded successfully:', response.data);
          setUploadStatus('success');
        } catch (error) {
          console.error('Error uploading scan:', error);
          setUploadStatus('error');
        } finally {
          setIsLoading(false); // Hide loader
        }
      };
      SendScan();

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      
      // Create preview URL for image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
      
      // Simulate upload success
      setUploadStatus('success');
    }
  };


  const resetUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleShowDoctors = async () => {
    await fetchDoctors(); // Fetch doctor data
    setShowDoctorTable(true); // Show the table
  };

  return (<>
    <section id="scan-upload" className="py-16 bg-slate-100 border rounded-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Upload Your Medical Scans
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Securely upload your medical scans for quick analysis by our healthcare professionals.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div 
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            } ${uploadStatus === 'success' ? 'bg-green-50 border-green-300' : ''} ${
              uploadStatus === 'error' ? 'bg-red-50 border-red-300' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            data-aos="zoom-in"
            
          >
            <div className="space-y-1 text-center">
              {!selectedFile ? (
                <>
                  <Upload 
                    className={`mx-auto h-12 w-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} 
                    strokeWidth={1.5} 
                  />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </>
              ) : (
                <div className="py-4">
                  {isLoading ? (
                    <div className="flex flex-col items-center">
                      <Loader className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                      <p className="text-sm font-medium text-gray-900">Uploading your scan...</p>
                    </div>
                  ) : uploadStatus === 'success' ? (
                    <div className="flex flex-col items-center">
                      <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                      <p className="text-sm font-medium text-gray-900">File uploaded successfully!</p>
                      <div className="mt-4 flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-500">{selectedFile.name}</span>
                      </div>
                      
                      {previewUrl && (
                        <div className="mt-4 max-w-xs mx-auto">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="rounded-lg shadow-md max-h-48 object-contain" 
                          />
                        </div>
                      )}
                      
                      <div className="mt-6">
                        <button
                          type="button"
                          onClick={resetUpload}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Upload Another File
                        </button>
                        <button  className=" items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-2" onClick={() => handleShowDoctors()} >show avilable doctors</button>
                      </div>

                    </div>
                  ) : uploadStatus === 'error' ? (
                    <div className="flex flex-col items-center">
                      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                      <p className="text-sm font-medium text-gray-900">Upload failed. Please try again.</p>
                      <div className="mt-6">
                        <button
                          type="button"
                          onClick={resetUpload}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Try Again
                        </button>

                      </div>
                    </div>
                  ) : null}
                </div>
              )}

            </div>
            
          </div>
      
        </div>
      </div>
      
    </section>
    <section className='py-16 bg-slate-100 borrder rounded-xl '>
    {showDoctorTable && (<tbody className="divide-y divide-gray-200">
      {
        doctors.map((doctor, index) => (
          <tr key={index}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {doctor.first_name + " " + doctor.last_name}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{doctor.specialty}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap"></td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {doctor.license_number}
            </td>
          
          </tr>
        ))}
    </tbody>)}
    </section>
    </>
    
  );
};

export default ScanUpload;