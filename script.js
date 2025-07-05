// DOM elements
const profileContainer = document.getElementById('profile-container');
const projectsSection = document.getElementById('projects');
const activitySection = document.getElementById('activity');
const projectsContainer = document.getElementById('projects-container');
const activityContainer = document.getElementById('activity-container');

// Profile data
const profiles = {
    'Takumiii09': {
        portfolioUrl: 'https://takumiii09.github.io/deOcampo.github.io/',
        projects: [
            {
                name: 'Portfolio Website',
                description: 'Personal portfolio website showcasing projects and skills.',
                image: 'https://via.placeholder.com/400x200?text=Portfolio+Screenshot',
                repo: 'https://github.com/Takumiii09/deOcampo.github.io',
                demo: 'https://takumiii09.github.io/deOcampo.github.io/'
            }
            // Add more projects as needed
        ]
    },
    'kayechi': {
        portfolioUrl: 'https://kayechi.github.io/',
        projects: [
            {
                name: 'Portfolio Website',
                description: 'Personal portfolio website with project showcase.',
                image: 'https://via.placeholder.com/400x200?text=Portfolio+Screenshot',
                repo: 'https://github.com/kayechi/kayechi.github.io',
                demo: 'https://kayechi.github.io/'
            }
            // Add more projects as needed
        ]
    },
    'Jrldsgva': {
        portfolioUrl: 'https://jrldsgva.github.io/ImJeraldSegovia.github.io/',
        projects: [
            {
                name: 'Portfolio Website',
                description: 'Personal portfolio website displaying work and contact information.',
                image: 'https://via.placeholder.com/400x200?text=Portfolio+Screenshot',
                repo: 'https://github.com/Jrldsgva/ImJeraldSegovia.github.io',
                demo: 'https://jrldsgva.github.io/ImJeraldSegovia.github.io/'
            }
            // Add more projects as needed
        ]
    }
};

// Load profile data from GitHub API
async function loadProfile(username) {
    try {
        // Show loading state
        document.getElementById('name').textContent = 'Loading...';
        document.getElementById('repos').textContent = '...';
        document.getElementById('followers').textContent = '...';
        
        // Fetch profile data
        const profileResponse = await fetch(`https://api.github.com/users/${username}`);
        const profileData = await profileResponse.json();
        
        // Update profile info
        document.getElementById('avatar').src = profileData.avatar_url;
        document.getElementById('name').textContent = profileData.name || username;
        document.getElementById('repos').textContent = profileData.public_repos;
        document.getElementById('followers').textContent = profileData.followers;
        
        // Load portfolio iframe
        const portfolioIframe = document.getElementById('portfolio-iframe');
        if (profiles[username] && profiles[username].portfolioUrl) {
            portfolioIframe.innerHTML = `<iframe src="${profiles[username].portfolioUrl}" frameborder="0" style="width:100%;height:100%;"></iframe>`;
        } else {
            portfolioIframe.innerHTML = `<p>No portfolio URL available for this user</p>`;
        }
        
        // Load projects
        loadProjects(username);
        
        // Load recent activity
        loadRecentActivity(username);
        
        // Show all sections
        projectsSection.classList.remove('hidden');
        activitySection.classList.remove('hidden');
        
    } catch (error) {
        console.error('Error loading profile:', error);
        document.getElementById('name').textContent = 'Error loading profile';
    }
}

// Load projects for selected user
function loadProjects(username) {
    projectsContainer.innerHTML = '';
    
    if (profiles[username] && profiles[username].projects) {
        profiles[username].projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            projectCard.innerHTML = `
                <div class="project-image">
                    <img src="${project.image}" alt="${project.name}" style="max-width:100%;max-height:100%;">
                </div>
                <div class="project-info">
                    <h3>${project.name}</h3>
                    <p>${project.description}</p>
                    <div class="project-links">
                        <a href="${project.repo}" target="_blank">GitHub Repo</a>
                        ${project.demo ? `<a href="${project.demo}" target="_blank">Live Demo</a>` : ''}
                    </div>
                </div>
            `;
            
            projectsContainer.appendChild(projectCard);
        });
    } else {
        projectsContainer.innerHTML = '<p>No projects found for this user.</p>';
    }
}

// Load recent GitHub activity
async function loadRecentActivity(username) {
    try {
        activityContainer.innerHTML = '<p>Loading recent activity...</p>';
        
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
        const repos = await response.json();
        
        if (repos.length > 0) {
            activityContainer.innerHTML = '';
            
            repos.forEach(repo => {
                const repoCard = document.createElement('div');
                repoCard.className = 'repo-card';
                
                repoCard.innerHTML = `
                    <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
                    <p>${repo.description || 'No description available'}</p>
                    <div class="repo-meta">
                        <span>Updated: ${new Date(repo.updated_at).toLocaleDateString()}</span>
                    </div>
                `;
                
                activityContainer.appendChild(repoCard);
            });
        } else {
            activityContainer.innerHTML = '<p>No recent repositories found.</p>';
        }
    } catch (error) {
        console.error('Error loading activity:', error);
        activityContainer.innerHTML = '<p>Error loading recent activity.</p>';
    }
}

// Navigation
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Update active link
        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
        this.classList.add('active');
        
        // Show the corresponding section
        const targetId = this.getAttribute('href').substring(1);
        document.querySelectorAll('main > section').forEach(section => {
            if (section.id === targetId) {
                section.classList.remove('hidden');
            } else if (section.id !== 'home') {
                section.classList.add('hidden');
            }
        });
    });
});