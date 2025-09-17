import React, { useState, useEffect, useRef } from 'react';
import axios from '../api'; // Import Axios
import { Search, Save, Plus, Filter, Download, MoreHorizontal, ChevronDown, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const LeadPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const filterRef = useRef(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pageSize, setPageSize] = useState(25);
  const [listName, setListName] = useState('');

  // NEW: sorting state (additive)
  const [sortBy, setSortBy] = useState(''); // '', 'name', 'status', 'source' [1]
  const [sortDir, setSortDir] = useState('asc'); // 'asc' | 'desc' [1]

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Helper: client-side sorter (additive)
  const sortLeadsClient = (arr, key, dir) => {
    if (!key) return arr; // no-op if not sorting [1]
    const getVal = (lead) => {
      if (key === 'name') return `${lead.first_name || ''} ${lead.last_name || ''}`.trim(); // combine first/last [1]
      if (key === 'status') return lead.status || ''; // status string [1]
      if (key === 'source') return lead.source || ''; // source string [1]
      // ADDED: handle email_stage for sorting
      if (key === 'email_stage') return lead.email_stage || ''; // email_stage string [1]
      return '';
    };
    const mul = dir === 'asc' ? 1 : -1; // direction multiplier [1]
    return [...arr].sort((a, b) => {
      const av = getVal(a);
      const bv = getVal(b);
      if (av == null && bv == null) return 0; // stable for nulls [4]
      if (av == null) return 1; // push nulls to end [4]
      if (bv == null) return -1; // keep non-nulls first [4]
      return av
        .toString()
        .localeCompare(bv.toString(), undefined, { sensitivity: 'base', numeric: true }) * mul; // case-insensitive, numeric [2]
    });
  };

  // Toggle sort (additive)
  const toggleSort = (key) => {
    if (sortBy === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc')); // flip direction [1]
    } else {
      setSortBy(key); // set new key [1]
      setSortDir('asc'); // default ascending [1]
    }
    setCurrentPage(1); // reset page for UX [1]
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage,
          limit: pageSize,  // use pageSize here
        });

        if (statusFilter) queryParams.append('status', statusFilter); // preserve filters [3]
        if (sourceFilter) queryParams.append('source', sourceFilter); // preserve filters [3]
        if (searchTerm) queryParams.append('search', searchTerm); // preserve search [3]

        // OPTIONAL: pass sorting to backend if supported (kept commented to avoid breaking existing API)
        // if (sortBy) {
        //   queryParams.append('sortBy', sortBy);     // 'name' | 'status' | 'source' [3]
        //   queryParams.append('sortDir', sortDir);   // 'asc' | 'desc' [3]
        // }

        const response = await axios.get(`/api/leads?${queryParams.toString()}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
          },
        });

        const incoming = response.data.leads || []; // safety default [1]
        // ADDED: ensure email_stage is included in the fetched data
        const processedLeads = incoming.map(lead => ({
          ...lead,
          // Assuming your backend returns email_stage, otherwise you'll need to map it
          email_stage: lead.email_stage || 'N/A' // Default to 'N/A' if not present
        }));
        const sorted = sortLeadsClient(processedLeads, sortBy, sortDir); // always sort client-side for consistency [1]
        setLeads(sorted); // set sorted data [1]
        setTotalLeads(response.data.totalLeads); // keep totals [1]
        setTotalPages(response.data.totalPages); // keep pagination [1]
      } catch (error) {
        console.error('Failed to fetch leads:', error); // existing handling [1]
      } finally {
        setLoading(false); // stop spinner [1]
      }
    };

    // include sortBy/sortDir so UI re-sorts when user toggles headers
    fetchLeads(); // fetch and sort [1]
  }, [currentPage, statusFilter, sourceFilter, searchTerm, sortBy, sortDir, pageSize]);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]})- ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'status') setStatusFilter(value);
    else if (filterType === 'source') setSourceFilter(value);

    setCurrentPage(1);
    setIsFilterDropdownOpen(false); // close after select
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setStatusFilter('');
    setSourceFilter('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  // function to send filtered leads and criteria to backend

  const confirmSaveFilteredLeads = () => {
    setShowConfirm(true);
  };

  const cancelSave = () => {
    setShowConfirm(false);
  };

  const doSaveFilteredLeads = async () => {
    setShowConfirm(false);
    try {
      const payload = {
        listName: listName.trim(),  // Pass list name here
        filters: {
          status: statusFilter,
          source: sourceFilter,
          search: searchTerm,
        },
        leadIds: leads.map((lead) => lead.id),
      };

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      await axios.post('/api/leads/saved-leads', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Filtered leads list saved successfully.');
      setListName(''); // Reset input after save
    } catch (error) {
      console.error('Failed to save filtered leads:', error);
      alert('Failed to save filtered leads list.');
    }
  };

  const renderPaginationButtons = () => {
    const pages = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-8 h-8 flex items-center justify-center rounded border border-slate-600 ${
            i === currentPage ? 'bg-slate-600 text-white' : 'hover:bg-slate-700 text-slate-500'
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-black p-3 md:p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 space-y-3 md:space-y-0">
        <h1 className={`font-medium text-white ${isMobile ? 'text-xl' : 'text-2xl'}`}>Leads</h1>
        <div className="flex items-center space-x-2 md:space-x-3 overflow-x-auto">
          <button
            onClick={confirmSaveFilteredLeads}
            className={`text-slate-400 text-sm flex items-center space-x-2 border border-slate-600 rounded hover:bg-slate-800 whitespace-nowrap ${
              isMobile ? 'px-2 py-1' : 'px-3 py-2'
            }`}
          >
            <Save size={14} />
            <span>Save List</span>
          </button>

          <Link to="/add-lead">
            <button
              className={`bg-[#222222] text-white text-sm rounded font-medium hover:bg-slate-500 flex items-center space-x-2 whitespace-nowrap ${
                isMobile ? 'px-2 py-1' : 'px-4 py-2'
              }`}
            >
              <Plus size={14} />
              <span>Add Lead</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Active Filters */}
      {(statusFilter || sourceFilter || searchTerm) && (
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-slate-400 text-sm">Active Filters:</span>
          {statusFilter && (
            <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
              <span>Status: {statusFilter}</span>
              <button onClick={() => handleFilterChange('status', '')}><X size={10} /></button>
            </span>
          )}
          {sourceFilter && (
            <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
              <span>Source: {sourceFilter}</span>
              <button onClick={() => handleFilterChange('source', '')}><X size={10} /></button>
            </span>
          )}
          {searchTerm && (
            <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
              <span>Search: {searchTerm}</span>
              <button onClick={() => setSearchTerm('')}><X size={10} /></button>
            </span>
          )}
          <button onClick={clearFilters} className="text-slate-500 text-xs hover:underline">Clear All</button>
        </div>
      )}

      {/* Lead Overview */}
      <div className="bg-[#1e1e1e] rounded border border-slate-700 p-3 md:p-4 mb-4 md:mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-3">
          <h2 className="text-white text-base md:text-lg"></h2>

          {/* Filter, Export, Search cluster */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            {/* Filter Dropdown trigger */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setIsFilterDropdownOpen((v) => !v)}
                className={`text-slate-400 text-sm flex items-center gap-2 border border-slate-600 rounded hover:bg-slate-800 whitespace-nowrap px-2 py-1 md:px-3 md:py-2 ${
                  (statusFilter || sourceFilter) ? 'bg-slate-700 border-slate-500' : ''
                }`}
              >
                <Filter size={14} />
                <span>Filter</span>
                {(statusFilter || sourceFilter) && (
                  <span className="bg-slate-600 text-xs px-1 rounded-full">
                    {[statusFilter, sourceFilter].filter(Boolean).length}
                  </span>
                )}
              </button>

              {isFilterDropdownOpen && (
                <div
                  className="
                    absolute right-0 mt-2 w-64 sm:w-56
                    bg-slate-800 border border-slate-600 rounded shadow-lg z-50
                    p-3
                  "
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-white text-sm font-medium">Filters</h3>
                    <button onClick={clearFilters} className="text-slate-400 text-xs hover:text-white">
                      Clear All
                    </button>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-white text-sm font-medium mb-2">Status</h4>
                    <div className="space-y-1">
                      {['New', 'Nurturing', 'Qualified', 'Lost', 'Contacted'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleFilterChange('status', status)}
                          className={`w-full text-left text-sm px-2 py-1 rounded flex justify-between items-center ${
                            statusFilter === status ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>{status}</span>
                          {statusFilter === status && <span>✅</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white text-sm font-medium mb-2">Source</h4>
                    <div className="space-y-1">
                      {['Referral', 'SocialMedia', 'Website', 'Zillow', 'Other'].map((source) => (
                        <button
                          key={source}
                          onClick={() => handleFilterChange('source', source)}
                          className={`w-full text-left text-sm px-2 py-1 rounded ${
                            sourceFilter === source ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {source}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Export */}
            <button className="text-slate-400 text-sm flex items-center gap-2 border border-slate-600 rounded hover:bg-slate-800 whitespace-nowrap px-2 py-1 md:px-3 md:py-2">
              <Download size={14} />
              <span>Export</span>
            </button>

            {/* Search Leads */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={handleSearchChange}
                className={`bg-slate-900 text-white text-sm rounded py-2 pl-9 pr-3 border border-slate-600 focus:outline-none focus:border-slate-500 ${
                  isMobile ? 'w-full' : 'w-60'
                }`}
              />
            </div>
          </div>
        </div>


        {loading ? (
          <div className="text-center text-slate-400 py-8">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="text-center text-slate-400 py-8">No leads found.</div>
        ) : isMobile ? (
          // mobile cards remain unchanged
          <div className="space-y-3">
            <div className="overflow-x-auto w-full">
    <table className="min-w-[700px] w-full">
      <thead>
        <tr className="text-left text-slate-500 text-sm border-b border-slate-700">
          <th className="pb-3 pr-4 hidden sm:table-cell">
            <input type="checkbox" className="rounded border-slate-600 bg-slate-700" />
          </th>

          <th
            className="pb-3 pr-4 cursor-pointer hover:text-slate-300 select-none"
            onClick={() => toggleSort('name')}
            title="Sort by Name"
          >
            <div className="flex items-center space-x-1">
              <span className={sortBy === 'name' ? 'text-white' : ''}>Name</span>
              <ChevronDown
                size={14}
                className={`transition-transform ${
                  sortBy === 'name' ? (sortDir === 'asc' ? 'rotate-180' : '') : 'opacity-40'
                }`}
              />
            </div>
          </th>

          <th className="pb-3 pr-4">Email</th>

          <th className="pb-3 pr-4">
            <div className="flex items-center space-x-1">
              <span>Phone</span>
            </div>
          </th>

          <th
            className="pb-3 pr-4 cursor-pointer hover:text-slate-300 select-none"
            onClick={() => toggleSort('status')}
            title="Sort by Status"
          >
            <div className="flex items-center space-x-1">
              <span className={sortBy === 'status' ? 'text-white' : ''}>Status</span>
              <ChevronDown
                size={14}
                className={`transition-transform ${
                  sortBy === 'status' ? (sortDir === 'asc' ? 'rotate-180' : '') : 'opacity-40'
                }`}
              />
            </div>
          </th>

          <th
            className="pb-3 pr-4 cursor-pointer hover:text-slate-300 select-none"
            onClick={() => toggleSort('source')}
            title="Sort by Source"
          >
            <div className="flex items-center space-x-1">
              <span className={sortBy === 'source' ? 'text-white' : ''}>Source</span>
              <ChevronDown
                size={14}
                className={`transition-transform ${
                  sortBy === 'source' ? (sortDir === 'asc' ? 'rotate-180' : '') : 'opacity-40'
                }`}
              />
            </div>
          </th>

          {/* ADDED: Email Stage Column */}
          <th
            className="pb-3 pr-4 cursor-pointer hover:text-slate-300 select-none"
            onClick={() => toggleSort('email_stage')}
            title="Sort by Email Stage"
          >
            <div className="flex items-center space-x-1">
              <span className={sortBy === 'email_stage' ? 'text-white' : ''}>Email Stage</span>
              <ChevronDown
                size={14}
                className={`transition-transform ${
                  sortBy === 'email_stage' ? (sortDir === 'asc' ? 'rotate-180' : '') : 'opacity-40'
                }`}
              />
            </div>
          </th>


          <th className="pb-3 pr-4 hidden sm:table-cell">Last Contact</th>

          <th className="pb-3">Actions</th>
        </tr>
      </thead>

        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead.id}
              className="border-b border-slate-700 hover:bg-slate-700 transition-colors"
            >
              <td className="py-3 pr-4 hidden sm:table-cell">{/* checkbox if needed */}</td>

              <td className="py-3 pr-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs text-white">
                    {lead.first_name[0]}
                    {lead.last_name[0]}
                  </div>
                  <div>
                    <div className="text-white text-sm">
                      {lead.first_name} {lead.last_name}
                    </div>
                    <div className="text-slate-500 text-xs">{lead.type}</div>
                  </div>
                </div>
              </td>

              <td className="py-3 pr-4 text-slate-400 text-sm">{lead.email}</td>

              <td className="py-3 pr-4 text-slate-400 text-sm">{formatPhoneNumber(lead.phone_number)}</td>

              <td className="py-3 pr-4">
                <span className="px-2 py-1 rounded text-xs border border-slate-500 text-slate-300 bg-slate-700">
                  {lead.status}
                </span>
              </td>

              <td className="py-3 pr-4 text-slate-400 text-sm">
                {lead.source}
              </td>

              {/* ADDED: Display Email Stage */}
              <td className="py-3 pr-4 text-slate-400 text-sm">
                {lead.email_stage}
              </td>

              <td className="py-3 pr-4 text-slate-400 text-sm hidden sm:table-cell">
                {new Date(lead.created_at).toLocaleDateString()}
              </td>

              <td className="py-3">
                <button className="text-slate-400 hover:text-white">
                  <MoreHorizontal size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-slate-500 text-sm border-b border-slate-700">
                  <th className="pb-3 pr-4">
                    <input type="checkbox" className="rounded border-slate-600 bg-slate-700" />
                  </th>

                  {/* Add sorting handlers & icons here */}

                  <th
                    className="pb-3 pr-4 cursor-pointer hover:text-slate-300 select-none"
                    onClick={() => toggleSort('name')}
                    title="Sort by Name"
                  >
                    <div className="flex items-center space-x-1">
                      <span className={sortBy === 'name' ? 'text-white' : ''}>Name</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${
                          sortBy === 'name' ? (sortDir === 'asc' ? 'rotate-180' : '') : 'opacity-40'
                        }`}
                      />
                    </div>
                  </th>

                  <th className="pb-3 pr-4 cursor-pointer hover:text-slate-300">
                    <div className="flex items-center space-x-1">
                      <span>Email</span>
                      {/* <ChevronDown size={14} className="opacity-40" /> */}
                    </div>
                  </th>

                  {!isTablet && <th className="pb-3 pr-4">Phone</th>}

                  <th
                    className="pb-3 pr-4 cursor-pointer hover:text-slate-300 select-none"
                    onClick={() => toggleSort('status')}
                    title="Sort by Status"
                  >
                    <div className="flex items-center space-x-1">
                      <span className={sortBy === 'status' ? 'text-white' : ''}>Status</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${
                          sortBy === 'status' ? (sortDir === 'asc' ? 'rotate-180' : '') : 'opacity-40'
                        }`}
                      />
                    </div>
                  </th>

                  {!isTablet && (
                    <th
                      className="pb-3 pr-4 cursor-pointer hover:text-slate-300 select-none"
                      onClick={() => toggleSort('source')}
                      title="Sort by Source"
                    >
                      <div className="flex items-center space-x-1">
                        <span className={sortBy === 'source' ? 'text-white' : ''}>Source</span>
                        <ChevronDown
                          size={14}
                          className={`transition-transform ${
                            sortBy === 'source' ? (sortDir === 'asc' ? 'rotate-180' : '') : 'opacity-40'
                          }`}
                        />
                      </div>
                    </th>
                  )}

                  {/* ADDED: Email Stage Header */}
                  {!isTablet && (
                    <th
                      className="pb-3 pr-4 cursor-pointer hover:text-slate-300 select-none"
                      onClick={() => toggleSort('email_stage')}
                      title="Sort by Email Stage"
                    >
                      <div className="flex items-center space-x-1">
                        <span className={sortBy === 'email_stage' ? 'text-white' : ''}>Email Stage</span>
                        <ChevronDown
                          size={14}
                          className={`transition-transform ${
                            sortBy === 'email_stage' ? (sortDir === 'asc' ? 'rotate-180' : '') : 'opacity-40'
                          }`}
                        />
                      </div>
                    </th>
                  )}


                  {!isTablet && <th className="pb-3 pr-4">Last Contact</th>}
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead.id} className="border-b border-slate-700 hover:bg-slate-700 transition-colors">
                    <td className="py-3 pr-4">{/* checkbox removed as per your code */}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs text-white">
                          {lead.first_name[0]}
                          {lead.last_name[0]}
                        </div>
                        <div>
                          <div className="text-white text-sm">{lead.first_name} {lead.last_name}</div>
                          <div className="text-slate-500 text-xs">{lead.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-slate-400 text-sm">{lead.email}</td>
                    {!isTablet && <td className="py-3 pr-4 text-slate-400 text-sm">{formatPhoneNumber(lead.phone_number)}</td>}
                    <td className="py-3 pr-4">
                      <span className="px-2 py-1 rounded text-xs border border-slate-500 text-slate-300 bg-slate-700">
                        {lead.status}
                      </span>
                    </td>
                    {!isTablet && <td className="py-3 pr-4 text-slate-400 text-sm">{lead.source}</td>}
                    {/* ADDED: Display Email Stage */}
                    {!isTablet && (
                      <td className="py-3 pr-4 text-slate-400 text-sm">
                        {lead.email_stage}
                      </td>
                    )}

                    {!isTablet && <td className="py-3 pr-4 text-slate-400 text-sm">{new Date(lead.created_at).toLocaleDateString()}</td>}
                    <td className="py-3">
                      <button className="text-slate-400 hover:text-white">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4 text-sm text-slate-500 space-y-2 md:space-y-0">
          <div>
            {/* Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalLeads)} of {totalLeads} results */}
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalLeads)} of {totalLeads} results
          </div>
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded border border-slate-600 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &lt;
            </button>
            {renderPaginationButtons()}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded border border-slate-600 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &gt;
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-500">
          <span>Show: </span>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="bg-slate-900 border border-slate-600 rounded text-white px-2 py-1"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={150}>150</option>
            {/* <option value={184}>184</option> */}
            <option value={200}>200</option>
          </select>
          <span>entries</span>
        </div>

      </div>

      {showConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <div className="bg-slate-800 rounded p-6 max-w-sm w-full text-white">
            <h3 className="text-lg font-semibold mb-4">Save Filtered Leads List</h3>
            <label className="block mb-2 text-sm font-medium" htmlFor="listNameInput">
              Name of the list:
            </label>
            <input
              id="listNameInput"
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              className="w-full mb-4 px-3 py-2 rounded text-white border bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter list name"
              autoFocus
              required
            />

            <p className="mb-6">Are you sure you want to save this filtered leads list?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelSave}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={doSaveFilteredLeads}
                disabled={!listName.trim()}
                className={`px-4 py-2 rounded hover:bg-green-700 ${
                  listName.trim() ? 'bg-green-600' : 'bg-green-900 cursor-not-allowed'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LeadPage;