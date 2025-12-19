import React, { useEffect, useState, useRef } from 'react';
import API from '../services/api';

const SERVER = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

function AdminPanel() {
  const formatImage = (imgPath, placeholder = '') => {
    if (!imgPath) return placeholder;
    return imgPath.startsWith('http') ? imgPath : `${SERVER}${imgPath}`;
  };
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [subscribers, setSubscribers] = useState([]);

  // Forms State
  const [projForm, setProjForm] = useState({ name: '', description: '', imageFile: null });
  const [cliForm, setCliForm] = useState({ name: '', designation: '', description: '', imageFile: null });
  const projFileRef = useRef(null);
  const cliFileRef = useRef(null);

  // Crop Modal State
  const [cropModal, setCropModal] = useState({ open: false, src: '', type: 'project' });
  const imgRef = useRef(null);

  // Crop image to 450x350 using canvas
  const cropImage = () => {
    if (!imgRef.current) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;
    
    // Set canvas size to target 450x350
    canvas.width = 450;
    canvas.height = 350;
    
    // Calculate scale to fill canvas while maintaining aspect ratio
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const targetRatio = 450 / 350;
    const imgRatio = imgWidth / imgHeight;
    
    let sx, sy, sw, sh;
    if (imgRatio > targetRatio) {
      // Image is wider, crop sides
      sh = imgHeight;
      sw = imgHeight * targetRatio;
      sx = (imgWidth - sw) / 2;
      sy = 0;
    } else {
      // Image is taller, crop top/bottom
      sw = imgWidth;
      sh = imgWidth / targetRatio;
      sx = 0;
      sy = (imgHeight - sh) / 2;
    }
    
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, 450, 350);
    canvas.toBlob(blob => {
      if (cropModal.type === 'project') {
        setProjForm({ ...projForm, imageFile: new File([blob], 'cropped.jpg', { type: 'image/jpeg' }) });
      } else {
        setCliForm({ ...cliForm, imageFile: new File([blob], 'cropped.jpg', { type: 'image/jpeg' }) });
      }
      setCropModal({ open: false, src: '', type: '' });
    }, 'image/jpeg', 0.85);
  };

  const openCropModal = (file, type) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setCropModal({ open: true, src: e.target.result, type });
    };
    reader.readAsDataURL(file);
  };

  const closeCropModal = () => {
    setCropModal({ open: false, src: '', type: '' });
  };

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [p, c, ct, s] = await Promise.all([
        API.get('/projects'), API.get('/clients'), API.get('/contacts'), API.get('/subscribers')
      ]);
      setProjects(p.data); setClients(c.data); setContacts(ct.data); setSubscribers(s.data);
    } catch (e) { console.error(e); }
  };

  const uploadImage = async (file) => {
    const fd = new FormData(); fd.append('image', file);
    const res = await API.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.url;
  };

  // Requirement: Add Project (Image, Name, Description) [cite: 78-83]
  const handleAddProject = async (e) => {
    e.preventDefault();
    let image = projForm.imageFile ? await uploadImage(projForm.imageFile) : '';
    await API.post('/projects', { name: projForm.name, description: projForm.description, image });
    setProjForm({ name: '', description: '', imageFile: null });
    loadData();
  };

  // Requirement: Add Client (Image, Name, Desc, Designation) [cite: 84-89]
  const handleAddClient = async (e) => {
    e.preventDefault();
    let image = cliForm.imageFile ? await uploadImage(cliForm.imageFile) : '';
    await API.post('/clients', { ...cliForm, image });
    setCliForm({ name: '', designation: '', description: '', imageFile: null });
    loadData();
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white p-6 fixed h-full">
        <h1 className="text-2xl font-bold mb-8 border-b pb-4">Admin Panel</h1>
        <nav className="space-y-2">
          <button onClick={() => setActiveTab('projects')} className={`block w-full text-left py-2 px-4 rounded ${activeTab==='projects' ? 'bg-orange-500' : 'hover:bg-blue-800'}`}>Projects</button>
          <button onClick={() => setActiveTab('clients')} className={`block w-full text-left py-2 px-4 rounded ${activeTab==='clients' ? 'bg-orange-500' : 'hover:bg-blue-800'}`}>Clients</button>
          <button onClick={() => setActiveTab('contacts')} className={`block w-full text-left py-2 px-4 rounded ${activeTab==='contacts' ? 'bg-orange-500' : 'hover:bg-blue-800'}`}>Contacts</button>
          <button onClick={() => setActiveTab('subscribers')} className={`block w-full text-left py-2 px-4 rounded ${activeTab==='subscribers' ? 'bg-orange-500' : 'hover:bg-blue-800'}`}>Subscribers</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        
        {/* --- PROJECTS MANAGEMENT --- */}
        {activeTab === 'projects' && (
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Project Management</h2>
            <form onSubmit={handleAddProject} className="bg-white p-6 rounded shadow mb-8 grid gap-4">
              <h3 className="font-bold text-gray-600">Add New Project</h3>
              <input placeholder="Project Name" value={projForm.name} onChange={e=>setProjForm({...projForm, name:e.target.value})} className="border p-2 rounded" required />
              <textarea placeholder="Project Description" value={projForm.description} onChange={e=>setProjForm({...projForm, description:e.target.value})} className="border p-2 rounded" required />
              <div className="text-sm text-gray-500 flex items-center gap-3">
                <input ref={projFileRef} accept="image/*" type="file" className="hidden" onChange={e=>e.target.files[0] && openCropModal(e.target.files[0], 'project')} />
                <button type="button" onClick={()=>projFileRef.current && projFileRef.current.click()} className="bg-blue-500 text-white py-1 px-3 rounded">Choose Image</button>
                {projForm.imageFile ? (
                  <span className="text-gray-700">{projForm.imageFile.name}</span>
                ) : (
                  <span className="text-gray-400">No file chosen</span>
                )}
              </div>
              <button className="bg-green-600 text-white py-2 px-6 rounded font-bold w-fit">Add Project</button>
            </form>
            <div className="grid grid-cols-3 gap-4">
              {projects.map(p => (
                <div key={p._id} className="bg-white p-4 shadow rounded">
                  {p.image && <img src={formatImage(p.image)} className="h-32 w-full object-cover mb-2 rounded" />}
                  <h4 className="font-bold">{p.name}</h4>
                  <p className="text-xs text-gray-500">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- CLIENT MANAGEMENT --- */}
        {activeTab === 'clients' && (
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Client Management</h2>
            <form onSubmit={handleAddClient} className="bg-white p-6 rounded shadow mb-8 grid gap-4">
              <h3 className="font-bold text-gray-600">Add Happy Client</h3>
              <input placeholder="Client Name" value={cliForm.name} onChange={e=>setCliForm({...cliForm, name:e.target.value})} className="border p-2 rounded" required />
              <input placeholder="Designation (e.g. CEO)" value={cliForm.designation} onChange={e=>setCliForm({...cliForm, designation:e.target.value})} className="border p-2 rounded" required />
              <textarea placeholder="Description / Review" value={cliForm.description} onChange={e=>setCliForm({...cliForm, description:e.target.value})} className="border p-2 rounded" required />
              <div className="text-sm text-gray-500 flex items-center gap-3">
                <input ref={cliFileRef} accept="image/*" type="file" className="hidden" onChange={e=>e.target.files[0] && openCropModal(e.target.files[0], 'client')} />
                <button type="button" onClick={()=>cliFileRef.current && cliFileRef.current.click()} className="bg-blue-500 text-white py-1 px-3 rounded">Choose Image</button>
                {cliForm.imageFile ? (
                  <span className="text-gray-700">{cliForm.imageFile.name}</span>
                ) : (
                  <span className="text-gray-400">No file chosen</span>
                )}
              </div>
              <button className="bg-green-600 text-white py-2 px-6 rounded font-bold w-fit">Add Client</button>
            </form>
            <div className="grid grid-cols-3 gap-4">
              {clients.map(c => (
                <div key={c._id} className="bg-white p-4 shadow rounded flex items-center gap-4">
                  {c.image && <img src={formatImage(c.image)} className="h-12 w-12 rounded-full object-cover" />}
                  <div>
                    <h4 className="font-bold">{c.name}</h4>
                    <p className="text-xs text-orange-500">{c.designation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- CONTACT DETAILS [cite: 90-95] --- */}
        {activeTab === 'contacts' && (
          <div>
             <h2 className="text-2xl font-bold text-blue-900 mb-6">Contact Form Responses</h2>
             <div className="bg-white shadow rounded overflow-hidden">
               <table className="w-full text-left">
                 <thead className="bg-gray-200">
                   <tr>
                     <th className="p-3">Full Name</th>
                     <th className="p-3">Email</th>
                     <th className="p-3">Mobile</th>
                     <th className="p-3">City</th>
                   </tr>
                 </thead>
                 <tbody>
                   {contacts.map(ct => (
                     <tr key={ct._id} className="border-b hover:bg-gray-50">
                       <td className="p-3">{ct.fullName}</td>
                       <td className="p-3">{ct.email}</td>
                       <td className="p-3">{ct.mobile}</td>
                       <td className="p-3">{ct.city}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {/* --- SUBSCRIBERS [cite: 96-97] --- */}
        {activeTab === 'subscribers' && (
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Subscribed Emails</h2>
            <div className="bg-white shadow rounded p-6">
              <ul className="list-disc pl-5">
                {subscribers.map(s => (
                  <li key={s._id} className="mb-2 text-gray-700">{s.email}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

      </div>

      {/* --- CROP MODAL --- */}
      {cropModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-2xl">
            <h3 className="text-lg font-bold mb-4">Crop Image (450 x 350)</h3>
            <div className="mb-4 flex justify-center border border-gray-300 rounded overflow-hidden bg-gray-100" style={{ maxHeight: '400px' }}>
              <img ref={imgRef} src={cropModal.src} style={{ maxWidth: '100%', maxHeight: '100%' }} />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={closeCropModal} className="bg-gray-500 text-white py-2 px-4 rounded">Cancel</button>
              <button onClick={cropImage} className="bg-green-600 text-white py-2 px-4 rounded font-bold">Crop & Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;