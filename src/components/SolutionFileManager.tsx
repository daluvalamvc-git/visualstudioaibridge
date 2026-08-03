import React, { useState, useEffect, useRef } from "react";
import { SolutionFile } from "../types";
import { 
  Folder, Image as ImageIcon, Upload, Trash2, Plus, Search, 
  FileText, CheckCircle2, Eye, X, HardDrive, Grid, ListFilter
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
  const [activeTab, setActiveTab] = useState<"browse" | "list" | "upload">("list");
  const [files, setFiles] = useState<SolutionFile[]>(() => {
    const saved = localStorage.getItem("VS2026_SOLUTION_FILES_V2");
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

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    localStorage.setItem("VS2026_SOLUTION_FILES_V2", JSON.stringify(files));
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
      const filePath = `/workspace/DevWorkspace/Uploads/${file.name}`;
      const fileSize = (file.size / 1024).toFixed(0) + " KB";

      const reader = new FileReader();
      reader.onload = (event) => {
        const newFile: SolutionFile = {
          id: fileId,
          name: file.name,
          size: fileSize,
          filePath,
          uploadedTime: formattedTime,
          type: file.type || "application/octet-stream",
          previewUrl: event.target?.result as string || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
        };
        setFiles(prev => [newFile, ...prev]);
      };
      reader.readAsDataURL(file);
    });

    showToast(`Successfully uploaded ${count} file(s) to registry.`);
    setActiveTab("list");
  };

  const handleAddCustomFile = (e: React.FormEvent) => {
    e.preventDefault();
    const name = customFileName.trim() || "solution_asset_" + Math.floor(1000 + Math.random() * 9000) + ".png";
    const path = customFilePath.trim() || `/workspace/DevWorkspace/Uploads/${name}`;
    const fileId = "FID-" + Math.floor(10000 + Math.random() * 90000);

    const newFile: SolutionFile = {
      id: fileId,
      name,
      size: "420 KB",
      filePath: path,
      uploadedTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      type: "image/png",
      previewUrl: customPhotoUrl.trim() || "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80"
    };

    setFiles(prev => [newFile, ...prev]);
    setCustomFileName("");
    setCustomFilePath("");
    setCustomPhotoUrl("");
    showToast(`Added file '${name}' (ID: ${fileId})!`);
    setActiveTab("list");
  };

  const handleDeleteFile = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete '${name}' (ID: ${id})?`)) {
      setFiles(prev => prev.filter(f => f.id !== id));
      showToast(`Deleted file '${name}'.`);
    }
  };

  const filteredFiles = files.filter(f => 
    f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.filePath.toLowerCase().includes(searchQuery.toLowerCase())
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
              Solution Files &amp; Assets Registry
              <span className="text-[10px] bg-indigo-950 text-indigo-300 font-mono px-2 py-0.5 rounded border border-indigo-900 font-semibold">
                {files.length} Files Uploaded
              </span>
            </h3>
            <p className="text-xs text-gray-400">Browse solution files, view detailed file tables, and upload new photos or documents.</p>
          </div>
        </div>

        {/* 3 Main Navigation Tabs: Browse | File List | Upload File */}
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

      {/* Main Workspace Body */}
      <div className="flex-1 p-6 overflow-y-auto min-h-0 bg-gray-950">

        {/* TAB 1: BROWSE (Grid View) */}
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
                onClick={() => setActiveTab("upload")}
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

        {/* TAB 2: FILE LIST (Table with requested columns: File ID, File Name, File Size, File Path, Delete Options) */}
        {activeTab === "list" && (
          <div className="space-y-4">
            {/* Search Bar */}
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

            {/* Requested Table View */}
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

                          {/* Column 3: File Size */}
                          <td className="py-3.5 px-4 font-mono text-gray-300">
                            {file.size}
                          </td>

                          {/* Column 4: File Path */}
                          <td className="py-3.5 px-4 font-mono text-gray-400 text-[11px]">
                            <span className="bg-gray-950 px-2 py-0.5 rounded border border-gray-800">
                              {file.filePath}
                            </span>
                          </td>

                          {/* Column 5: Delete Options */}
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
                          <p className="text-xs mt-1">Switch to 'Upload File' tab to add your first solution file.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: UPLOAD FILE (Next to Browse and File List) */}
        {activeTab === "upload" && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="bg-indigo-950/40 border border-indigo-900/60 rounded-xl p-4 text-xs text-indigo-200 flex items-start space-x-3">
              <Upload className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-indigo-300">Upload Solution Files &amp; Assets</h4>
                <p className="mt-1 text-indigo-300/80 leading-relaxed">
                  Select files from your local device or specify custom file paths to register them directly in the solution file table.
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
                <div className="p-12 text-center text-gray-500 font-mono text-xs">No image preview for non-binary code file</div>
              )}
            </div>

            <div className="bg-gray-900 px-5 py-3 border-t border-gray-800 flex justify-between items-center">
              <span className="text-xs text-gray-400 font-mono">Size: {previewFile.size}</span>
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
