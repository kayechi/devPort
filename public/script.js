// DOM elements
const profileContainer = document.querySelector('.profile-container');
const projectsSection = document.getElementById('projects');
const activitySection = document.getElementById('activity');
const projectsContainer = document.getElementById('projects-container');
const activityContainer = document.getElementById('activity-container');

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Profile data with projects
const profiles = {
  'Takumiii09': {
    portfolioUrl: 'https://takumiii09.github.io/deOcampo.github.io/',
    projects: [
      {
        name: 'Portfolio Website',
        description: 'Personal portfolio website showcasing projects and skills.',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        repo: 'https://github.com/Takumiii09/deOcampo.github.io',
        demo: 'https://takumiii09.github.io/deOcampo.github.io/'
      },
    ]
  },
  'kayechi': {
    portfolioUrl: 'https://kayechi.github.io/',
    projects: [
      {
        name: 'Portfolio Website',
        description: 'Personal portfolio website with project showcase.',
        image: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        repo: 'https://github.com/kayechi/kayechi.github.io',
        demo: 'https://kayechi.github.io/'
      }
    ]
  },
  'Jrldsgva': {
    portfolioUrl: 'https://jrldsgva.github.io/ImJeraldSegovia.github.io/',
    projects: [
      {
        name: 'Portfolio Website',
        description: 'Personal portfolio website displaying work and contact information.',
        image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1506&q=80',
        repo: 'https://github.com/Jrldsgva/ImJeraldSegovia.github.io',
        demo: 'https://jrldsgva.github.io/ImJeraldSegovia.github.io/'
      }
    ]
  }
};

// Load profile data from API
async function loadProfile(username) {
  try {
    // Show loading state
    document.getElementById('name').textContent = 'Loading...';
    document.getElementById('repos').textContent = '...';
    document.getElementById('followers').textContent = '...';
    
    // Clear previous content
    document.getElementById('portfolio-iframe').innerHTML = '<div class="loading">Loading portfolio...</div>';
    
    // Fetch profile data
    const profileResponse = await fetch(`/api/user/${username}`);
    if (!profileResponse.ok) {
      throw new Error(`HTTP error! status: ${profileResponse.status}`);
    }
    const profileData = await profileResponse.json();
    
    // Update profile info
    document.getElementById('avatar').src = profileData.avatar_url;
    document.getElementById('name').textContent = profileData.name || username;
    document.getElementById('repos').textContent = profileData.public_repos;
    document.getElementById('followers').textContent = profileData.followers;
    
    // Load portfolio iframe
    const portfolioIframe = document.getElementById('portfolio-iframe');
    if (profiles[username]?.portfolioUrl) {
      portfolioIframe.innerHTML = `
        <iframe 
          src="${profiles[username].portfolioUrl}" 
          frameborder="0" 
          style="width:100%;height:100%;"
          title="${username}'s Portfolio"
        ></iframe>
      `;
    } else {
      portfolioIframe.innerHTML = '<p>No portfolio URL available for this user</p>';
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
    document.getElementById('portfolio-iframe').innerHTML = `
      <div class="error">Failed to load profile: ${error.message}</div>
    `;
  }
}

// Load projects for selected user
function loadProjects(username) {
  projectsContainer.innerHTML = '';
  
  if (profiles[username]?.projects?.length) {
    profiles[username].projects.forEach(project => {
      const projectCard = document.createElement('div');
      projectCard.className = 'project-card';
      
      projectCard.innerHTML = `
        <div class="project-image">
          <img src="${project.image}" alt="${project.name}">
        </div>
        <div class="project-info">
          <h3>${project.name}</h3>
          <p>${project.description}</p>
          <div class="project-links">
            <a href="${project.repo}" target="_blank" rel="noopener noreferrer">GitHub Repo</a>
            ${project.demo ? `<a href="${project.demo}" target="_blank" rel="noopener noreferrer">Live Demo</a>` : ''}
          </div>
        </div>
      `;
      
      projectsContainer.appendChild(projectCard);
    });
  } else {
    projectsContainer.innerHTML = '<div class="loading">No projects found for this user.</div>';
  }
}

// Load recent GitHub activity
async function loadRecentActivity(username) {
  try {
    activityContainer.innerHTML = '<div class="loading">Loading recent activity...</div>';
    
    const response = await fetch(`/api/repos/${username}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const repos = await response.json();
    
    if (repos.length) {
      activityContainer.innerHTML = '';
      
      repos.forEach(repo => {
        const repoCard = document.createElement('div');
        repoCard.className = 'repo-card';
        
        repoCard.innerHTML = `
          <h3><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h3>
          <p>${repo.description || 'No description available'}</p>
          <div class="repo-meta">
            <span>Created: ${new Date(repo.created_at).toLocaleDateString()}</span>
            <span>Updated: ${new Date(repo.updated_at).toLocaleDateString()}</span>
          </div>
        `;
        
        activityContainer.appendChild(repoCard);
      });
    } else {
      activityContainer.innerHTML = '<div class="loading">No recent repositories found.</div>';
    }
  } catch (error) {
    console.error('Error loading activity:', error);
    activityContainer.innerHTML = `
      <div class="error">Failed to load activity: ${error.message}</div>
    `;
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
    
    // Scroll to section
    document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
  });
});
