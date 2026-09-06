/**
 * EarnifyX Lab - Software & Apps Dataset
 * Easily add native desktop/web software developed for creators.
 */
const SOFTWARE_DATA = [
    {
        id: "earnifyx-studio",
        name: "EarnifyX Studio",
        badge: "New",
        badgeType: "primary", // primary (blue/pink), success (green), purple
        platform: "Windows / Mac / Web",
        version: "v1.2.0",
        rating: 5.0,
        downloads: "8,400+",
        iconText: "X",
        iconBg: "#0f172a",
        iconColor: "#38bdf8",
        shortDescription: "All-in-one creator toolkit for video, prompts, audio processing & content repurposing.",
        description: "EarnifyX Studio is our flagship desktop creative suite. Built specifically for solo content creators, digital builders, and YouTubers to orchestrate scripting, audio cleanup, visual hooks, and automated cross-platform distribution.",
        features: [
            "AI Script Generator with viral hook detection",
            "Batch audio noise removal & loudness normalization",
            "Subtitle & caption burn-in with dynamic word styling",
            "Local offline AI engine option for 100% privacy",
            "Preloaded with 200+ EarnifyX Master Prompt templates"
        ],
        systemRequirements: "Windows 10/11 (64-bit) or macOS 12+ (Apple Silicon / Intel), 8GB RAM minimum",
        downloadUrl: "#",
        official: true,
        featured: true,
        tags: ["Creator", "Video", "Official", "New"]
    },
    {
        id: "prompt-manager-pro",
        name: "Prompt Manager",
        badge: "Free",
        badgeType: "success",
        platform: "Windows / Mac",
        version: "v2.1.0",
        rating: 4.9,
        downloads: "15,200+",
        iconText: "📋",
        iconBg: "#3b82f6",
        iconColor: "#ffffff",
        shortDescription: "Organize, test, save and use your AI prompts easily with variable support and hotkeys.",
        description: "Stop losing your best prompts in messy text files or browser history. Prompt Manager provides an ultra-fast global shortcut popup to search, fill dynamic variables (e.g. {{topic}}, {{tone}}), and paste into any window.",
        features: [
            "Global system hotkey (Alt + Space) instant summon",
            "Dynamic prompt variable templating engine",
            "Folder & tag categorization with fuzzy search",
            "Local SQLite encrypted database storage",
            "One-click sync with EarnifyX Lab cloud account"
        ],
        systemRequirements: "Windows 10+, macOS 11+, Linux AppImage, 4GB RAM",
        downloadUrl: "#",
        official: true,
        featured: true,
        tags: ["Productivity", "Prompts", "Free", "Official"]
    },
    {
        id: "auto-content-pro",
        name: "Auto Content Pro",
        badge: "Premium",
        badgeType: "warning",
        platform: "Web / Windows",
        version: "v1.5.4",
        rating: 4.8,
        downloads: "6,900+",
        iconText: "⚡",
        iconBg: "#3b82f6",
        iconColor: "#ffffff",
        shortDescription: "Automate multi-platform content creation with AI workflows and scheduled social drops.",
        description: "Turn a single core idea or YouTube URL into 10 Twitter/X threads, 5 LinkedIn carousels, 3 newsletter issues, and short-form TikTok/Reels scripts in under 60 seconds.",
        features: [
            "Repurposes 1 long video/article into 20+ social assets",
            "Direct webhook & Zapier / Make integration",
            "Built-in visual carousel image renderer",
            "Custom brand voice training profile"
        ],
        systemRequirements: "Modern web browser or Windows desktop wrapper",
        downloadUrl: "#",
        official: true,
        featured: true,
        tags: ["Automation", "Social Media", "Premium"]
    },
    {
        id: "thumbnail-maker",
        name: "Thumbnail Maker",
        badge: "Free",
        badgeType: "success",
        platform: "Web App",
        version: "v3.0.0",
        rating: 4.9,
        downloads: "24,000+",
        iconText: "🖼️",
        iconBg: "#ec4899",
        iconColor: "#ffffff",
        shortDescription: "Create high CTR, stunning YouTube thumbnails in seconds with AI cutout and glowing borders.",
        description: "A lightning-fast browser-based thumbnail builder designed strictly for high click-through rates. Includes one-click AI background removal, glow stroke outlines, and proven font presets.",
        features: [
            "Instant AI subject cutout with zero edge halo",
            "100+ proven YouTube CTR headline templates",
            "Split-test preview previewer for YouTube homepage",
            "High resolution 1920x1080 & 4K PNG export"
        ],
        systemRequirements: "Runs in any web browser (WebGL accelerated)",
        downloadUrl: "#",
        official: true,
        featured: true,
        tags: ["Creator", "YouTube", "Design", "Free"]
    },
    {
        id: "voice-studio-ai",
        name: "Voice Studio",
        badge: "New",
        badgeType: "primary",
        platform: "Windows / Mac",
        version: "v1.1.0",
        rating: 4.8,
        downloads: "4,300+",
        iconText: "🎙️",
        iconBg: "#10b981",
        iconColor: "#ffffff",
        shortDescription: "High-quality AI voice generation, voice cloning, and audio cleanup with studio polish.",
        description: "Generate ultra-realistic voiceovers for your videos, courses, and ads. Features emotional pacing controls, breath insertions, multi-speaker dialogue scripts, and background noise removal.",
        features: [
            "50+ ultra-lifelike natural voice models",
            "Voice cloning from 30 seconds of clean reference",
            "SSML emotion and pitch emphasis sliders",
            "Lossless WAV and MP3 export"
        ],
        systemRequirements: "Windows 10/11 or macOS 12+, 8GB RAM",
        downloadUrl: "#",
        official: true,
        featured: true,
        tags: ["AI", "Audio", "Creator", "New"]
    },
    {
        id: "stream-pilot-tool",
        name: "StreamPilot Overlay",
        badge: "Free",
        badgeType: "success",
        platform: "OBS / Windows",
        version: "v1.0.8",
        rating: 4.7,
        downloads: "3,200+",
        iconText: "📡",
        iconBg: "#6366f1",
        iconColor: "#ffffff",
        shortDescription: "Dynamic live stream alerts, AI chat moderator and creator subscriber widgets.",
        description: "Supercharge your YouTube and Twitch live streams with animated responsive overlays, automated chat summaries for late joiners, and donation alerts.",
        features: [
            "Lightweight OBS browser source plugin",
            "AI live chat sentiment tracker and auto-mod",
            "Customizable sponsor banner ticker",
            "Interactive viewer trivia bot"
        ],
        systemRequirements: "OBS Studio v28+ or Streamlabs Desktop",
        downloadUrl: "#",
        official: true,
        featured: false,
        tags: ["Creator", "Streaming", "Free"]
    }
];

if (typeof window !== "undefined") {
    try {
        const saved = localStorage.getItem("earnifyx_data_software");
        window.SOFTWARE_DATA = saved ? JSON.parse(saved) : SOFTWARE_DATA;
    } catch (e) {
        window.SOFTWARE_DATA = SOFTWARE_DATA;
    }
}
