import React, { useState, useEffect, useRef } from "react";
import { SolutionFile } from "../types";
import { 
  Folder, Image as ImageIcon, Upload, Trash2, Plus, Search, 
  FileText, CheckCircle2, AlertCircle, Eye, RefreshCw, X, HardDrive, Filter
} from "lucide-react";

const INITIAL_FILES: SolutionFile[] = [
  {
    id: "FID-80291",
    name: "vs2026_solution_architecture.png",
    uploadedTime: "2026-08-03 07:15:22",
    size: "1.4 MB",
    type: "image/png",
    previewUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "FID-50192",
    name: "main_window_screenshot.jpg",
    uploadedTime: "2026-08-03 08:02:45",
    size: "820 KB",
    type: "image/jpeg",
    previewUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "FID-10293",
    name: "calculator_service_diagram.png",
    uploadedTime: "2026-08-03 08:30:10",
    size: "540 KB",
    type: "image/png",
    previewUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80"
  }
];

export default function SolutionFileManager() {
  const [activeTab, setActiveTab] = useState<"list" | "upload">("list");
  const [files, setFiles] = useState<SolutionFile[]>(() => {
    const saved = localStorage.getItem("VS2026_SOLUTION_FILES");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_FILES; }
    }
    return INITIAL_FILES;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [previewFile, setPreviewFile] = useState<SolutionFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const [customPhotoName, setCustomPhotoName] = useState("");
  const [customPhotoUrl, setCustomPhotoUrl] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    localStorage.setItem("VS2026_SOLUTION_FILES", JSON.stringify(files));
  }, [files]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const uploadedList: SolutionFile[] = [];
    Array.from(e.target.files).forEach((file: File, index: number) => {
      const now = new Date();
      const formattedTime = now.getFullYear() + "-" + 
        String(now.getMonth() + 1).padStart(2, '0') + "-" + 
        String(now.getDate()).padStart(2, '0') + " " + 
        String(now.getHours()).padStart(2, '0') + ":" + 
        String(now.getMinutes()).padStart(2, '0') + ":" + 
        String(now.getSeconds()).padStart(2, '0');

      const fileId = "FID-" + Math.floor(10000 + Math.random() * 90000);

      // Read preview if image
      const reader = new FileReader();
      reader.onload = (event) => {
        const newFile: SolutionFile = {
          id: fileId,
          name: file.name,
          uploadedTime: formattedTime,
          size: (file.size / 1024).toFixed(0) + " KB",
          type: file.type || "application/octet-stream",
          previewUrl: event.target?.result as string || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
        };
        setFiles(prev => [newFile, ...prev]);
      };
      reader.readAsDataURL(file);
    });

    setUploadSuccessMsg(`Successfully added ${e.target.files.length} file(s) to solution registry.`);
    setTimeout(() => setUploadSuccessMsg(null), 4000);
    setActiveTab("list");
  };

  const handleAddSamplePhotos = () => {
    const samples: SolutionFile[] = [
      {
        id: "FID-" + Math.floor(10000 + Math.random() * 90000),
        name: "visual_studio_2026_extension_ui.png",
        uploadedTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        size: "950 KB",
        type: "image/png",
        previewUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "FID-" + Math.floor(10000 + Math.random() * 90000),
        name: "csharp_compiler_diagnostics_trace.jpg",
        uploadedTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        size: "1.2 MB",
        type: "image/jpeg",
        previewUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
      }
    ];

    setFiles(prev => [...samples, ...prev]);
    setUploadSuccessMsg("Added sample solution photos to registry!");
    setTimeout(() => setUploadSuccessMsg(null), 3000);
    setActiveTab("list");
  };

  const handleAddCustomPhotoUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPhotoUrl.trim()) return;

    const name = customPhotoName.trim() || "solution_photo_" + Math.floor(1000 + Math.random() * 9000) + ".jpg";
    const newFile: SolutionFile = {
      id: "FID-" + Math.floor(10000 + Math.random() * 90000),
      name,
      uploadedTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      size: "650 KB",
      type: "image/jpeg",
      previewUrl: customPhotoUrl.trim()
    };

    setFiles(prev => [newFile, ...prev]);
    setCustomPhotoName("");
    setCustomPhotoUrl("");
    setUploadSuccessMsg(`Added photo '${name}'!`);
    setTimeout(() => setUploadSuccessMsg(null), 3000);
    setActiveTab("list");
  };

  const handleDeleteFile = (id: string, name: string) => {
    if (confirm(`Delete file '${name}' (ID: ${id}) from solution registry?`)) {
      setFiles(prev => prev.filter(f => f.id !== id));
    }
  };

  const filteredFiles = files.filter(f => 
    f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full">
      {/* Header Bar */}
      <div className="bg-gray-950 px-6 py-4 border-b border-gray-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-indigo-950 border border-indigo-800 rounded-lg flex items-center justify-center text-indigo-400">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-100 text-base flex items-center gap-2">
              Solution Files &amp; Photos Registry
              <span className="text-[10px] bg-indigo-950 text-indigo-300 font-mono px-2 py-0.5 rounded border border-indigo-900 font-semibold">
                {files.length} Total Files
              </span>
            </h3>
            <p className="text-xs text-gray-400">Manage photos, solution screenshots, and project files with File ID tracking.</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-gray-900 p-1 rounded-xl border border-gray-800">
          <button
            onClick={() => setActiveTab("list")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition cursor-pointer ${
              activeTab === "list" 
                ? "bg-indigo-600 text-white shadow-md" 
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            }`}
          >
            <Folder className="w-4 h-4" />
            <span>Browse &amp; File List</span>
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition cursor-pointer ${
              activeTab === "upload" 
                ? "bg-indigo-600 text-white shadow-md" 
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add New Photos</span>
          </button>
        </div>
      </div>

      {/* Upload Notification Alert */}
      {uploadSuccessMsg && (
        <div className="bg-emerald-950/80 border-b border-emerald-800 px-6 py-2.5 text-xs text-emerald-200 flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-medium">{uploadSuccessMsg}</span>
          </div>
          <button onClick={() => setUploadSuccessMsg(null)} className="text-emerald-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Tab Content */}
      <div className="flex-1 p-6 overflow-y-auto min-h-0 bg-gray-950">
        {activeTab === "list" ? (
          <div className="space-y-4">
            {/* Search and Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-900 p-3 rounded-xl border border-gray-800">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search file name or File ID..."
                  className="w-full bg-gray-950 border border-gray-800 text-gray-200 text-xs rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleAddSamplePhotos}
                  className="bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Add Sample Photos</span>
                </button>

                <button
                  onClick={() => setActiveTab("upload")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 shadow-md cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photos</span>
                </button>
              </div>
            </div>

            {/* Requested File Table */}
            <div className="border border-gray-800 rounded-xl overflow-hidden shadow-lg bg-gray-900">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-gray-950 text-gray-400 font-mono uppercase text-[11px] tracking-wider border-b border-gray-800">
                    <tr>
                      <th scope="col" className="py-3.5 px-4 font-semibold">File ID</th>
                      <th scope="col" className="py-3.5 px-4 font-semibold">Name</th>
                      <th scope="col" className="py-3.5 px-4 font-semibold">Uploaded Time</th>
                      <th scope="col" className="py-3.5 px-4 font-semibold text-right">Delete Button</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 font-sans">
                    {filteredFiles.length > 0 ? (
                      filteredFiles.map((file) => (
                        <tr key={file.id} className="hover:bg-gray-850 transition group">
                          {/* Column 1: File ID */}
                          <td className="py-3.5 px-4 font-mono">
                            <span className="bg-indigo-950 text-indigo-300 border border-indigo-900/80 px-2.5 py-1 rounded-md text-[11px] font-bold">
                              {file.id}
                            </span>
                          </td>

                          {/* Column 2: Name */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-3">
                              {file.previewUrl ? (
                                <img 
                                  src={file.previewUrl} 
                                  alt={file.name} 
                                  className="w-8 h-8 rounded object-cover border border-gray-700 shrink-0 cursor-pointer"
                                  onClick={() => setPreviewFile(file)}
                                />
                              ) : (
                                <div className="w-8 h-8 rounded bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0">
                                  <FileText className="w-4 h-4 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <span className="font-medium text-gray-100 block group-hover:text-indigo-400 transition cursor-pointer" onClick={() => setPreviewFile(file)}>
                                  {file.name}
                                </span>
                                {file.size && (
                                  <span className="text-[10px] text-gray-500">{file.size}</span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Column 3: Uploaded Time */}
                          <td className="py-3.5 px-4 text-gray-400 font-mono text-[11px]">
                            {file.uploadedTime}
                          </td>

                          {/* Column 4: Delete Button */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              {file.previewUrl && (
                                <button
                                  onClick={() => setPreviewFile(file)}
                                  className="p-1.5 rounded-lg bg-gray-800 hover:bg-indigo-900 text-gray-400 hover:text-indigo-300 border border-gray-700 transition cursor-pointer"
                                  title="Preview Photo"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteFile(file.id, file.name)}
                                className="bg-rose-950/60 hover:bg-rose-900 border border-rose-800/70 text-rose-300 hover:text-white px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1 transition shadow-2xs cursor-pointer text-xs"
                                title="Delete File"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-gray-500">
                          <Folder className="w-10 h-10 mx-auto text-gray-600 mb-2" />
                          <p className="text-sm font-medium text-gray-400">No solution files found</p>
                          <p className="text-xs mt-1">Upload new photos or click 'Add Sample Photos' to get started.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Tab: Add New Photos & File Upload */
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="bg-indigo-950/40 border border-indigo-900/60 rounded-xl p-4 text-xs text-indigo-200 flex items-start space-x-3">
              <Upload className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-indigo-300">Add Solution Photos &amp; Visual Assets</h4>
                <p className="mt-1 text-indigo-300/80 leading-relaxed">
                  Upload screenshot mockups, solution architecture diagrams, or UI photos to register them with an auto-generated File ID.
                </p>
              </div>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  const fakeEvent = { target: { files: e.dataTransfer.files } } as any;
                  handleFileUpload(fakeEvent);
                }
              }}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition ${
                isDragging 
                  ? "border-indigo-500 bg-indigo-950/50 scale-[1.01]" 
                  : "border-gray-800 hover:border-indigo-600 bg-gray-900"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,.png,.jpg,.jpeg,.gif,.svg,.json,.cs"
                multiple
                className="hidden"
              />

              <div className="w-14 h-14 bg-indigo-950 border border-indigo-800 rounded-2xl flex items-center justify-center mx-auto text-indigo-400 shadow-xl mb-4">
                <ImageIcon className="w-7 h-7" />
              </div>

              <h4 className="text-sm font-bold text-gray-100">Drag &amp; drop photos here</h4>
              <p className="text-xs text-gray-400 mt-1">Supports PNG, JPG, GIF, SVG, and code files up to 25MB.</p>

              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2 rounded-xl text-xs transition shadow-lg cursor-pointer flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Browse Device Files</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddSamplePhotos}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-semibold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
                >
                  <span>Use Sample VS Photos</span>
                </button>
              </div>
            </div>

            {/* Add Photo via URL */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
              <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider font-mono flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                Or Add Photo via Direct URL
              </h4>

              <form onSubmit={handleAddCustomPhotoUrl} className="space-y-3">
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Photo / File Name (optional)</label>
                  <input
                    type="text"
                    value={customPhotoName}
                    onChange={(e) => setCustomPhotoName(e.target.value)}
                    placeholder="e.g. solution_ui_mockup.png"
                    className="w-full bg-gray-950 border border-gray-800 text-gray-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Image Web Address / URL *</label>
                  <input
                    type="url"
                    value={customPhotoUrl}
                    onChange={(e) => setCustomPhotoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    required
                    className="w-full bg-gray-950 border border-gray-800 text-gray-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 text-indigo-200 hover:text-white font-bold py-2 rounded-xl text-xs transition shadow-md cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4 text-indigo-400" />
                  <span>Add Photo to Registry</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Photo Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl">
            <div className="bg-gray-950 px-5 py-3 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-gray-100 flex items-center gap-2">
                  {previewFile.name}
                  <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-900 px-2 py-0.5 rounded">
                    {previewFile.id}
                  </span>
                </h4>
                <p className="text-[11px] text-gray-400">Uploaded at: {previewFile.uploadedTime}</p>
              </div>
              <button onClick={() => setPreviewFile(null)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-gray-950 flex items-center justify-center max-h-[70vh] overflow-hidden">
              {previewFile.previewUrl ? (
                <img src={previewFile.previewUrl} alt={previewFile.name} className="max-h-[60vh] rounded-lg object-contain shadow-md" />
              ) : (
                <div className="p-12 text-center text-gray-500">No image preview available</div>
              )}
            </div>

            <div className="bg-gray-900 px-5 py-3 border-t border-gray-800 flex justify-between items-center">
              <span className="text-xs text-gray-400 font-mono">Size: {previewFile.size || "N/A"}</span>
              <button
                onClick={() => setPreviewFile(null)}
                className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
