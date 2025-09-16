import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api'; // Import the real axios library
import { ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';

const AddLeadPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  
const [formData, setFormData] = useState({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  leadType: '',

  propertyType: '',
  budgetRange: '',
  preferredLocation: '',
  bedrooms: '',
  bathrooms: '',
  timeline: '',

  propertyAddress: '',
  motivation: '',
  squareFootage: '',
propertyCondition: '',
renovations: '',           // ← Add this
  sellingTimeline: '',   
  currentOwe: '',
  otherDebts: '',
  estimatedValue: '',
  bestVisitTime: '',
  referralSource: '',
  additionalNotes: '',

  leadSource: '',
  leadStatus: '',
  notes: '',
  socialMedia: [{ platform: '', handle: '' }],
});


  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const processedValue = ['bedrooms', 'bathrooms'].includes(name) ? (value !== '' ? parseInt(value, 10) : '') : value;
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleSocialMediaChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSocialMedia = [...formData.socialMedia];
    updatedSocialMedia[index][name] = value;
    setFormData((prev) => ({ ...prev, socialMedia: updatedSocialMedia }));
  };

 const handleAddSocialMedia = () => {
    setFormData((prev) => ({ ...prev, socialMedia: [...prev.socialMedia, { platform: '', handle: '' }] }));
  };


  const handleRemoveSocialMedia = (index) => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: prev.socialMedia.filter((_, i) => i !== index),
    }));
  };

const buildPayload = (data) => {
  let payload = {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone_number: data.phoneNumber,
    type: data.leadType,
    source: data.leadSource,
    status: data.leadStatus,
    notes: data.notes,
  };

  if (data.leadType === "Buyer") {
Object.assign(payload, {
      property_type: data.propertyType,
      budget_range: data.budgetRange,
      preferred_location: data.preferredLocation,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      timeline: data.timeline,
    });
  }

  if (data.leadType === "Seller") {
    Object.assign(payload, {

      property_address: data.propertyAddress,
      property_type: data.propertyType,
      motivation: data.motivation,
      selling_timeline: data.sellingTimeline,
      square_footage: data.squareFootage,
      property_condition: data.propertyCondition,

      renovations: data.renovations,
      current_owe: data.currentOwe,
      other_debts: data.otherDebts,
      estimated_value: data.estimatedValue,
      best_visit_time: data.bestVisitTime,
      referral_source: data.referralSource,
      additional_notes: data.additionalNotes,
    });

  }
  if (data.leadType === "Investor") {
    // Example: Add investor-related fields here if needed
  }
  Object.keys(payload).forEach(
    (key) =>
      (payload[key] === '' || payload[key] === null || payload[key] === undefined) &&
      delete payload[key]
  );

  return payload;
};

  






  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {


      const doAddWorkflow = window.confirm("Do you also want to add a workflow to this lead?");
let payload = buildPayload(formData);
    if (formData.leadType === "Buyer" || formData.leadType === "Investor") {
      const filteredSocialMedia = formData.socialMedia.filter(
        (social) => social.platform && social.handle
      );
      if (filteredSocialMedia.length) {
        payload.social_media = filteredSocialMedia;
      }
    }

payload = {
  ...payload,
  sendEmail: doAddWorkflow,
};
      const response = await axios.post('/api/leads', payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        }
      });

      console.log('Lead created successfully:', response.data);
      showNotification('Lead created successfully!', 'success');

      setTimeout(() => {
        navigate('/leads');
      }, 2000);
      
    } catch (err) {
      console.error('Failed to create lead:', err);
      const errorMessage = err.response?.data?.error || 'An unknown error occurred.';
      showNotification(`Failed to create lead: ${errorMessage}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const notificationClass = notification.type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className="flex-1 p-4 md:p-8 overflow-auto bg-slate-900 text-slate-300"  style={{ backgroundColor: '#0b0b0b'  , color : "white"}}>
      {notification.message && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md text-white shadow-lg ${notificationClass}`}>
          {notification.message}
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Add New Lead</h1>
        <button className="text-slate-400 hover:text-white flex items-center space-x-2" onClick={() => navigate('/leads')}>
          <ArrowLeft size={24} /> <span>Back to Leads</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-800 p-4 md:p-8 rounded-lg" style={{ backgroundColor: '#1C1C1C' }}>
        {/* Lead Type */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Lead Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className={`p-4 rounded-md border border-slate-700 hover:bg-slate-700 cursor-pointer flex items-center space-x-2 transition-colors ${formData.leadType === 'Buyer' ? 'bg-slate-700 border-yellow-500' : ''}`} style={{ backgroundColor: '#4D4D4D' }}>
              <input
                type="radio"
                name="leadType"
                value="Buyer"
                checked={formData.leadType === 'Buyer'}
                onChange={handleChange}
                className="accent-yellow-400"
                style={{backgroundColor : 'grey'}}
                required
              />
              <div>
                <div className="font-semibold">Buyer</div>
                <div className="text-slate-400 text-sm">Looking to purchase property</div>
              </div>
            </label>
            <label className={`p-4 rounded-md border border-slate-700 hover:bg-slate-700 cursor-pointer flex items-center space-x-2 transition-colors ${formData.leadType === 'Seller' ? 'bg-slate-700 border-yellow-500' : ''}`} style={{ backgroundColor: '#4D4D4D' }}>
              <input
                type="radio"
                name="leadType"
                value="Seller"
                checked={formData.leadType === 'Seller'}
                onChange={handleChange}
                className="accent-yellow-400"
                required
              />
              <div>
                <div className="font-semibold">Seller</div>
                <div className="text-slate-400 text-sm">Looking to sell property</div>
              </div>
            </label>
            <label className={`p-4 rounded-md border border-slate-700 hover:bg-slate-700 cursor-pointer flex items-center space-x-2 transition-colors ${formData.leadType === 'Investor' ? 'bg-slate-700 border-yellow-500' : ''}`} style={{ backgroundColor: '#4D4D4D' }}>
              <input
                type="radio"
                name="leadType"
                value="Investor"
                checked={formData.leadType === 'Investor'}
                onChange={handleChange}
                className="accent-yellow-400"
                required
              />
              <div>
                <div className="font-semibold">Investor</div>
                <div className="text-slate-400 text-sm">Investment opportunities</div>
              </div>
            </label>
          </div>
        </div>
{(formData.leadType === "Buyer" || formData.leadType === "Investor") && (
  <>
        {/* Contact Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" >
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name *" className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" style={{ backgroundColor: '#4D4D4D' }}  required />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name *" className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"style={{ backgroundColor: '#4D4D4D' }}  required />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address *" className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" style={{ backgroundColor: '#4D4D4D' }} required />
            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number *" className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" style={{ backgroundColor: '#4D4D4D' }} required />
          </div>
        </div>

        {/* Property Preferences */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Property Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"style={{ backgroundColor: '#4D4D4D' }} >
              <option value="">Select property type</option>
              <option value="House">House</option>
              <option value="Condo">Condo</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Land">Land</option>
              <option value="Other">Other</option>
            </select>
            <select name="budgetRange" value={formData.budgetRange} onChange={handleChange} className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" style={{ backgroundColor: '#4D4D4D' }} >
              <option value="">Select budget range</option>
              <option value="$100k - $250k">$100k - $250k</option>
              <option value="$250k - $500k">$250k - $500k</option>
              <option value="$500k - $1M">$500k - $1M</option>
              <option value="$1M+">$1M+</option>
            </select>
            <input type="text" name="preferredLocation" value={formData.preferredLocation} onChange={handleChange} placeholder="City, neighborhood, or zip" className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" style={{ backgroundColor: '#4D4D4D' }} />
            <select name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" style={{ backgroundColor: '#4D4D4D' }} >
              <option value="">Bedrooms</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
            <select name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" style={{ backgroundColor: '#4D4D4D' }} >
              <option value="">Bathrooms</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <select name="timeline" value={formData.timeline} onChange={handleChange} className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" style={{ backgroundColor: '#4D4D4D' }}>
              <option value="">Timeline</option>
              <option value="Immediate">Immediate</option>
              <option value="1-3 months">1-3 months</option>
              <option value="3-6 months">3-6 months</option>
              <option value="6+ months">6+ months</option>
            </select>
          </div>
        </div>

        {/* Lead Details */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Lead Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <select name="leadSource" value={formData.leadSource} onChange={handleChange} className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"style={{ backgroundColor: '#4D4D4D' }} >
              <option value="Referral">Referral</option>
              <option value="SocialMedia">Social Media</option>
              <option value="Website">Website</option>
              <option value="Zillow">Zillow</option>
              <option value="Other">Other</option>
            </select>
            <select name="leadStatus" value={formData.leadStatus} onChange={handleChange} className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" style={{ backgroundColor: '#4D4D4D' }} >
              <option value="New">New</option>
              <option value="Nurturing">Nurturing</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
              <option value="Contacted">Contacted</option>
            </select>
          </div>
          <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Notes" className="w-full bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" rows="4" style={{ backgroundColor: '#4D4D4D' }}></textarea>
        </div>
        
        {/* Social Media Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Social Media</h2>
            <button
              type="button"
              onClick={handleAddSocialMedia}
              className="text-slate-400 hover:text-white flex items-center space-x-1"
              
            >
              <PlusCircle size={20} />
              <span>Add More</span>
            </button>
          </div>
          {formData.socialMedia.map((social, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4">
              <div className="flex-grow grid grid-cols-2 gap-4">
                <select
                  name="platform"
                  value={social.platform}
                  onChange={(e) => handleSocialMediaChange(index, e)}
                  className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  style={{ backgroundColor: '#4D4D4D' }}
                >
                  <option value="">Select Platform</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="X (Twitter)">X (Twitter)</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="YouTube">YouTube</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Threads">Threads</option>
                </select>
                <input
                  type="text"
                  name="handle"
                  value={social.handle}
                  onChange={(e) => handleSocialMediaChange(index, e)}
                  placeholder="Handle (e.g., @johndoe)"
                  className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  style={{ backgroundColor: '#4D4D4D' }}
                />
              </div>
              {formData.socialMedia.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSocialMedia(index)}
                  className="p-2 text-red-400 hover:text-red-500"
                >
                  <Trash2 size={24} />
                </button>
              )}
            </div>
          ))}
        </div>


        </>
)}
  <>
{formData.leadType === "Seller" && (
  <div className="mb-6">
    <h2 className="text-xl font-semibold mb-4 text-white">Contact Information</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <input
      type="text"
      name="firstName"
      value={formData.firstName || ""}
      onChange={handleChange}
      placeholder="First Name *"
      className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
      style={{ backgroundColor: "#4D4D4D" }}
      required
    />
    <input
      type="text"
      name="lastName"
      value={formData.lastName || ""}
      onChange={handleChange}
      placeholder="Last Name *"
      className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
      style={{ backgroundColor: "#4D4D4D" }}
      required
    />
    <input
      type="email"
      name="email"
      value={formData.email || ""}
      onChange={handleChange}
      placeholder="Email Address *"
      className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
      style={{ backgroundColor: "#4D4D4D" }}
      required
    />
    <input
      type="tel"
      name="phoneNumber"
      value={formData.phoneNumber || ""}
      onChange={handleChange}
      placeholder="Phone Number *"
      className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
      style={{ backgroundColor: "#4D4D4D" }}
      required
    />
  </div>
    <h2 className="text-xl font-semibold mb-4 text-white">Seller Information</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        type="text"
        name="propertyAddress"
        value={formData.propertyAddress || ""}
        onChange={handleChange}
        placeholder="Property Address *"
        className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        style={{ backgroundColor: "#4D4D4D" }}
        required
      />
      <select
        name="propertyType"
        value={formData.propertyType || ""}
        onChange={handleChange}
        className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        style={{ backgroundColor: "#4D4D4D" }}
      >
        <option value="">Select property type</option>
        <option value="House">House</option>
        <option value="Condo">Condo</option>
        <option value="Townhouse">Townhouse</option>
        <option value="Land">Land</option>
        <option value="Other">Other</option>
      </select>
      <select
        name="motivation"
        value={formData.motivation || ""}
        onChange={handleChange}
        className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        style={{ backgroundColor: "#4D4D4D" }}
      >
        <option value="">Motivation for selling</option>
        <option value="Relocation">Relocation</option>
        <option value="Upsizing">Upsizing</option>
        <option value="Downsizing">Downsizing</option>
        <option value="Investment">Investment</option>
        <option value="Financial Reasons">Financial Reasons</option>
        <option value="Life Event">Life Event</option>
        <option value="Other">Other</option>
      </select>

      <select
        name="sellingTimeline"
        value={formData.sellingTimeline || ""}
        onChange={handleChange}
        className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        style={{ backgroundColor: "#4D4D4D" }}
      >
        <option value="">When are you looking to sell?</option>
        <option value="Immediately">Immediately</option>
        <option value="1-3 months">Within 1-3 months</option>
        <option value="3-6 months">Within 3-6 months</option>
        <option value="6+ months">6+ months</option>
        <option value="Exploring Options">Just exploring options</option>
      </select>
      <input
        type="text"
        name="squareFootage"
        value={formData.squareFootage || ""}
        onChange={handleChange}
        placeholder="Approximate Square Footage"
        className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        style={{ backgroundColor: "#4D4D4D" }}
      />

      <select
        name="propertyCondition"
        value={formData.propertyCondition || ""}
        onChange={handleChange}
        className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        style={{ backgroundColor: "#4D4D4D" }}
      >
        <option value="">Rate property condition</option>
        <option value="1">1 - Poor</option>
        <option value="2">2</option>
        <option value="3">3 - Average</option>
        <option value="4">4</option>
        <option value="5">5 - Excellent</option>
      </select>
      <input
        type="text"
        name="renovations"
        value={formData.renovations || ""}
        onChange={handleChange}
        placeholder="Major renovations/repairs planned or recently completed"
        className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 col-span-2"
        style={{ backgroundColor: "#4D4D4D" }}
      />

      <input
        type="text"
        name="currentOwe"
        value={formData.currentOwe || ""}
        onChange={handleChange}
        placeholder="What do you currently owe on the property?"
        className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 col-span-2"
        style={{ backgroundColor: "#4D4D4D" }}
      />
      <input
        type="text"
        name="otherDebts"
        value={formData.otherDebts || ""}
        onChange={handleChange}
        placeholder="Any other debts? (home equity, credit lines, etc.)"
        className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 col-span-2"
        style={{ backgroundColor: "#4D4D4D" }}
      />

      <input
        type="text"
        name="estimatedValue"
        value={formData.estimatedValue || ""}
        onChange={handleChange}
        placeholder="What do you think the property is worth?"
        className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 col-span-2"
        style={{ backgroundColor: "#4D4D4D" }}
      />

      <input
        type="text"
        name="bestVisitTime"
        value={formData.bestVisitTime || ""}
        onChange={handleChange}
        placeholder="Best time to come by and see the property"
        className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 col-span-2"
        style={{ backgroundColor: "#4D4D4D" }}
      />

      <select
        name="referralSource"
        value={formData.referralSource || ""}
        onChange={handleChange}
        className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 col-span-2"
        style={{ backgroundColor: "#4D4D4D" }}
      >
        <option value="">How did you hear about us?</option>
        <option value="Referral">Referral</option>
        <option value="Online Search">Online Search</option>
        <option value="Social Media">Social Media</option>
        <option value="Advertisement">Advertisement</option>
        <option value="Previous Client">Previous Client</option>
      </select>

      <textarea
        name="additionalNotes"
        value={formData.additionalNotes || ""}
        onChange={handleChange}
        placeholder="Anything else you need us to know?"
        className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 col-span-2"
        rows="4"
        style={{ backgroundColor: "#4D4D4D" }}
      ></textarea>

    </div>

  </div>
)}

  </>
<div className="flex justify-end space-x-4 mt-6">
  <button
    type="button"
    onClick={() => navigate('/leads')}
    className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-md transition-colors"
    style={{ backgroundColor: '#4D4D4D' }}
  >
    Cancel
  </button>
  <button
    type="submit"
    disabled={isLoading}
    className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    style={{ backgroundColor: '#FFAA09', color: 'black' }}
  >
    {isLoading ? 'Creating...' : 'Create Lead'}
  </button>
</div>
      </form>
    </div>
  );
};

export default AddLeadPage;