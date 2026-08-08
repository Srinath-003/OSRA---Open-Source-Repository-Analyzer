import { useState } from "react";
import { Loader2 } from "lucide-react";
import { analyzeRepository } from "../../services/api";

interface SearchBarProps {
  setRepository: (repo: any) => void;
}

const SAMPLE_REPOS = [
  "https://github.com/vim/vim",
  "https://github.com/facebook/react",
  "https://github.com/psf/requests-html",
];

export default function SearchBar({ setRepository }: SearchBarProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const runAnalysis = async (targetUrl: string) => {
    if (!targetUrl.trim()) return;

    try {
      setLoading(true);
      setRepository(null);

      const data = await analyzeRepository(targetUrl);

      setRepository(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSampleClick = (sampleUrl: string) => {
    setUrl(sampleUrl);
    runAnalysis(sampleUrl);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* Search Input Box */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="https://github.com/facebook/react"
          value={url}
          disabled={loading}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runAnalysis(url)}
          className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white outline-none transition focus:border-blue-500 disabled:opacity-60"
        />

        <button
          onClick={() => runAnalysis(url)}
          disabled={loading}
          className="flex min-w-[170px] items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze"
          )}
        </button>
      </div>

      {/* Quick Try Out Section */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-400">
        <span>Try out:</span>
        {SAMPLE_REPOS.map((sample) => (
          <button
            key={sample}
            type="button"
            disabled={loading}
            onClick={() => handleSampleClick(sample)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 transition hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-400 disabled:pointer-events-none disabled:opacity-50"
          >
            {sample.replace("https://github.com/", "")}
          </button>
        ))}
      </div>
    </div>
  );
}