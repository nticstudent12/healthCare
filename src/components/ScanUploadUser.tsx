import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../utils/api/api';
import { send } from 'process';

const ScanUploaduser = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error' | 'in progress'>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDoctorTable, setShowDoctorTable] = useState(false); // State to control table visibility
  const [selectedModel, setSelectedModel] = useState(''); // State to store selected model ID


  interface AIModel {
    id: number;
    model_name: string;
    created_at: string;
    status: string;
    parameters: Record<string, unknown>;
  }
   const [aiModels, setAIModels] = useState<AIModel[]>([]);
   
   useEffect(() => {
    const fetchAIModels = async () => {
      try {
        const response = await api.get('users/ai/', {
        });
        setAIModels(response.data); // Update AI models state
      } catch (error) {
        console.error('Error fetching AI models:', error);
      }
    };
    fetchAIModels();
  }
  , []); // Empty dependency array to run only once on mount

  const [doctors, setDoctors] = useState<Doctor[]>([]);
    const fetchDoctors = async () => {
      try {
        const response = await api.get('admin/list-doctors/');
        setDoctors(response.data);
        console.log(response.data); // Update medical history state
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };


   
 
  
  
  
interface Doctor {
  first_name : string;
  last_name : string;
  specialty : string;
  wilaya  : string;
  license_number : string;
  phone_number : string;
  address : string;
  email : string;
  external_id : string;
}

const handleShowDoctors = async () => {
  await fetchDoctors(); // Fetch doctor data
  setShowDoctorTable(true); // Show the table
};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const  file = e.target.files[0];
      setSelectedFile(file);
      setUploadStatus('in progress'); // Set upload status to in progress
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const SendScan = async () => {
    if (!selectedModel) {
      alert('Please select an AI model before uploading.');
      return;
    }
  
    if (!selectedFile) {
      alert('Please upload a file before submitting.');
      return;
    }
  
    setUploadStatus('in progress');
    const formData = new FormData();
    formData.append('scan', selectedFile as Blob);
    formData.append('model_id', selectedModel);
  
    try {
      const response = await api.post('users/ai/infer/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Scan uploaded successfully:', response.data);
      setUploadStatus('success');
      alert('Scan uploaded successfully.');
    } catch (error) {
      console.error('Error uploading scan:', error);
      setUploadStatus('error');
      alert('Failed to upload the scan. Please try again.');
    }
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

  return (<>
    <section id="scan-upload" className="py-16 bg-slate-100 borrder rounded-xl  " >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
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
                  {uploadStatus === 'success' && (
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
                      <div className="mt-6 flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={SendScan}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Upload Another File
                        </button>
                        <button
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => handleShowDoctors()}
                        >
                          Show Available Doctors
                        </button>
                        <div className="flex items-center space-x-2">
                         
                          <select
                            id="ai-model"
                            name="ai-model"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center"
                            value={selectedModel} // Bind the state to the dropdown
                            onChange={(e) => {
                              const selectedValue = e.target.value;
                              setSelectedModel(selectedValue); // Update the state
                              console.log(`Selected AI Model: ${selectedValue}`); // Debugging log
                            }}
                          >
                            <option value="" disabled>
                              Select a model
                            </option>
                            {aiModels.map((model) => (
                              <option key={model.id} value={model.id} className="bg-white text-black">
                                {model.model_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                    </div>
                  )}
                  
                  {uploadStatus === 'error' && (
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
                  )}
                </div>
              )}

            </div>
            
          </div>
      
        </div>
      </div>
      
    </section>
    <section className="py-16 bg-white shadow-md rounded-xl mt-8">
      {showDoctorTable && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Specialty
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  License Number
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {doctors.map((doctor, index) => (
                <tr key={index} className="hover:bg-gray-100">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {doctor.license_number}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
    </>
    
  );
};

export default ScanUploaduser;