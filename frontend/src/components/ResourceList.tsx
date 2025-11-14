"use client";

import React, { useState } from "react";

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  type: "Article" | "Video" | "Course" | "Tool" | "Guide";
  url: string;
  duration?: string;
  author?: string;
}

const mockResources: Resource[] = [
  {
    id: "1",
    title: "Introduction to Community Organizing",
    description: "Learn the fundamentals of bringing people together for social change.",
    category: "Community Building",
    difficulty: "Beginner",
    type: "Course",
    url: "#",
    duration: "2 hours",
    author: "Social Impact Institute",
  },
  {
    id: "2",
    title: "Effective Issue Mapping Techniques",
    description: "Master the art of identifying and prioritizing community issues.",
    category: "Problem Solving",
    difficulty: "Intermediate",
    type: "Guide",
    url: "#",
    duration: "45 min",
    author: "Urban Planning Association",
  },
  {
    id: "3",
    title: "Grant Writing for Social Projects",
    description: "Secure funding for your community initiatives with proven strategies.",
    category: "Fundraising",
    difficulty: "Advanced",
    type: "Course",
    url: "#",
    duration: "4 hours",
    author: "Nonprofit Academy",
  },
  {
    id: "4",
    title: "Digital Tools for Community Engagement",
    description: "Leverage technology to amplify your social impact.",
    category: "Technology",
    difficulty: "Beginner",
    type: "Tool",
    url: "#",
    duration: "1 hour",
    author: "TechForGood",
  },
  {
    id: "5",
    title: "Building Sustainable Partnerships",
    description: "Create lasting collaborations with organizations and stakeholders.",
    category: "Partnerships",
    difficulty: "Intermediate",
    type: "Article",
    url: "#",
    duration: "20 min",
    author: "Collaboration Network",
  },
  {
    id: "6",
    title: "Impact Measurement & Evaluation",
    description: "Track and communicate the results of your social initiatives.",
    category: "Impact",
    difficulty: "Advanced",
    type: "Course",
    url: "#",
    duration: "3 hours",
    author: "Impact Metrics Lab",
  },
  {
    id: "7",
    title: "Volunteer Recruitment Best Practices",
    description: "Attract and retain passionate volunteers for your cause.",
    category: "Community Building",
    difficulty: "Beginner",
    type: "Guide",
    url: "#",
    duration: "30 min",
    author: "Volunteer Hub",
  },
  {
    id: "8",
    title: "Crisis Response Planning",
    description: "Prepare your community for emergencies and rapid response.",
    category: "Problem Solving",
    difficulty: "Advanced",
    type: "Course",
    url: "#",
    duration: "5 hours",
    author: "Emergency Management Institute",
  },
];

const categories = ["All", "Community Building", "Problem Solving", "Fundraising", "Technology", "Partnerships", "Impact"];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];
const types = ["All", "Article", "Video", "Course", "Tool", "Guide"];

export default function ResourceList() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = mockResources.filter((resource) => {
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All" || resource.difficulty === selectedDifficulty;
    const matchesType = selectedType === "All" || resource.type === selectedType;
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesDifficulty && matchesType && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/20 text-green-400";
      case "Intermediate":
        return "bg-yellow-500/20 text-yellow-400";
      case "Advanced":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-zinc-500/20 text-zinc-400";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Article":
        return "📄";
      case "Video":
        return "🎥";
      case "Course":
        return "📚";
      case "Tool":
        return "🛠️";
      case "Guide":
        return "📖";
      default:
        return "📌";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="rounded-lg bg-white/3 p-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="🔍 Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-zinc-400">
          <span>
            Showing {filteredResources.length} of {mockResources.length} resources
          </span>
          {(selectedCategory !== "All" || selectedDifficulty !== "All" || selectedType !== "All" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedDifficulty("All");
                setSelectedType("All");
                setSearchQuery("");
              }}
              className="text-cyan-400 hover:text-cyan-300"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <p className="text-zinc-400">No resources found matching your filters.</p>
          </div>
        ) : (
          filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="rounded-lg bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-all hover:border-cyan-500/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getTypeIcon(resource.type)}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-zinc-300">{resource.type}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(resource.difficulty)}`}>
                  {resource.difficulty}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-zinc-100 mb-2">{resource.title}</h3>
              <p className="text-sm text-zinc-400 mb-4">{resource.description}</p>

              <div className="flex items-center justify-between">
                <div className="text-xs text-zinc-500">
                  <div className="mb-1">📂 {resource.category}</div>
                  {resource.duration && <div>⏱️ {resource.duration}</div>}
                </div>
                <a
                  href={resource.url}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium hover:from-cyan-600 hover:to-blue-600 transition-all"
                >
                  View →
                </a>
              </div>

              {resource.author && (
                <div className="mt-3 pt-3 border-t border-white/10 text-xs text-zinc-500">
                  By {resource.author}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
