/**
 * EarnifyX Lab - Creator Resources Dataset
 * Free & Premium templates, checklists, creator packs, and guides.
 */
const RESOURCES_DATA = [
    {
        id: "creator-growth-kit-2026",
        title: "Creator Growth OS (Notion)",
        category: "Templates",
        type: "Free",
        badge: "Free",
        badgeType: "success",
        icon: "📁",
        downloads: "12,100+",
        description: "The complete Notion workspace for organizing video production, sponsorship deals, scripts, and multi-channel content pipelines.",
        includes: ["Content Calendar", "Sponsorship Rate Calculator", "Script Blueprint", "Thumbnail Split-Test Board"],
        downloadUrl: "#",
        featured: true
    },
    {
        id: "youtube-seo-checklist",
        title: "YouTube High CTR Checklist",
        category: "Checklists",
        type: "Free",
        badge: "Free",
        badgeType: "success",
        icon: "✅",
        downloads: "8,900+",
        description: "A 25-point pre-publish checklist to optimize thumbnail contrast, hook script, tags, cards, and metadata for the algorithm.",
        includes: ["PDF Checklist", "Figma Thumbnail Safe Zones", "Tag Generator Snippet"],
        downloadUrl: "#",
        featured: true
    },
    {
        id: "ai-prompt-vault-pro",
        title: "500+ Master AI Prompts Vault",
        category: "Creator Packs",
        type: "Premium",
        badge: "Premium",
        badgeType: "warning",
        icon: "💎",
        downloads: "4,500+",
        description: "Comprehensive spreadsheet and Obsidian vault containing 500+ battle-tested prompts for coding, copywriting, Midjourney v6, and automations.",
        includes: ["CSV & JSON export", "Obsidian Vault", "Continuous updates", "Video breakdown"],
        downloadUrl: "#",
        featured: true
    },
    {
        id: "creator-sound-effects-pack",
        title: "Creator Sound FX & Audio Pack",
        category: "Creator Packs",
        type: "Free",
        badge: "Free",
        badgeType: "success",
        icon: "🎵",
        downloads: "15,800+",
        description: "120+ royalty-free swooshes, clicks, pop-ups, risers, and subtle transition sounds formatted for Premiere Pro, CapCut, and DaVinci.",
        includes: ["WAV 48kHz / 24bit", "Categorized folders", "Royalty-free commercial license"],
        downloadUrl: "#",
        featured: false
    }
];

if (typeof window !== "undefined") {
    try {
        const saved = localStorage.getItem("earnifyx_data_resources");
        window.RESOURCES_DATA = saved ? JSON.parse(saved) : RESOURCES_DATA;
    } catch (e) {
        window.RESOURCES_DATA = RESOURCES_DATA;
    }
}
