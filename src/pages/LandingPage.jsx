import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api'; // Tumhara axios instance

const SERVER = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

function LandingPage() {
  const formatImage = (imgPath, placeholder = 'https://via.placeholder.com/300') => {
    if (!imgPath) return placeholder;
    return imgPath.startsWith('http') ? imgPath : `${SERVER}${imgPath}`;
  };
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  
  // Contact Form State [cite: 56-60]
  const [contact, setContact] = useState({ fullName: '', email: '', mobile: '', city: '' });
  
  // Newsletter State [cite: 71]
  const [subscriber, setSubscriber] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      // Requirements: Fetch Projects [cite: 11] and Clients [cite: 34]
      const [p, c] = await Promise.all([API.get('/projects'), API.get('/clients')]);
      setProjects(p.data);
      setClients(c.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  async function submitContact(e) {
    e.preventDefault();
    try {
      // Requirement: Submit contact details to backend [cite: 61]
      await API.post('/contacts', contact);
      alert('Request submitted!');
      setContact({ fullName: '', email: '', mobile: '', city: '' });
    } catch (error) {
      alert('Error submitting form');
    }
  }

  async function subscribe(e) {
    e.preventDefault();
    try {
      // Requirement: Send email to backend [cite: 71]
      await API.post('/subscribers', { email: subscriber });
      alert('Subscribed successfully!');
      setSubscriber('');
    } catch (error) {
      alert('Error subscribing');
    }
  }

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const navigate = useNavigate();

  return (
    <div className="font-sans text-gray-700 overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className="flex justify-between items-center px-6 md:px-20 py-5 bg-white shadow-sm sticky top-0 z-50">
        <div className="text-2xl font-bold text-blue-900 flex items-center gap-2">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">R</div>
          Real Trust
        </div>
        <div className="hidden md:flex gap-8 text-sm font-semibold text-gray-500">
          <button onClick={() => scrollToSection('home')} className="hover:text-blue-600">HOME</button>
          <button onClick={() => scrollToSection('services')} className="hover:text-blue-600">SERVICES</button>
          <button onClick={() => scrollToSection('projects')} className="hover:text-blue-600">PROJECTS</button>
          <button onClick={() => scrollToSection('testimonials')} className="hover:text-blue-600">TESTIMONIALS</button>
          <button onClick={() => scrollToSection('contact')} className="hover:text-blue-600">CONTACT</button>
        </div>
        <div className="hidden md:flex items-center ml-4">
          <button onClick={() => navigate('/admin')} className="bg-orange-500 text-white py-1 px-3 rounded font-semibold hover:bg-orange-600">Admin Panel</button>
        </div>
      </nav>

      {/* --- HERO SECTION WITH FORM [cite: 62] --- */}
      <header id="home" className="relative min-h-[650px] w-full flex items-center">
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80" 
          alt="Office" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative container mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-10">
          {/* Left Text */}
          <div className="text-white md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight drop-shadow-lg">
              Consultation, <br/> Design, <br/> & Marketing
            </h1>
          </div>

          {/* Right Blue Form [cite: 54-62] */}
          <div id="contact" className="w-full md:w-[400px] bg-blue-900/90 backdrop-blur-md p-8 rounded border-t-4 border-blue-500 shadow-2xl">
            <h3 className="text-white text-2xl font-bold text-center mb-6">Get a Free <br/> Consultation</h3>
            <form onSubmit={submitContact} className="flex flex-col gap-4">
              <input 
                placeholder="Full Name" 
                className="p-3 bg-blue-800/50 border border-blue-600 rounded text-white placeholder-blue-300 outline-none focus:border-orange-500" 
                value={contact.fullName} onChange={e => setContact({...contact, fullName: e.target.value})} required
              />
              <input 
                placeholder="Enter Email Address" type="email"
                className="p-3 bg-blue-800/50 border border-blue-600 rounded text-white placeholder-blue-300 outline-none focus:border-orange-500" 
                value={contact.email} onChange={e => setContact({...contact, email: e.target.value})} required
              />
              <input 
                placeholder="Mobile Number" 
                className="p-3 bg-blue-800/50 border border-blue-600 rounded text-white placeholder-blue-300 outline-none focus:border-orange-500" 
                value={contact.mobile} onChange={e => setContact({...contact, mobile: e.target.value})} required
              />
              <input 
                placeholder="Area, City" 
                className="p-3 bg-blue-800/50 border border-blue-600 rounded text-white placeholder-blue-300 outline-none focus:border-orange-500" 
                value={contact.city} onChange={e => setContact({...contact, city: e.target.value})} required
              />
              <button className="bg-orange-500 text-white font-bold py-3 rounded mt-2 hover:bg-orange-600 transition">Get Quick Quote</button>
            </form>
          </div>
        </div>
      </header>

      {/* --- SECTION 2: Not Your Average Realtor [cite: 113] --- */}
      <section id="services" className="py-20 bg-white relative overflow-hidden px-6 md:px-20">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 z-10 mb-10 md:mb-0">
            <h2 className="text-4xl font-bold text-blue-900 mb-6">Not Your Average Realtor</h2>
            <p className="text-gray-500 leading-relaxed max-w-md">
              We provide comprehensive design and marketing services to get you the best ROI for your properties.
            </p>
          </div>
          {/* Circular Images Layout */}
          <div className="md:w-1/2 relative h-[400px] w-full flex items-center justify-center">
            <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-xl z-10 relative">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400" className="w-full h-full object-cover" />
            </div>
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg absolute top-0 right-10 md:right-20">
               <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400" className="w-full h-full object-cover" />
            </div>
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg absolute bottom-0 right-20 md:right-32 z-20">
               <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: Why Choose Us [cite: 114] --- */}
      <section className="py-20 bg-white text-center px-6 md:px-20">
        <h2 className="text-3xl font-bold text-blue-900 mb-2">Why Choose Us?</h2>
        <div className="w-16 h-1 bg-blue-500 mx-auto mb-16"></div>
        <div className="container mx-auto grid md:grid-cols-3 gap-12">
          {['Potential ROI', 'Design', 'Marketing'].map((item, i) => (
            <div key={i} className="flex flex-col items-center group">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition">
                {i === 0 ? '🔒' : i === 1 ? '🎨' : '📢'}
              </div>
              <h3 className="font-bold text-lg text-blue-900">{item}</h3>
              <p className="text-sm text-gray-500 mt-2 px-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECTION 4: About Us [cite: 116] --- */}
      <section className="py-20 bg-blue-50/50 text-center px-6">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">About Us</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
             With 15 years of experience in real estate, customer service, and construction, we offer the best of both worlds.
          </p>
          <button className="border-2 border-blue-600 text-blue-600 px-8 py-2 rounded-full font-bold hover:bg-blue-600 hover:text-white transition">LEARN MORE</button>
        </div>
      </section>

      {/* --- SECTION 5: Our Projects [cite: 11] --- */}
      <section id="projects" className="py-20 bg-gray-50 px-6 md:px-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Our Projects</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {projects.length > 0 ? projects.map(p => (
               <div key={p._id} className="bg-white shadow rounded overflow-hidden">
                 {/* Requirement: Project Image [cite: 13] */}
                 <img src={formatImage(p.image)} className="w-full h-48 object-cover" />
                 <div className="p-6">
                   {/* Requirement: Project Name [cite: 14] */}
                   <h3 className="font-bold text-blue-900 mb-2">{p.name}</h3>
                   {/* Requirement: Project Description [cite: 15] */}
                   <p className="text-sm text-gray-500 mb-4">{p.description}</p>
                   {/* Requirement: Read More Button [cite: 16] */}
                   <button className="bg-orange-500 text-white text-xs px-4 py-2 rounded font-bold uppercase">Read More</button>
                 </div>
               </div>
            )) : <p className="text-center col-span-3">Loading Projects...</p>}
          </div>
        </div>
      </section>

      {/* --- SECTION 6: Happy Clients [cite: 34] --- */}
      <section id="testimonials" className="py-20 bg-white px-6 md:px-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-12">Happy Clients</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {clients.map(c => (
              <div key={c._id} className="p-4 border border-transparent hover:border-gray-200 rounded-lg transition">
                 {/* Requirement: Client Image [cite: 36] */}
                 <img src={formatImage(c.image, 'https://via.placeholder.com/100')} className="w-16 h-16 rounded-full mx-auto mb-3 object-cover" />
                 {/* Requirement: Client Description [cite: 37] */}
                 <p className="text-xs text-gray-500 mb-4 italic">"{c.description}"</p>
                 {/* Requirement: Client Name [cite: 38] */}
                 <h4 className="text-blue-900 font-bold text-sm">{c.name}</h4>
                 {/* Requirement: Client Designation [cite: 39] */}
                 <span className="text-xs text-orange-500">{c.designation}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER & NEWSLETTER [cite: 70-75] --- */}
      <section className="relative">
        {/* Banner Image */}
        <div className="h-64 relative">
             <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-4 text-center">
                <h3 className="text-2xl font-bold mb-4">Learn more about our listing process.</h3>
                <button className="bg-white text-blue-900 px-6 py-2 font-bold rounded">Learn More</button>
             </div>
        </div>

        {/* Blue Footer Bar */}
          <div className="bg-blue-600 text-white py-6 px-6 md:px-20 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-6 text-sm font-semibold">
              <button onClick={() => scrollToSection('home')}>Home</button>
              <button onClick={() => scrollToSection('services')}>Services</button>
              <button onClick={() => scrollToSection('projects')}>Projects</button>
              <button onClick={() => scrollToSection('testimonials')}>Testimonials</button>
              <button onClick={() => scrollToSection('contact')}>Contact</button>
            </div>
           
           {/* Newsletter Form [cite: 71, 74] */}
           <form onSubmit={subscribe} className="flex items-center gap-2 w-full md:w-auto">
              <span className="font-bold whitespace-nowrap">Subscribe Us</span>
              <input 
                placeholder="Enter Email Address" type="email"
                className="px-3 py-2 text-black rounded-sm outline-none w-full md:w-64"
                value={subscriber} onChange={e => setSubscriber(e.target.value)} required
              />
              <button className="bg-white text-blue-600 px-4 py-2 font-bold rounded-sm hover:bg-gray-100">Subscribe</button>
           </form>
        </div>
        
        {/* Copyright */}
        <div className="bg-gray-900 text-gray-500 text-[10px] py-3 px-6 md:px-20 flex justify-between items-center">
           <p>© 2025 Real Trust. All Rights Reserved.</p>
           <div className="flex gap-3"><span>FB</span><span>TW</span><span>IG</span></div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;