import React from "react";
import ResourceList from "../../components/ResourceList";
import AIMentorWidget from "../../components/AIMentorWidget";

export default function KnowledgeLabPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Knowledge Lab
          </h1>
          <p className="text-lg text-zinc-300">
            Explore curated resources to amplify your social impact. Filter by category, difficulty, and type to find exactly what you need.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-4 border border-cyan-500/30">
            <div className="text-2xl mb-1">📚</div>
            <div className="text-2xl font-bold text-cyan-400">8</div>
            <div className="text-sm text-zinc-400">Total Resources</div>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4 border border-purple-500/30">
            <div className="text-2xl mb-1">🎓</div>
            <div className="text-2xl font-bold text-purple-400">6</div>
            <div className="text-sm text-zinc-400">Categories</div>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-4 border border-green-500/30">
            <div className="text-2xl mb-1">🌟</div>
            <div className="text-2xl font-bold text-green-400">3</div>
            <div className="text-sm text-zinc-400">Difficulty Levels</div>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-4 border border-yellow-500/30">
            <div className="text-2xl mb-1">🤖</div>
            <div className="text-2xl font-bold text-yellow-400">AI</div>
            <div className="text-sm text-zinc-400">Mentor Available</div>
          </div>
        </div>

        {/* Resources */}
        <ResourceList />

        {/* AI Mentor Widget */}
        <AIMentorWidget />
      </div>
    </main>
  );
}
