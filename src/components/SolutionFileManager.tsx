import React, { useState, useEffect, useRef } from "react";
import { SolutionFile } from "../types";
import { 
  Folder, Image as ImageIcon, Upload, Trash2, Plus, Search, 
  FileText, CheckCircle2, Eye, X, HardDrive, Grid, ListFilter,
  Camera, Sparkles, MapPin, Calendar, HardDriveUpload
} from "lucide-react";

const INITIAL_FILES: SolutionFile[] = [
  {
    id: "FID-80291",
    name: "vs2026_solution_architecture.png",
    size: "1.4 MB",
    filePath: "/workspace/DevWorkspace/Assets/vs2026_solution_architecture.png",
    uploadedTime: "2026-08-03 07:15:22",
    type: "image/png",
    previewUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "FID-50192",
    name: "main_window_screenshot.jpg",
    size: "820 KB",
    filePath: "/workspace/DevWorkspace/Screenshots/main_window_screenshot.jpg",
    uploadedTime: "2026-08-03 08:02:45",
    type: "image/jpeg",
    previewUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "FID-10293",
    name: "calculator_service_diagram.png",
    size: "540 KB",
    filePath: "/workspace/DevWorkspace/Docs/calculator_service_diagram.png",
    uploadedTime: "2026-08-03 08:30:10",
    type: "image/png",
    previewUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "FID-40912",
    name: "FileStorageService.cs",
    size: "18 KB",
    filePath: "/workspace/DevWorkspace/Services/FileStorageService.cs",
    uploadedTime: "2026-08-03 08:45:00",
    type: "text/plain"
  }
];

export default function SolutionFileManager() {
  const [activeTab, setActiveTab] = useState<"browse" | "list" | "memories" | "upload">("memories");
  const [files, setFiles] = useState<SolutionFile[]>(() => {
    const saved = localStorage.getItem("VS2026_SOLUTION_FILES_V3");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_FILES; }
    }
    return INITIAL_FILES;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [previewFile, setPreviewFile] = useState<SolutionFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  
  // Custom upload form states
  const [customFileName, setCustomFileName] = useState("");
  const [customFilePath, setCustomFilePath] = useState("");
  const [customPhotoUrl, setCustomPhotoUrl] = useState("");
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    localStorage.setItem("VS2026_SOLUTION_FILES_V3", JSON.stringify(files));
  }, [files]);

  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const count = e.target.files.length;
    Array.from(e.target.files).forEach((file: File) => {
      const now = new Date();
      const formattedTime = now.getFullYear() + "-" + 
        String(now.getMonth() + 1).padStart(2, '0') + "-" + 
        String(now.getDate()).padStart(2, '0') + " " + 
        String(now.getHours()).padStart(2, '0') + ":" + 
        String(now.getMinutes()).padStart(2, '0') + ":" + 
        String(now.getSeconds()).padStart(2, '0');

      const fileId = "FID-" + Math.floor(10000 + Math.random() * 90000);
      const filePath = `/workspace/DevWorkspace/Memories/${file.name}`;
      const fileSize = (file.size / 1024).toFixed(0) + " KB";

      const reader = new FileReader();
      reader.onload = (event) => {
        const newFile: SolutionFile = {
          id: fileId,
          name: file.name,
          size: fileSize,
          filePath,
          uploadedTime: formattedTime,
          type: file.type || "image/png",
          previewUrl: event.target?.result as string || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
        };
        setFiles(prev => [newFile, ...prev]);
      };
      reader.readAsDataURL(file);
    });

    showToast(`Uploaded ${count} new photo/file(s) to Memories!`);
    setShowPhotoUploadModal(false);
  };

  const handleAddCustomFile = (e: React.FormEvent) => {
    e.preventDefault();
    const name = customFileName.trim() || "memory_photo_" + Math.floor(1000 + Math.random() * 9000) + ".jpg";
    const path = customFilePath.trim() || `/workspace/DevWorkspace/Memories/${name}`;
    const fileId = "FID-" + Math.floor(10000 + Math.random() * 90000);

    const now = new Date();
    const formattedTime = now.getFullYear() + "-" + 
      String(now.getMonth() + 1).padStart(2, '0') + "-" + 
      String(now.getDate()).padStart(2, '0') + " " + 
      String(now.getHours()).padStart(2, '0') + ":" + 
      String(now.getMinutes()).padStart(2, '0') + ":" + 
      String(now.getSeconds()).padStart(2, '0');

    const newFile: SolutionFile = {
      id: fileId,
      name,
      size: "650 KB",
      filePath: path,
      uploadedTime: formattedTime,
      type: "image/jpeg",
      previewUrl: customPhotoUrl.trim() || "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80"
    };

    setFiles(prev => [newFile, ...prev]);
    setCustomFileName("");
    setCustomFilePath("");
    setCustomPhotoUrl("");
    setShowPhotoUploadModal(false);
    showToast(`Added memory photo '${name}' (ID: ${fileId})!`);
  };

  const handleDeleteFile = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete '${name}' (ID: ${id})?`)) {
      setFiles(prev => prev.filter(f => f.id !== id));
      showToast(`Deleted '${name}' from Memories.`);
    }
  };

  const filteredFiles = files.filter(f => 
    f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.filePath.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full">
      {/* Header Bar with Tabs */}
      <div className="bg-gray-950 px-6 py-4 border-b border-gray-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-indigo-950 border border-indigo-800 rounded-lg flex items-center justify-center text-indigo-400">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-100 text-base flex items-center gap-2">
              Solution Files &amp; Memories Registry
              <span className="text-[10px] bg-indigo-950 text-indigo-300 font-mono px-2 py-0.5 rounded border border-indigo-900 font-semibold">
                {files.length} Saved
              </span>
            </h3>
            <p className="text-xs text-gray-400">Manage solution assets, upload memory photos, and view file location tables.</p>
          </div>
        </div>

        {/* 4 Navigation Tabs: Browse | File List | Memories | Upload File */}
        <div className="flex items-center bg-gray-900 p-1 rounded-xl border border-gray-800 space-x-1">
          <button
            onClick={() => setActiveTab("browse")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
              activeTab === "browse" 
                ? "bg-indigo-600 text-white shadow-md font-bold" 
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            }`}
          >
            <Grid className="w-3.5 h-3.5 text-indigo-300" />
            <span>Browse</span>
          </button>

          <button
            onClick={() => setActiveTab("list")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
              activeTab === "list" 
                ? "bg-indigo-600 text-white shadow-md font-bold" 
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            }`}
          >
            <ListFilter className="w-3.5 h-3.5 text-indigo-300" />
            <span>File List</span>
          </button>

          {/* NEW REQUESTED TAB: MEMORIES */}
          <button
            onClick={() => setActiveTab("memories")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
              activeTab === "memories" 
                ? "bg-indigo-600 text-white shadow-md font-bold" 
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-indigo-300" />
            <span>Memories</span>
          </button>

          <button
            onClick={() => setActiveTab("upload")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
              activeTab === "upload" 
                ? "bg-indigo-600 text-white shadow-md font-bold" 
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-indigo-300" />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      {/* Alert Notification Toast */}
      {notificationMsg && (
        <div className="bg-emerald-950/80 border-b border-emerald-800 px-6 py-2.5 text-xs text-emerald-200 flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-medium">{notificationMsg}</span>
          </div>
          <button onClick={() => setNotificationMsg(null)} className="text-emerald-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Body */}
      <div className="flex-1 p-6 overflow-y-auto min-h-0 bg-gray-950">

        {/* TAB 1: MEMORIES (Requested Tab) */}
        {activeTab === "memories" && (
          <div className="space-y-5 animate-fade-in">
            {/* Memories Action Header Banner */}
            <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 border border-gray-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-900/60 border border-indigo-700/80 rounded-xl flex items-center justify-center text-indigo-300 shadow-md">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-100 text-sm flex items-center gap-2">
                    Photo Memories &amp; Solution Snapshots
                    <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-900 px-2 py-0.5 rounded-full font-mono">
                      {filteredFiles.length} Items
                    </span>
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Store and view your project photos, diagrams, and solution memory logs.
                  </p>
                </div>
              </div>

              {/* Option to Upload New Photos */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowPhotoUploadModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-md flex items-center space-x-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload New Photos</span>
                </button>
              </div>
            </div>

            {/* Filter Search Bar */}
            <div className="flex items-center justify-between bg-gray-900 p-3 rounded-xl border border-gray-800">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Memory File ID, Name, or File Location..."
                  className="w-full bg-gray-950 border border-gray-800 text-gray-200 text-xs rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <span className="text-xs text-gray-500 hidden sm:inline font-mono">
                Memory Storage Registry
              </span>
            </div>

            {/* Requested Table with Columns: File ID | File Name | File Size | File Location | Date Uploaded | Delete Button */}
            <div className="border border-gray-800 rounded-xl overflow-hidden shadow-xl bg-gray-900">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-gray-950 text-gray-400 font-mono uppercase text-[11px] tracking-wider border-b border-gray-800">
                    <tr>
                      <th scope="col" className="py-3.5 px-4 font-semibold">File ID</th>
                      <th scope="col" className="py-3.5 px-4 font-semibold">File Name</th>
                      <th scope="col" className="py-3.5 px-4 font-semibold">File Size</th>
                      <th scope="col" className="py-3.5 px-4 font-semibold">File Location</th>
                      <th scope="col" className="py-3.5 px-4 font-semibold">Date Uploaded</th>
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

                          {/* Column 2: File Name */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-3">
                              {file.previewUrl ? (
                                <img 
                                  src={file.previewUrl} 
                                  alt={file.name} 
                                  className="w-9 h-9 rounded-lg object-cover border border-gray-700 shrink-0 cursor-pointer hover:border-indigo-500 transition"
                                  onClick={() => setPreviewFile(file)}
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0">
                                  <ImageIcon className="w-4 h-4 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <span 
                                  className="font-semibold text-gray-100 group-hover:text-indigo-400 transition cursor-pointer block"
                                  onClick={() => setPreviewFile(file)}
                                >
                                  {file.name}
                                </span>
                                <span className="text-[10px] text-gray-500 font-mono">
                                  {file.type || "image/png"}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Column 3: File Size */}
                          <td className="py-3.5 px-4 font-mono text-gray-300">
                            {file.size}
                          </td>

                          {/* Column 4: File Location */}
                          <td className="py-3.5 px-4 font-mono text-gray-400 text-[11px]">
                            <span className="bg-gray-950 px-2.5 py-1 rounded-md border border-gray-800 flex items-center space-x-1 max-w-xs truncate" title={file.filePath}>
                              <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                              <span className="truncate">{file.filePath}</span>
                            </span>
                          </td>

                          {/* Column 5: Date Uploaded */}
                          <td className="py-3.5 px-4 font-mono text-gray-400 text-[11px]">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3 text-gray-500" />
                              <span>{file.uploadedTime}</span>
                            </span>
                          </td>

                          {/* Column 6: Delete Button */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              {file.previewUrl && (
                                <button
                                  onClick={() => setPreviewFile(file)}
                                  className="p-1.5 rounded-lg bg-gray-800 hover:bg-indigo-900 text-gray-400 hover:text-indigo-300 border border-gray-700 transition cursor-pointer"
                                  title="View Photo Preview"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteFile(file.id, file.name)}
                                className="bg-rose-950/70 hover:bg-rose-900 border border-rose-800/80 text-rose-300 hover:text-white px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition shadow-2xs cursor-pointer text-xs"
                                title="Delete Photo Memory"
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
                        <td colSpan={6} className="py-12 text-center text-gray-500">
                          <Camera className="w-10 h-10 mx-auto text-gray-600 mb-2" />
                          <p className="text-sm font-medium text-gray-400">No memory files found</p>
                          <p className="text-xs mt-1">Click 'Upload New Photos' to add photos to your memory table.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BROWSE (Grid View) */}
        {activeTab === "browse" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-900 p-3 rounded-xl border border-gray-800">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter solution photos..."
                  className="w-full bg-gray-950 border border-gray-800 text-gray-200 text-xs rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                onClick={() => setShowPhotoUploadModal(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 shadow-md cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <div key={file.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-md hover:border-indigo-600/60 transition group flex flex-col">
                  <div className="h-40 bg-gray-950 relative overflow-hidden flex items-center justify-center border-b border-gray-800">
                    {file.previewUrl ? (
                      <img 
                        src={file.previewUrl} 
                        alt={file.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300 cursor-pointer"
                        onClick={() => setPreviewFile(file)}
                      />
                    ) : (
                      <FileText className="w-12 h-12 text-gray-600" />
                    )}
                    <span className="absolute top-2 left-2 bg-gray-950/80 backdrop-blur-xs text-indigo-300 font-mono text-[10px] px-2 py-0.5 rounded border border-gray-800">
                      {file.id}
                    </span>
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="font-bold text-gray-100 text-xs truncate group-hover:text-indigo-400 transition" title={file.name}>
                        {file.name}
                      </h4>
                      <p className="text-[10px] font-mono text-gray-500 truncate mt-0.5" title={file.filePath}>
                        {file.filePath}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
                      <span className="font-mono">{file.size}</span>
                      <div className="flex items-center space-x-1">
                        {file.previewUrl && (
                          <button onClick={() => setPreviewFile(file)} className="p-1 text-gray-400 hover:text-white cursor-pointer" title="View Preview">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button onClick={() => handleDeleteFile(file.id, file.name)} className="p-1 text-rose-400 hover:text-rose-200 cursor-pointer" title="Delete File">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FILE LIST (Table View) */}
        {activeTab === "list" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-900 p-3 rounded-xl border border-gray-800">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search file name, File ID, or File Path..."
                  className="w-full bg-gray-950 border border-gray-800 text-gray-200 text-xs rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                onClick={() => setActiveTab("upload")}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 shadow-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload New File</span>
              </button>
            </div>

            <div className="border border-gray-800 rounded-xl overflow-hidden shadow-lg bg-gray-900">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-gray-950 text-gray-400 font-mono uppercase text-[11px] tracking-wider border-b border-gray-800">
                    <tr>
                      <th scope="col" className="py-3.5 px-4 font-semibold">File ID</th>
                      <th scope="col" className="py-3.5 px-4 font-semibold">File Name</th>
                      <th scope="col" className="py-3.5 px-4 font-semibold">File Size</th>
                      <th scope="col" className="py-3.5 px-4 font-semibold">File Path</th>
                      <th scope="col" className="py-3.5 px-4 font-semibold text-right">Delete Options</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 font-sans">
                    {filteredFiles.length > 0 ? (
                      filteredFiles.map((file) => (
                        <tr key={file.id} className="hover:bg-gray-850 transition group">
                          <td className="py-3.5 px-4 font-mono">
                            <span className="bg-indigo-950 text-indigo-300 border border-indigo-900/80 px-2.5 py-1 rounded-md text-[11px] font-bold">
                              {file.id}
                            </span>
                          </td>

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
                              <span className="font-semibold text-gray-100 group-hover:text-indigo-400 transition cursor-pointer" onClick={() => setPreviewFile(file)}>
                                {file.name}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-gray-300">
                            {file.size}
                          </td>

                          <td className="py-3.5 px-4 font-mono text-gray-400 text-[11px]">
                            <span className="bg-gray-950 px-2 py-0.5 rounded border border-gray-800">
                              {file.filePath}
                            </span>
                          </td>

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
                                className="bg-rose-950/70 hover:bg-rose-900 border border-rose-800/80 text-rose-300 hover:text-white px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition shadow-2xs cursor-pointer text-xs"
                                title="Delete File Option"
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
                        <td colSpan={5} className="py-12 text-center text-gray-500">
                          <Folder className="w-10 h-10 mx-auto text-gray-600 mb-2" />
                          <p className="text-sm font-medium text-gray-400">No solution files found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: UPLOAD FILE */}
        {activeTab === "upload" && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="bg-indigo-950/40 border border-indigo-900/60 rounded-xl p-4 text-xs text-indigo-200 flex items-start space-x-3">
              <Upload className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-indigo-300">Upload Solution Files &amp; Assets</h4>
                <p className="mt-1 text-indigo-300/80 leading-relaxed">
                  Select files from your device or specify custom file paths to register them directly in your file manager.
                </p>
              </div>
            </div>

            {/* Drag & Drop Upload Zone */}
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
                accept="*/*"
                multiple
                className="hidden"
              />

              <div className="w-14 h-14 bg-indigo-950 border border-indigo-800 rounded-2xl flex items-center justify-center mx-auto text-indigo-400 shadow-xl mb-4">
                <Upload className="w-7 h-7" />
              </div>

              <h4 className="text-sm font-bold text-gray-100">Drag &amp; drop files here to upload</h4>
              <p className="text-xs text-gray-400 mt-1">Upload solution images, code scripts (.cs, .json), or documents.</p>

              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2 rounded-xl text-xs transition shadow-lg cursor-pointer flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose Device Files</span>
                </button>
              </div>
            </div>

            {/* Add Custom File with Name & Path */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
              <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider font-mono flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                Or Register File Manually (File Name &amp; File Path)
              </h4>

              <form onSubmit={handleAddCustomFile} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">File Name *</label>
                    <input
                      type="text"
                      value={customFileName}
                      onChange={(e) => setCustomFileName(e.target.value)}
                      placeholder="e.g. MemorySaverService.cs"
                      required
                      className="w-full bg-gray-950 border border-gray-800 text-gray-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">File Path (optional)</label>
                    <input
                      type="text"
                      value={customFilePath}
                      onChange={(e) => setCustomFilePath(e.target.value)}
                      placeholder="/workspace/DevWorkspace/Services/..."
                      className="w-full bg-gray-950 border border-gray-800 text-gray-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Preview Image URL (optional)</label>
                  <input
                    type="url"
                    value={customPhotoUrl}
                    onChange={(e) => setCustomPhotoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-gray-950 border border-gray-800 text-gray-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 text-indigo-200 hover:text-white font-bold py-2 rounded-xl text-xs transition shadow-md cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4 text-indigo-400" />
                  <span>Register File in Table</span>
                </button>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* Upload Photo Modal Option */}
      {showPhotoUploadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400">
                  <Camera className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-gray-100">Upload New Photo Memory</h4>
              </div>
              <button onClick={() => setShowPhotoUploadModal(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Local File Selector */}
            <div>
              <input
                type="file"
                ref={photoInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                multiple
                className="hidden"
              />
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-md flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Select Photos from Computer</span>
              </button>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-gray-800"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-[10px] uppercase font-mono">Or enter photo URL</span>
              <div className="flex-grow border-t border-gray-800"></div>
            </div>

            <form onSubmit={handleAddCustomFile} className="space-y-3">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Photo / File Name *</label>
                <input
                  type="text"
                  value={customFileName}
                  onChange={(e) => setCustomFileName(e.target.value)}
                  placeholder="e.g. Memory_Snapshot_2026.jpg"
                  required
                  className="w-full bg-gray-950 border border-gray-800 text-gray-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-400 mb-1">File Location Path</label>
                <input
                  type="text"
                  value={customFilePath}
                  onChange={(e) => setCustomFilePath(e.target.value)}
                  placeholder="/workspace/DevWorkspace/Memories/..."
                  className="w-full bg-gray-950 border border-gray-800 text-gray-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Photo Image URL</label>
                <input
                  type="url"
                  value={customPhotoUrl}
                  onChange={(e) => setCustomPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-gray-950 border border-gray-800 text-gray-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowPhotoUploadModal(false)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2 rounded-xl text-xs transition shadow-md cursor-pointer flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Photo Memory</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Preview Modal */}
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
                <p className="text-[11px] font-mono text-gray-400 mt-0.5">{previewFile.filePath}</p>
              </div>
              <button onClick={() => setPreviewFile(null)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-gray-950 flex items-center justify-center max-h-[70vh] overflow-hidden">
              {previewFile.previewUrl ? (
                <img src={previewFile.previewUrl} alt={previewFile.name} className="max-h-[60vh] rounded-lg object-contain shadow-md" />
              ) : (
                <div className="p-12 text-center text-gray-500 font-mono text-xs">No image preview available</div>
              )}
            </div>

            <div className="bg-gray-900 px-5 py-3 border-t border-gray-800 flex justify-between items-center">
              <span className="text-xs text-gray-400 font-mono">Size: {previewFile.size} | Uploaded: {previewFile.uploadedTime}</span>
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
