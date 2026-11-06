'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  Plus,
  Bookmark,
  MapPin,
  Briefcase,
  Clock,
  ArrowRight,
  ChevronRight,
  Building,
  GraduationCap,
  TrendingUp,
  Users,
  CheckCircle2,
  X,
  Lock,
  Check,
  Layers,
  Zap,
  Info,
} from 'lucide-react';
import { careerhub } from '@/Api_actions/action';
import { authClient } from '@/lib/auth-client';

export default function CareerHub() {
  const { data: session } = authClient.useSession();

  // State for raw data from database
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search input
  const [searchTerm, setSearchTerm] = useState('');
  // Top pill button
  const [activeCategory, setActiveCategory] = useState('All');
  // Sidebar filters
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedWorkplace, setSelectedWorkplace] = useState([]);
  const [onlyFastTrack, setOnlyFastTrack] = useState(false);
  const [minSalary, setMinSalary] = useState(0);
  const [sortBy, setSortBy] = useState('Newest First');
  const [viewMode, setViewMode] = useState('list');
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  // Mobile filters toggle
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Post Opportunity Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [actionSuccessNotice, setActionSuccessNotice] = useState(null);

  // Fetch 30 JSON data directly from API
  useEffect(() => {
    let isMounted = true;
    const loadCareerHub = async () => {
      try {
        const data = await careerhub();
        if (isMounted) {
          setOpportunities(Array.isArray(data) ? data : []);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch career hub data:', err);
        if (isMounted) {
          setOpportunities([]);
          setIsLoading(false);
        }
      }
    };
    loadCareerHub();
    return () => {
      isMounted = false;
    };
  }, []);

  // Derived filter options directly from the 30 data items
  const facultyOptions = useMemo(() => {
    const set = new Set();
    opportunities.forEach((item) => {
      (item.eligible_departments || []).forEach((d) => set.add(d));
    });
    return Array.from(set).sort();
  }, [opportunities]);

  const jobTypeOptions = useMemo(() => {
    const counts = {};
    opportunities.forEach((item) => {
      const type = item.job_type || 'Other';
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [opportunities]);

  const experienceOptions = useMemo(() => {
    const set = new Set();
    opportunities.forEach((item) => {
      if (item.experience_level) set.add(item.experience_level);
    });
    return Array.from(set).sort();
  }, [opportunities]);

  const locationOptions = useMemo(() => {
    const set = new Set();
    opportunities.forEach((item) => {
      if (item.location) set.add(item.location);
    });
    return Array.from(set).sort();
  }, [opportunities]);

  // Top Alumni Referral Spotlights - picks top 3 featured/fast-track items
  const spotlightOpportunities = useMemo(() => {
    const featured = opportunities.filter(
      (item) => item.is_featured || item.has_fast_track_referral
    );
    return featured.length > 0 ? featured.slice(0, 3) : opportunities.slice(0, 3);
  }, [opportunities]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedTypes.length > 0) count += selectedTypes.length;
    if (selectedFaculty.length > 0) count += selectedFaculty.length;
    if (selectedExperience.length > 0) count += selectedExperience.length;
    if (selectedLocations.length > 0) count += selectedLocations.length;
    if (selectedWorkplace.length > 0) count += selectedWorkplace.length;
    if (onlyFastTrack) count += 1;
    if (minSalary > 0) count += 1;
    return count;
  }, [
    selectedTypes,
    selectedFaculty,
    selectedExperience,
    selectedLocations,
    selectedWorkplace,
    onlyFastTrack,
    minSalary,
  ]);

  // Toggle helper
  const toggleArrayItem = (setter, currentList, item) => {
    if (currentList.includes(item)) {
      setter(currentList.filter((i) => i !== item));
    } else {
      setter([...currentList, item]);
    }
  };

  // Reset all filters so everything shows
  const resetAllFilters = () => {
    setSearchTerm('');
    setActiveCategory('All');
    setSelectedTypes([]);
    setSelectedFaculty([]);
    setSelectedExperience([]);
    setSelectedLocations([]);
    setSelectedWorkplace([]);
    setOnlyFastTrack(false);
    setMinSalary(0);
    setSortBy('Newest First');
    setCurrentPage(1);
  };

  const toggleBookmark = (e, id) => {
    e.stopPropagation();
    if (!session?.user) {
      setIsAuthModalOpen(true);
      return;
    }
    toggleArrayItem(setBookmarkedIds, bookmarkedIds, id);
  };

  // Dynamic Filtering Logic
  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter((item) => {
        // 1. Search Query
        if (searchTerm.trim() !== '') {
          const query = searchTerm.toLowerCase();
          const matchesTitle = item.title?.toLowerCase().includes(query);
          const matchesCompany = (item.company_name || item.company?.name)
            ?.toLowerCase()
            .includes(query);
          const matchesSkills = item.tags?.some((tag) =>
            tag.toLowerCase().includes(query)
          );
          const matchesLocation = item.location?.toLowerCase().includes(query);
          const matchesDept = item.department?.toLowerCase().includes(query);
          if (
            !matchesTitle &&
            !matchesCompany &&
            !matchesSkills &&
            !matchesLocation &&
            !matchesDept
          ) {
            return false;
          }
        }

        // 2. Category Pill
        if (activeCategory === 'Alumni Direct Referrals') {
          if (!item.has_fast_track_referral && !item.alumni_referrer) return false;
        } else if (activeCategory === 'Full-Time Jobs') {
          if (item.job_type !== 'Full-Time') return false;
        } else if (activeCategory === 'Internships') {
          if (
            !item.job_type?.toLowerCase().includes('intern') &&
            !item.title?.toLowerCase().includes('intern')
          )
            return false;
        } else if (activeCategory === 'Contractual') {
          if (item.job_type !== 'Contractual') return false;
        }

        // 3. Opportunity Types
        if (selectedTypes.length > 0) {
          if (!selectedTypes.includes(item.job_type)) return false;
        }

        // 4. Faculty / Departments
        if (selectedFaculty.length > 0) {
          const hasFaculty = (item.eligible_departments || []).some((dept) =>
            selectedFaculty.includes(dept)
          );
          if (!hasFaculty) return false;
        }

        // 5. Experience
        if (selectedExperience.length > 0) {
          if (!selectedExperience.includes(item.experience_level)) return false;
        }

        // 6. Location
        if (selectedLocations.length > 0) {
          if (!selectedLocations.includes(item.location)) return false;
        }

        // 7. Workplace Type
        if (selectedWorkplace.length > 0) {
          if (!selectedWorkplace.includes(item.workplace_type)) return false;
        }

        // 8. Fast-Track Referral only
        if (onlyFastTrack) {
          if (!item.has_fast_track_referral) return false;
        }

        // 9. Minimum Salary
        if (minSalary > 0) {
          const itemMin = item.salary?.min || 0;
          if (itemMin > 0 && itemMin < minSalary) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'Salary: High to Low') {
          return (b.salary?.min || 0) - (a.salary?.min || 0);
        }
        if (sortBy === 'Closing Date') {
          return new Date(a.deadline || 0) - new Date(b.deadline || 0);
        }
        // Newest First (default)
        return new Date(b.posted_at || 0) - new Date(a.posted_at || 0);
      });
  }, [
    opportunities,
    searchTerm,
    activeCategory,
    selectedTypes,
    selectedFaculty,
    selectedExperience,
    selectedLocations,
    selectedWorkplace,
    onlyFastTrack,
    minSalary,
    sortBy,
  ]);

  // Paginated items
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const paginatedOpportunities = useMemo(() => {
    const start = (safeCurrentPage - 1) * itemsPerPage;
    return filteredOpportunities.slice(start, start + itemsPerPage);
  }, [filteredOpportunities, safeCurrentPage, itemsPerPage]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-24 font-sans selection:bg-teal-100 selection:text-teal-900">

      {/* ────────────────────────────────────────────────────────
          TOP HERO & BANNER SECTION
      ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-[#F8FAFC] pt-8 pb-10 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-4">
            <Link href="/" className="hover:text-teal-600 transition-colors flex items-center gap-1">
              <span>Home</span>
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Career Hub & Opportunities</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
            <div className="max-w-3xl">
              {/* Verified Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-3">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600"></span>
                </span>
                <span>IIUC TALENT & OPPORTUNITY EXCHANGE • VERIFIED CAMPUS PIPELINE</span>
              </div>

              {/* Headline */}
              <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0B1527] leading-[1.2] tracking-tight">
                Propel Your Future with Exclusive{' '}
                <span className="text-[#0D3B66]">Alumni Referrals</span> & Global Opportunities
              </h1>

              {/* Subtitle */}
              <p className="mt-3 text-slate-600 text-xs sm:text-base leading-relaxed max-w-2xl">
                Explore verified full-time jobs, paid summer internships, higher study scholarships,
                and funded research assistantships shared directly by IIUC alumni and global partner
                enterprises.
              </p>
            </div>

            {/* Post Opportunity Button */}
            <div className="flex flex-col items-start lg:items-end gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (!session?.user) {
                    setIsAuthModalOpen(true);
                  } else {
                    setIsPostModalOpen(true);
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#004D40] hover:bg-[#00382E] text-white font-semibold text-xs sm:text-sm shadow-md shadow-teal-950/10 hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Post an Opportunity</span>
              </button>
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Free for verified Alumni & Faculty
              </span>
            </div>
          </div>

          {/* Search Bar & Filters Trigger */}
          <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200/90 shadow-sm shadow-slate-100 flex flex-col md:flex-row items-stretch md:items-center gap-2.5 mb-5">
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by role, company, department, tech stack (e.g. React, Python, Cloud)..."
                className="w-full pl-11 pr-12 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50/70 border border-transparent focus:bg-white focus:border-teal-500 focus:outline-none transition-all placeholder:text-slate-400"
              />
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 rounded border border-slate-200 absolute right-3">
                ⌘K
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-teal-700" />
                <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('filter-pipeline-sidebar');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hidden lg:inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
              </button>

              <button
                type="button"
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0B1E3D] hover:bg-[#071327] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer"
              >
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Category Horizontal Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'All', label: `All Opportunities (${opportunities.length})` },
              { id: 'Full-Time Jobs', label: 'Full-Time Jobs' },
              { id: 'Internships', label: 'Internships' },
              { id: 'Contractual', label: 'Contractual' },
              { id: 'Alumni Direct Referrals', label: 'Alumni Direct Referrals', isTeal: true },
            ].map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#0B1E3D] text-white shadow-sm'
                      : cat.isTeal
                      ? 'bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100'
                      : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* 4 Key Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-3.5 mt-8">
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-lg sm:text-xl font-bold text-[#0B1E3D] truncate">
                  {opportunities.length}+
                </h4>
                <p className="text-xs font-semibold text-slate-800 truncate">
                  Verified Opportunities
                </p>
                <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                  Database pipeline active
                </p>
              </div>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 flex-shrink-0">
                <Building className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-lg sm:text-xl font-bold text-[#0B1E3D] truncate">420+</h4>
                <p className="text-xs font-semibold text-slate-800 truncate">
                  Global Hiring Partners
                </p>
                <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                  Brain Station, Chaldal, bKash
                </p>
              </div>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700 flex-shrink-0">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-lg sm:text-xl font-bold text-[#0B1E3D] truncate">16</h4>
                <p className="text-xs font-semibold text-slate-800 truncate">IIUC Faculties</p>
                <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                  CSE, EEE, BBA, Law, Pharmacy
                </p>
              </div>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 flex-shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-lg sm:text-xl font-bold text-[#0B1E3D] truncate">84%</h4>
                <p className="text-xs font-semibold text-slate-800 truncate">
                  Fast-Track Screening
                </p>
                <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                  Direct Alumni Endorsement
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          TOP ALUMNI REFERRAL SPOTLIGHTS (FROM FETCHED DATA)
      ──────────────────────────────────────────────────────── */}
      {spotlightOpportunities.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Top Alumni Referral Spotlights
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Applications reviewed directly by verified IIUC seniors holding engineering & leadership seats.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveCategory('Alumni Direct Referrals')}
              className="text-xs font-bold text-[#004D40] hover:text-[#00382E] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View all referrals</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Spotlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {spotlightOpportunities.map((spot, idx) => {
              const compName = spot.company_name || spot.company?.name || 'Company';
              const referrer = spot.alumni_referrer || {};

              return (
                <motion.div
                  key={spot._id || idx}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between relative hover:shadow-md transition-shadow"
                >
                  <div>
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-base font-extrabold text-slate-900 tracking-tight">
                        {compName}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                        {spot.has_fast_track_referral ? 'Fast-Track Referral' : 'Direct Hiring Review'}
                      </span>
                    </div>

                    {/* Title & subtitle */}
                    <Link
                      href={`/career-hub/${spot._id}`}
                      className="text-sm font-bold text-[#0B1E3D] hover:text-teal-700 leading-snug mb-1 line-clamp-2 transition-colors block"
                    >
                      {spot.title}
                    </Link>
                    <p className="text-[11px] text-slate-500 mb-4">
                      {compName} • {spot.location}
                    </p>

                    {/* Referrer Alumnus Mini Card */}
                    <div className="bg-slate-50/80 rounded-xl p-2.5 flex items-center gap-2.5 border border-slate-100 mb-4">
                      {referrer.avatar_url ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 relative">
                          <Image
                            src={referrer.avatar_url}
                            alt={referrer.name || 'Alumnus'}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {referrer.name ? referrer.name.substring(0, 2).toUpperCase() : 'IU'}
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-800 leading-none truncate">
                          {referrer.name || 'IIUC Senior Alumnus'}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate mt-1">
                          {referrer.batch || referrer.title || 'Verified Mentor'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Info + Single "View Details" Action Button */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {spot.workplace_type || 'Full-Time'}
                    </span>
                    <Link
                      href={`/career-hub/${spot._id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-[#004D40] hover:bg-[#00382E] text-white shadow-xs transition-all"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* ────────────────────────────────────────────────────────
          MAIN BODY: SPLIT LAYOUT (SIDEBAR FILTER + OPPORTUNITIES LIST)
      ──────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* ──────────────────────────────────────────
              LEFT SIDEBAR: FILTER PIPELINE
              Uses static on mobile and sticky on desktop to prevent overlaps!
          ────────────────────────────────────────── */}
          <aside
            id="filter-pipeline-sidebar"
            className={`lg:col-span-4 xl:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs static lg:sticky lg:top-24 ${
              mobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Filter Pipeline
                </h3>
              </div>
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900 transition-colors cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* 1. Opportunity Type */}
            {jobTypeOptions.length > 0 && (
              <div className="mb-6">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Opportunity Type
                </h4>
                <div className="space-y-2">
                  {jobTypeOptions.map((opt) => {
                    const isChecked = selectedTypes.includes(opt.name);
                    return (
                      <label
                        key={opt.name}
                        onClick={() => toggleArrayItem(setSelectedTypes, selectedTypes, opt.name)}
                        className="flex items-center justify-between text-xs text-slate-700 cursor-pointer select-none hover:text-slate-900 group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                              isChecked
                                ? 'bg-[#0B1E3D] border-[#0B1E3D] text-white'
                                : 'border-slate-300 bg-white group-hover:border-slate-400'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className={isChecked ? 'font-semibold text-slate-900' : ''}>
                            {opt.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">{opt.count}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Faculty / Department Eligibility */}
            {facultyOptions.length > 0 && (
              <div className="mb-6">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Faculty Eligibility
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {facultyOptions.map((fac) => {
                    const isActive = selectedFaculty.includes(fac);
                    return (
                      <button
                        key={fac}
                        type="button"
                        onClick={() => toggleArrayItem(setSelectedFaculty, selectedFaculty, fac)}
                        className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#0B1E3D] text-white font-semibold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                        }`}
                      >
                        {fac}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Experience Level */}
            {experienceOptions.length > 0 && (
              <div className="mb-6">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Experience Level
                </h4>
                <div className="space-y-2">
                  {experienceOptions.map((exp) => {
                    const isChecked = selectedExperience.includes(exp);
                    return (
                      <label
                        key={exp}
                        onClick={() => toggleArrayItem(setSelectedExperience, selectedExperience, exp)}
                        className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none hover:text-slate-900 group"
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-[#0B1E3D] border-[#0B1E3D] text-white'
                              : 'border-slate-300 bg-white group-hover:border-slate-400'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={isChecked ? 'font-semibold text-slate-900' : ''}>
                          {exp}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Location / City */}
            {locationOptions.length > 0 && (
              <div className="mb-6">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Location / Region
                </h4>
                <div className="space-y-2">
                  {locationOptions.map((loc) => {
                    const isChecked = selectedLocations.includes(loc);
                    return (
                      <label
                        key={loc}
                        onClick={() => toggleArrayItem(setSelectedLocations, selectedLocations, loc)}
                        className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none hover:text-slate-900 group"
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-[#0B1E3D] border-[#0B1E3D] text-white'
                              : 'border-slate-300 bg-white group-hover:border-slate-400'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={isChecked ? 'font-semibold text-slate-900' : ''}>
                          {loc}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. Workplace Mode */}
            <div className="mb-6">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                Workplace Mode
              </h4>
              <div className="space-y-2">
                {['Hybrid', 'On-site', 'Remote'].map((mode) => {
                  const isChecked = selectedWorkplace.includes(mode);
                  return (
                    <label
                      key={mode}
                      onClick={() => toggleArrayItem(setSelectedWorkplace, selectedWorkplace, mode)}
                      className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none hover:text-slate-900 group"
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isChecked
                            ? 'bg-[#0B1E3D] border-[#0B1E3D] text-white'
                            : 'border-slate-300 bg-white group-hover:border-slate-400'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={isChecked ? 'font-semibold text-slate-900' : ''}>
                        {mode}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 6. Fast Track Referral Only */}
            <div className="mb-6 pt-3 border-t border-slate-100">
              <label
                onClick={() => setOnlyFastTrack(!onlyFastTrack)}
                className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none hover:text-slate-900 group"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    onlyFastTrack
                      ? 'bg-teal-700 border-teal-700 text-white'
                      : 'border-slate-300 bg-white group-hover:border-slate-400'
                  }`}
                >
                  {onlyFastTrack && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className={onlyFastTrack ? 'font-bold text-teal-800' : 'font-medium'}>
                  Alumni Referral Fast-Track Only
                </span>
              </label>
            </div>

            {/* 7. Salary / Stipend Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Min Salary / Stipend
                </h4>
                <span className="text-xs font-bold text-teal-700">
                  {minSalary > 0 ? `৳${(minSalary / 1000).toFixed(0)}K+` : 'All Ranges'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="120000"
                step="10000"
                value={minSalary}
                onChange={(e) => setMinSalary(Number(e.target.value))}
                className="w-full accent-teal-700 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                <span>৳0</span>
                <span>৳50K/MO</span>
                <span>৳120K+</span>
              </div>
            </div>
          </aside>

          {/* ──────────────────────────────────────────
              RIGHT CONTENT: OPPORTUNITIES LIST
          ────────────────────────────────────────── */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-4 min-w-0">

            {/* Header: Showing X of Y + Sort + View switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="text-xs text-slate-600 font-medium">
                Showing{' '}
                <strong className="text-slate-900 font-bold">
                  {filteredOpportunities.length > 0 ? (safeCurrentPage - 1) * itemsPerPage + 1 : 0} -{' '}
                  {Math.min(safeCurrentPage * itemsPerPage, filteredOpportunities.length)}
                </strong>{' '}
                of <strong className="text-slate-900 font-bold">{filteredOpportunities.length}</strong>{' '}
                opportunities
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                {/* Sort selector */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span>SORT BY:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-600 cursor-pointer"
                  >
                    <option>Newest First</option>
                    <option>Salary: High to Low</option>
                    <option>Closing Date</option>
                  </select>
                </div>

                {/* View toggles */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-1 rounded cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="List View"
                  >
                    <Layers className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1 rounded cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="Grid View"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Opportunities List */}
            {isLoading ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-semibold text-slate-500">
                  Connecting to IIUC Career Hub database...
                </p>
              </div>
            ) : filteredOpportunities.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <Info className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">
                  No opportunities match your filter combination
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try clearing some filter criteria or search for broader keywords.
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="mt-4 px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Clear All Filters (Show All {opportunities.length})
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
                <AnimatePresence mode="popLayout">
                  {paginatedOpportunities.map((item, idx) => {
                    const id = item._id || idx;
                    const isBookmarked = bookmarkedIds.includes(id);
                    const compName = item.company_name || item.company?.name || 'Company';
                    const referrer = item.alumni_referrer;

                    return (
                      <motion.div
                        key={id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.25, delay: idx * 0.03 }}
                        className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all relative flex flex-col justify-between"
                      >
                        {/* Top row: Company Logo + Badges + Bookmark */}
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-2.5">
                            <div className="flex items-center gap-3 min-w-0">
                              {/* Company Logo */}
                              {item.company?.logo_url ? (
                                <div className="w-10 h-10 rounded-xl border border-slate-200 overflow-hidden flex-shrink-0 relative bg-slate-50">
                                  <Image
                                    src={item.company.logo_url}
                                    alt={compName}
                                    fill
                                    unoptimized
                                    className="object-contain p-1"
                                  />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                  {compName.substring(0, 2).toUpperCase()}
                                </div>
                              )}

                              {/* Badges / Category row */}
                              <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                                {item.job_type && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border bg-blue-50 text-blue-700 border-blue-200">
                                    {item.job_type}
                                  </span>
                                )}
                                {item.has_fast_track_referral && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border bg-teal-50 text-teal-700 border-teal-200">
                                    Alumni Referral
                                  </span>
                                )}
                                {item.workplace_type && (
                                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md border bg-slate-50 text-slate-600 border-slate-200">
                                    {item.workplace_type}
                                  </span>
                                )}
                                {item.posted_date && (
                                  <span className="text-[11px] text-slate-400 font-medium ml-1 hidden sm:inline">
                                    • Posted {item.posted_date}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Bookmark icon */}
                            <button
                              type="button"
                              onClick={(e) => toggleBookmark(e, id)}
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer flex-shrink-0 ${
                                isBookmarked
                                  ? 'bg-amber-50 border-amber-200 text-amber-600'
                                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
                              }`}
                              title={isBookmarked ? 'Bookmarked' : 'Save opportunity'}
                            >
                              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                            </button>
                          </div>

                          {/* Role Title & Deadline */}
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                            <Link
                              href={`/career-hub/${item._id}`}
                              className="text-base font-bold text-[#0B1E3D] hover:text-teal-700 transition-colors leading-snug line-clamp-2"
                            >
                              {item.title}
                            </Link>
                            {item.deadline_date && (
                              <span className="text-[11px] font-semibold text-rose-600 flex-shrink-0 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Closing: {item.deadline_date}
                              </span>
                            )}
                          </div>

                          {/* Company + Location + Salary Row */}
                          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600 mb-3.5 font-medium">
                            <span className="font-bold text-slate-800 flex items-center gap-1">
                              <Building className="w-3.5 h-3.5 text-slate-400" />
                              {compName}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {item.location}
                            </span>
                            {item.salary_display && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                                  {item.salary_display}
                                </span>
                              </>
                            )}
                          </div>

                          {/* Skills & Tags Chips */}
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {item.tags.slice(0, 5).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60"
                                >
                                  {tag}
                                </span>
                              ))}
                              {item.eligible_departments?.map((dept) => (
                                <span
                                  key={dept}
                                  className="text-[11px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200/60"
                                >
                                  {dept} Dept.
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Bottom Row: Referrer + Single "View Details" Button */}
                        <div className="pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {referrer ? (
                            <div className="flex items-center gap-2.5 min-w-0">
                              {referrer.avatar_url ? (
                                <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 relative">
                                  <Image
                                    src={referrer.avatar_url}
                                    alt={referrer.name || 'Alumnus'}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                  {referrer.name ? referrer.name.substring(0, 2).toUpperCase() : 'IU'}
                                </div>
                              )}
                              <div className="text-left min-w-0">
                                <p className="text-xs font-bold text-slate-800 leading-tight truncate">
                                  {referrer.name}
                                  {referrer.batch && (
                                    <span className="text-[11px] font-normal text-slate-500">
                                      {' '}
                                      ({referrer.batch})
                                    </span>
                                  )}
                                </p>
                                <p className="text-[10px] text-slate-500 truncate max-w-xs">
                                  {referrer.title || 'Verified Alumni Referrer'}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Building className="w-3.5 h-3.5 text-slate-400" />
                              <span>Direct Employer Pipeline</span>
                            </div>
                          )}

                          {/* Action: Single "View Details" button */}
                          <div className="flex items-center self-end sm:self-auto pt-1 sm:pt-0">
                            <Link
                              href={`/career-hub/${item._id}`}
                              className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-[#0B1E3D] hover:bg-[#071327] text-white shadow-xs hover:shadow-md transition-all group"
                            >
                              <span>View Details</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                          </div>
                        </div>

                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-6 pb-2 text-xs text-slate-500 font-medium">
                <div>
                  Showing page <strong className="text-slate-800">{safeCurrentPage}</strong> of{' '}
                  <strong className="text-slate-800">{totalPages}</strong> pages
                </div>

                <div className="flex items-center gap-1 self-end sm:self-auto">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className={`px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white ${
                      currentPage === 1
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-slate-700 hover:bg-slate-50 cursor-pointer'
                    }`}
                  >
                    &lt; Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                        currentPage === page
                          ? 'bg-[#0B1E3D] text-white font-bold'
                          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className={`px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white ${
                      currentPage === totalPages
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-slate-700 hover:bg-slate-50 cursor-pointer'
                    }`}
                  >
                    Next &gt;
                  </button>
                </div>
              </div>
            )}

          </main>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          BOTTOM CTA BANNER (TEAL GRADIENT BANNER)
      ──────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#032030] via-[#00384D] to-[#044754] text-white p-8 sm:p-10 shadow-xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/60 border border-teal-700/50 text-[11px] font-bold text-teal-300 uppercase tracking-wider mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                <span>FOR IIUC ALUMNI RECRUITERS & GLOBAL FOUNDERS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                Looking to Hire Top-Tier Engineering, Business, or Research Talent?
              </h2>
              <p className="mt-2.5 text-teal-100/80 text-xs sm:text-sm leading-relaxed">
                Post an internship, career role, or fellowship to tap directly into 38,500+ bright
                current students and distinguished alumni across 16 faculties at International
                Islamic University Chittagong.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (!session?.user) {
                    setIsAuthModalOpen(true);
                  } else {
                    setIsPostModalOpen(true);
                  }
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-slate-700" />
                <span>Post a Free Job / Referral</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(
                    'Campus Recruitment Team Hotline: placement@iiuc.ac.bd | +880 1819-000000'
                  );
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0D3B66] hover:bg-[#092B4B] text-white text-xs sm:text-sm font-bold border border-teal-400/20 shadow-md transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 text-teal-300" />
                <span>Campus Recruitment Drive Info</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          SESSION REQUIRED GATE MODAL (If user clicks post without login)
      ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 z-10"
            >
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 stroke-[2.2]" />
              </div>

              <h3 className="text-xl font-extrabold text-slate-900">
                IIUC Session Required
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                To post verified opportunities or access exclusive alumni referral pipelines, you
                must be signed in with your IIUC Connect account.
              </p>

              <div className="mt-6 flex flex-col gap-2.5">
                <Link
                  href="/signIn"
                  className="w-full py-3 rounded-xl bg-[#0B1E3D] hover:bg-[#071327] text-white text-center text-xs font-bold shadow-md transition-all"
                >
                  Sign In to Continue
                </Link>
                <Link
                  href="/register"
                  className="w-full py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-center text-xs font-bold transition-all"
                >
                  Create Student or Alumni Account
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ────────────────────────────────────────────────────────
          POST AN OPPORTUNITY MODAL (FOR VERIFIED USERS)
      ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isPostModalOpen && session?.user && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPostModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 z-10"
            >
              <button
                type="button"
                onClick={() => setIsPostModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-extrabold text-slate-900 mb-1">
                Post an Opportunity / Referral
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Share a job, internship, or fellowship with IIUC students and alumni.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target;
                  const newOpp = {
                    _id: `user-${Date.now()}`,
                    title: form.roleTitle.value,
                    company_name: form.companyName.value,
                    company: { name: form.companyName.value },
                    job_type: form.opportunityType.value,
                    workplace_type: 'Hybrid',
                    location: form.jobLocation.value,
                    salary_display: form.salaryRange.value || 'Competitive Stipend',
                    salary: { min: 30000 },
                    posted_date: 'Just now',
                    posted_at: new Date().toISOString(),
                    has_fast_track_referral: true,
                    tags: ['IIUC Connect Community', 'Fast-Track'],
                    alumni_referrer: {
                      name: session.user.name || 'IIUC Alumnus',
                      title: 'Community Member',
                      batch: 'Verified Member',
                    },
                    role_overview: form.description.value,
                  };
                  setOpportunities([newOpp, ...opportunities]);
                  setIsPostModalOpen(false);
                  setActionSuccessNotice(
                    'Opportunity published successfully to IIUC Connect Career Hub!'
                  );
                  setTimeout(() => setActionSuccessNotice(null), 5000);
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Role / Fellowship Title
                  </label>
                  <input
                    required
                    name="roleTitle"
                    placeholder="e.g. Software Engineer (React / Node)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Company / Organization
                    </label>
                    <input
                      required
                      name="companyName"
                      placeholder="e.g. Brain Station 23, Chaldal"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Type</label>
                    <select
                      name="opportunityType"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600"
                    >
                      <option>Full-Time</option>
                      <option>Contractual</option>
                      <option>Internship</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Location</label>
                    <input
                      required
                      name="jobLocation"
                      placeholder="e.g. Dhaka, Bangladesh"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Salary / Stipend</label>
                    <input
                      name="salaryRange"
                      placeholder="e.g. ৳60,000 - ৳80,000 / month"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Brief Description & Referral Notes
                  </label>
                  <textarea
                    required
                    name="description"
                    rows={3}
                    placeholder="Mention any specific skills or if you offer direct employee referral..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPostModalOpen(false)}
                    className="px-4 py-2 border rounded-xl font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#004D40] hover:bg-[#00382E] text-white rounded-xl font-bold cursor-pointer"
                  >
                    Publish Opportunity
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Success Toast */}
      <AnimatePresence>
        {actionSuccessNotice && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-[#004D40] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-teal-500/40 text-xs font-semibold"
          >
            <CheckCircle2 className="w-5 h-5 text-teal-300" />
            <span>{actionSuccessNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
