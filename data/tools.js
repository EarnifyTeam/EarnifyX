/**
 * EarnifyX Lab - AI Tools Dataset
 * Curated AI tools categorized for creators, builders, and marketers.
 */
const TOOLS_DATA = [
    {
        id: "chatgpt-plus",
        name: "ChatGPT",
        category: "AI Writing",
        pricing: "Freemium",
        badge: "Popular",
        badgeType: "primary",
        rating: 4.9,
        iconText: "💬",
        iconBg: "#10a37f",
        iconColor: "#ffffff",
        shortDescription: "OpenAI's state of the art LLM for writing, brainstorming, complex coding, and data analysis.",
        url: "https://chatgpt.com",
        featured: true,
        tags: ["Writing", "Coding", "Productivity", "Popular"]
    },
    {
        id: "claude-ai",
        name: "Claude 3.5 Sonnet",
        category: "AI Coding",
        pricing: "Freemium",
        badge: "Top Rated",
        badgeType: "purple",
        rating: 5.0,
        iconText: "🧠",
        iconBg: "#d97706",
        iconColor: "#ffffff",
        shortDescription: "Industry-leading reasoning, coding, nuance, and long-context document synthesis by Anthropic.",
        url: "https://claude.ai",
        featured: true,
        tags: ["Coding", "Writing", "Research", "Top Rated"]
    },
    {
        id: "midjourney",
        name: "Midjourney",
        category: "AI Image",
        pricing: "Paid",
        badge: "Essential",
        badgeType: "primary",
        rating: 4.9,
        iconText: "⛵",
        iconBg: "#1e1b4b",
        iconColor: "#60a5fa",
        shortDescription: "Unmatched photorealistic image and aesthetic art generation with precision prompt controls.",
        url: "https://midjourney.com",
        featured: true,
        tags: ["Image", "Art", "Design"]
    },
    {
        id: "elevenlabs",
        name: "ElevenLabs",
        category: "AI Audio",
        pricing: "Freemium",
        badge: "Studio Quality",
        badgeType: "success",
        rating: 4.9,
        iconText: "🎙️",
        iconBg: "#000000",
        iconColor: "#ffffff",
        shortDescription: "Hyper-realistic generative AI voice synthesis, voice cloning, and emotional speech control.",
        url: "https://elevenlabs.io",
        featured: true,
        tags: ["Audio", "Voice", "Creator"]
    },
    {
        id: "runway-gen3",
        name: "Runway Gen-3",
        category: "AI Video",
        pricing: "Freemium",
        badge: "New",
        badgeType: "primary",
        rating: 4.8,
        iconText: "🎬",
        iconBg: "#312e81",
        iconColor: "#a5b4fc",
        shortDescription: "High-fidelity text-to-video and image-to-video generation with cinematic camera directing.",
        url: "https://runwayml.com",
        featured: true,
        tags: ["Video", "Cinema", "Creator"]
    },
    {
        id: "perplexity-ai",
        name: "Perplexity AI",
        category: "AI Research",
        pricing: "Freemium",
        badge: "Essential",
        badgeType: "success",
        rating: 4.9,
        iconText: "🔍",
        iconBg: "#0f766e",
        iconColor: "#ffffff",
        shortDescription: "Conversational answer engine backed by real-time citations, academic papers, and web indices.",
        url: "https://perplexity.ai",
        featured: true,
        tags: ["Research", "Productivity", "Search"]
    },
    {
        id: "cursor-editor",
        name: "Cursor AI",
        category: "AI Coding",
        pricing: "Freemium",
        badge: "Developer Choice",
        badgeType: "purple",
        rating: 5.0,
        iconText: "💻",
        iconBg: "#0284c7",
        iconColor: "#ffffff",
        shortDescription: "The AI-first code editor that builds entire features and codebase refactors in seconds.",
        url: "https://cursor.com",
        featured: false,
        tags: ["Coding", "Developer", "Productivity"]
    },
    {
        id: "make-automation",
        name: "Make.com",
        category: "AI Automation",
        pricing: "Freemium",
        badge: "Automation",
        badgeType: "warning",
        rating: 4.8,
        iconText: "⚡",
        iconBg: "#6d28d9",
        iconColor: "#ffffff",
        shortDescription: "Visual automation platform to connect apps, AI models, and databases into autonomous workflows.",
        url: "https://make.com",
        featured: false,
        tags: ["Automation", "NoCode", "Productivity"]
    }
];

if (typeof window !== "undefined") {
    window.TOOLS_DATA = TOOLS_DATA;
}
