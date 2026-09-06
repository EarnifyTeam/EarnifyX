/**
 * EarnifyX Lab - Chrome Extensions Dataset
 * Easy to update: add a new extension object below to automatically publish it to the website.
 */
const EXTENSIONS_DATA = [
    {
        id: "dola-pilot",
        name: "Dola Pilot",
        badge: "Free",
        badgeType: "success", // success (green), warning (amber), primary (blue), purple
        version: "v2.4.0",
        rating: 4.9,
        users: "12,500+",
        category: "AI",
        iconText: "D",
        iconBg: "#111827",
        iconColor: "#ffffff",
        shortDescription: "AI assistant for your browser workflow. Automate tabs, research and summarize with one click.",
        description: "Dola Pilot is your smart companion inside Chrome. It brings multimodal AI models directly into your workflow, allowing you to summarize YouTube videos, extract key points from long articles, automate repetitive tasks, and chat with any webpage instantly.",
        features: [
            "One-click webpage summarization",
            "YouTube timestamped transcript generator",
            "Smart clipboard & prompt snippet manager",
            "Contextual AI writing assistant on any input field",
            "Privacy-first offline local storage"
        ],
        downloadUrl: "https://chromewebstore.google.com",
        featured: true,
        tags: ["AI", "Productivity", "Free", "Chrome"]
    },
    {
        id: "webchatgpt-plus",
        name: "WebChatGPT+",
        badge: "Free",
        badgeType: "success",
        version: "v3.1.2",
        rating: 4.8,
        users: "45,000+",
        category: "AI",
        iconText: "⚡",
        iconBg: "#10a37f",
        iconColor: "#ffffff",
        shortDescription: "Search the web directly in ChatGPT with accurate real-time web citations and sources.",
        description: "Augment your ChatGPT prompts with relevant, up-to-date search results from Google, Bing, and DuckDuckGo. Never get hallucinated outdated facts again.",
        features: [
            "Real-time web search integration",
            "Custom region & time filters",
            "Direct link citations and source transparency",
            "Zero telemetry or tracking"
        ],
        downloadUrl: "https://chromewebstore.google.com",
        featured: true,
        tags: ["AI", "Research", "Free", "ChatGPT"]
    },
    {
        id: "monica-helper",
        name: "Monica AI Hub",
        badge: "Free",
        badgeType: "success",
        version: "v1.8.5",
        rating: 4.7,
        users: "28,000+",
        category: "Productivity",
        iconText: "🟣",
        iconBg: "#8b5cf6",
        iconColor: "#ffffff",
        shortDescription: "All-in-one AI assistant in your browser side-panel for seamless multitasking.",
        description: "A convenient sidebar extension that lives on your screen ready to answer questions, rephrase copy, translate foreign text, and write code snippets without leaving your active tab.",
        features: [
            "Dockable side-panel experience",
            "Grammar correction and tone rephrasing",
            "Full-page PDF reader and annotator",
            "Instant translation in 50+ languages"
        ],
        downloadUrl: "https://chromewebstore.google.com",
        featured: true,
        tags: ["Productivity", "AI", "Free"]
    },
    {
        id: "youtube-summary-pro",
        name: "YouTube Summary",
        badge: "Free",
        badgeType: "success",
        version: "v4.0.1",
        rating: 4.9,
        users: "60,000+",
        category: "Creator",
        iconText: "▶️",
        iconBg: "#ef4444",
        iconColor: "#ffffff",
        shortDescription: "Summarize YouTube videos instantly with AI timestamps and bullet points.",
        description: "Save hours of watching by getting instant bullet-point summaries, key takeaways, and transcribed chapter highlights from long podcasts, tutorials, and interviews.",
        features: [
            "Instant AI chapter breakdowns",
            "Export summaries to Notion & Markdown",
            "Timestamped audio scrubbing",
            "Works on unlisted and livestream replays"
        ],
        downloadUrl: "https://chromewebstore.google.com",
        featured: true,
        tags: ["Creator", "YouTube", "Free", "AI"]
    },
    {
        id: "google-translate-plus",
        name: "Google Translate+",
        badge: "Free",
        badgeType: "success",
        version: "v2.0.0",
        rating: 4.8,
        users: "19,000+",
        category: "Productivity",
        iconText: "G",
        iconBg: "#3b82f6",
        iconColor: "#ffffff",
        shortDescription: "Enhanced translation with contextual AI rephrasing and pronunciation playback.",
        description: "Translates selected text on hover, provides natural colloquial phrasing, and breaks down idioms for creators reading international content.",
        features: [
            "Hover-to-translate floating bubble",
            "Context-aware tone translations",
            "Vocabulary save list with flashcard export",
            "Native voice accents playback"
        ],
        downloadUrl: "https://chromewebstore.google.com",
        featured: true,
        tags: ["Productivity", "Language", "Free"]
    },
    {
        id: "earnifyx-clipper",
        name: "EarnifyX QuickClip",
        badge: "New",
        badgeType: "primary",
        version: "v1.0.0",
        rating: 5.0,
        users: "5,000+",
        category: "Automation",
        iconText: "🧪",
        iconBg: "#2563eb",
        iconColor: "#ffffff",
        shortDescription: "One-click clip prompts, tools, and creator assets straight into your EarnifyX Dashboard.",
        description: "The official EarnifyX Lab browser extension. Save any AI prompt, web article, tool bookmark, or code snippet directly to your personal cloud library with tags and notes.",
        features: [
            "1-Click EarnifyX Lab cloud sync",
            "Automatic metadata and screenshot capture",
            "Tagging & folder organization",
            "Instant copy back into ChatGPT/Claude"
        ],
        downloadUrl: "https://chromewebstore.google.com",
        featured: true,
        tags: ["Automation", "Creator", "New", "Official"]
    }
];

// Export for browser global scope
if (typeof window !== "undefined") {
    window.EXTENSIONS_DATA = EXTENSIONS_DATA;
}
