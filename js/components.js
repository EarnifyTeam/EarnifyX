/**
 * EarnifyX Lab - UI Components & Card Generators
 * Modular, clean HTML generator for cards, badges, and modals.
 */

const Components = {
    /**
     * Render Chrome Extension Card
     */
    createExtensionCard(ext) {
        const isSaved = window.AuthUI ? window.AuthUI.isSaved("extension", ext.id) : false;
        return `
            <div class="item-card" data-id="${ext.id}" data-category="${ext.category}">
                <div>
                    <div class="card-top">
                        <div class="card-icon-box" style="background-color: ${ext.iconBg}; color: ${ext.iconColor};">
                            ${ext.iconText}
                        </div>
                        <span class="badge badge-${ext.badgeType || 'success'}">${ext.badge}</span>
                    </div>
                    <h3 class="card-title">${ext.name}</h3>
                    <p class="card-description">${ext.shortDescription}</p>
                </div>
                <div class="card-footer-action">
                    <button class="card-action-btn" onclick="openExtensionModal('${ext.id}')">
                        View Details →
                    </button>
                    <button class="card-bookmark-btn ${isSaved ? 'saved' : ''}" 
                            title="Save Item" 
                            onclick="toggleSaveItem('extension', '${ext.id}', '${ext.name.replace(/'/g, "\\'")}', event)">
                        ${isSaved ? '❤️' : '🤍'}
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Render Software & Apps Card
     */
    createSoftwareCard(soft) {
        const isSaved = window.AuthUI ? window.AuthUI.isSaved("software", soft.id) : false;
        return `
            <div class="item-card" data-id="${soft.id}" data-category="${soft.tags[0] || 'App'}">
                <div>
                    <div class="card-top">
                        <div class="card-icon-box" style="background-color: ${soft.iconBg}; color: ${soft.iconColor};">
                            ${soft.iconText}
                        </div>
                        <span class="badge badge-${soft.badgeType || 'primary'}">${soft.badge}</span>
                    </div>
                    <h3 class="card-title">${soft.name}</h3>
                    <p class="card-description">${soft.shortDescription}</p>
                </div>
                <div class="card-footer-action">
                    <button class="card-action-btn" onclick="openSoftwareModal('${soft.id}')">
                        Download →
                    </button>
                    <button class="card-bookmark-btn ${isSaved ? 'saved' : ''}" 
                            title="Save Item" 
                            onclick="toggleSaveItem('software', '${soft.id}', '${soft.name.replace(/'/g, "\\'")}', event)">
                        ${isSaved ? '❤️' : '🤍'}
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Render Master Prompt Card
     */
    createPromptCard(prompt) {
        const isSaved = window.AuthUI ? window.AuthUI.isSaved("prompt", prompt.id) : false;
        const detectedFormat = prompt.contentType || (prompt.tags || []).find(tag => ["Video", "Image", "Audio", "Shorts/Reels"].includes(tag));
        return `
            <div class="prompt-card" data-id="${prompt.id}" data-category="${prompt.category}">
                <div>
                    <div class="prompt-header">
                        <div class="flex items-center gap-2">
                            <span style="font-size: 1.25rem;">${prompt.icon}</span>
                            <span class="prompt-category-tag">${prompt.category}</span>
                        </div>
                        <span class="badge badge-${prompt.badgeType || 'success'}">${prompt.badge}</span>
                    </div>
                    <h3 class="card-title" style="margin-bottom: 0.5rem;">${prompt.title}</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.6rem; font-size: 0.72rem; color: var(--text-muted);">
                        ${prompt.niche ? `<span class="prompt-category-tag">Niche: ${prompt.niche}</span>` : ""}
                        ${prompt.model ? `<span class="prompt-category-tag">Model: ${prompt.model}</span>` : ""}
                        ${detectedFormat ? `<span class="prompt-category-tag">Format: ${detectedFormat}</span>` : ""}
                    </div>
                    <div class="prompt-body-preview">
                        ${prompt.locked ? (prompt.previewText || prompt.shortDescription) : prompt.shortDescription}
                    </div>
                </div>
                <div class="prompt-footer">
                    <button class="btn btn-sm btn-secondary" onclick="openPromptModal('${prompt.id}')">
                        ${prompt.locked ? '🔒 View Locked' : 'View Prompt →'}
                    </button>
                    ${prompt.locked 
                        ? `<button class="btn btn-sm btn-primary" onclick="openUnlockModal('${prompt.title.replace(/'/g, "\\'")}')">Unlock</button>`
                        : `<button class="btn btn-sm btn-subtle" onclick="copyPromptText('${prompt.id}', event)">📋 Copy</button>`
                    }
                </div>
            </div>
        `;
    },

    /**
     * Render AI Tool Card
     */
    createToolCard(tool) {
        const isSaved = window.AuthUI ? window.AuthUI.isSaved("tool", tool.id) : false;
        return `
            <div class="item-card" data-id="${tool.id}" data-category="${tool.category}">
                <div>
                    <div class="card-top">
                        ${tool.imageUrl
                            ? `<img src="${tool.imageUrl}" alt="${tool.name} preview" loading="lazy" style="width: 100%; height: 140px; object-fit: cover; border-radius: var(--radius-md);">`
                            : `<div class="card-icon-box" style="background-color: ${tool.iconBg}; color: ${tool.iconColor};">${tool.iconText}</div>`}
                        <span class="badge badge-${tool.badgeType || 'primary'}">${tool.pricing}</span>
                    </div>
                    <h3 class="card-title">${tool.name}</h3>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.4rem;">${tool.category} • ⭐ ${tool.rating}</div>
                    <p class="card-description">${tool.shortDescription}</p>
                </div>
                <div class="card-footer-action">
                    <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="card-action-btn">
                        Visit Tool ↗
                    </a>
                    <button class="card-bookmark-btn ${isSaved ? 'saved' : ''}" 
                            title="Save Tool" 
                            onclick="toggleSaveItem('tool', '${tool.id}', '${tool.name.replace(/'/g, "\\'")}', event)">
                        ${isSaved ? '❤️' : '🤍'}
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Render Resource Card
     */
    createResourceCard(res) {
        const isSaved = window.AuthUI ? window.AuthUI.isSaved("resource", res.id) : false;
        return `
            <div class="item-card" data-id="${res.id}" data-category="${res.category}">
                <div>
                    <div class="card-top">
                        <div class="card-icon-box" style="background-color: var(--bg-surface-subtle); color: var(--accent-primary);">
                            ${res.icon}
                        </div>
                        <span class="badge badge-${res.badgeType}">${res.badge}</span>
                    </div>
                    <h3 class="card-title">${res.title}</h3>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.4rem;">${res.category} • ⬇️ ${res.downloads}</div>
                    <p class="card-description">${res.description}</p>
                </div>
                <div class="card-footer-action">
                    <button class="card-action-btn" onclick="downloadResource('${res.id}', '${res.title.replace(/'/g, "\\'")}', '${res.type}')">
                        ${res.type === 'Premium' ? '🔒 Unlock Pack →' : 'Download Free →'}
                    </button>
                    <button class="card-bookmark-btn ${isSaved ? 'saved' : ''}" 
                            title="Save Resource" 
                            onclick="toggleSaveItem('resource', '${res.id}', '${res.title.replace(/'/g, "\\'")}', event)">
                        ${isSaved ? '❤️' : '🤍'}
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Render Blog Card
     */
    createBlogCard(post) {
        return `
            <article class="article-card" data-id="${post.id}">
                <img src="${post.thumbnail}" alt="${post.title}" class="article-thumb" loading="lazy" />
                <div class="article-content">
                    <div class="article-meta">
                        <span class="badge badge-primary">${post.category}</span>
                        <span>•</span>
                        <span>${post.date}</span>
                        <span>•</span>
                        <span>${post.readTime}</span>
                    </div>
                    <h3 class="article-title">${post.title}</h3>
                    <p class="card-description" style="-webkit-line-clamp: 3;">${post.shortDescription}</p>
                    <div style="margin-top: auto; padding-top: 1rem;">
                        <button class="card-action-btn" onclick="openBlogModal('${post.id}')">
                            Read Article →
                        </button>
                    </div>
                </div>
            </article>
        `;
    },

    /**
     * Render Tutorial Card
     */
    createTutorialCard(tut) {
        return `
            <article class="article-card" data-id="${tut.id}">
                <img src="${tut.thumbnail}" alt="${tut.title}" class="article-thumb" loading="lazy" />
                <div class="article-content">
                    <div class="article-meta">
                        <span class="badge badge-purple">${tut.difficulty}</span>
                        <span>•</span>
                        <span>⏱️ ${tut.time}</span>
                    </div>
                    <h3 class="article-title">${tut.title}</h3>
                    <p class="card-description">${tut.description}</p>
                    <div style="margin-top: auto; padding-top: 1rem;">
                        <button class="card-action-btn" onclick="openTutorialModal('${tut.id}')">
                            Read Tutorial →
                        </button>
                    </div>
                </div>
            </article>
        `;
    }
};

if (typeof window !== "undefined") {
    window.Components = Components;
}
