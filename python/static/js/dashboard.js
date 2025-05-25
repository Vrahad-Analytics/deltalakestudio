document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard loaded');
    
    // Set up logout functionality
    setupLogout();
    
    // Load dashboard data
    loadDashboardData();
    
    // Load pipelines
    loadPipelines();
    
    // Set up create pipeline button
    setupCreatePipelineButton();
});

/**
 * Set up logout functionality
 */
function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            try {
                const response = await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showToast('Logged out successfully', 'success');
                    // Redirect to home page after a short delay
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                } else {
                    showToast(data.message || 'Logout failed', 'error');
                }
                
            } catch (error) {
                console.error('Logout error:', error);
                showToast('An error occurred during logout', 'error');
            }
        });
    }
}

/**
 * Load dashboard data (stats)
 */
async function loadDashboardData() {
    try {
        // Get authentication status to display workspace URL
        const authResponse = await fetch('/api/auth/status');
        const authData = await authResponse.json();
        
        if (authData.loggedIn) {
            const workspaceUrlElement = document.getElementById('workspace-url');
            if (workspaceUrlElement) {
                workspaceUrlElement.textContent = authData.workspaceUrl;
            }
        }
        
        // Get dashboard stats
        const statsResponse = await fetch('/api/dashboard/stats');
        const statsData = await statsResponse.json();
        
        // Update stats display
        const clustersCountElement = document.getElementById('clusters-count');
        const jobsCountElement = document.getElementById('jobs-count');
        const storageUsageElement = document.getElementById('storage-usage');
        
        if (clustersCountElement && statsData.clusters) {
            clustersCountElement.textContent = `${statsData.clusters.running}/${statsData.clusters.total}`;
        }
        
        if (jobsCountElement && statsData.jobs) {
            jobsCountElement.textContent = `${statsData.jobs.running}/${statsData.jobs.total}`;
        }
        
        if (storageUsageElement && statsData.storage) {
            storageUsageElement.textContent = `${statsData.storage.used}/${statsData.storage.total}`;
        }
        
    } catch (error) {
        console.error('Dashboard data loading error:', error);
        showToast('Failed to load dashboard data', 'error');
    }
}

/**
 * Load pipelines
 */
async function loadPipelines() {
    try {
        const response = await fetch('/api/pipelines');
        const data = await response.json();
        
        const pipelinesContainer = document.getElementById('pipelines-container');
        
        if (pipelinesContainer) {
            // Clear loading message
            pipelinesContainer.innerHTML = '';
            
            if (data.pipelines && data.pipelines.length > 0) {
                // Create pipeline cards
                data.pipelines.forEach(pipeline => {
                    const pipelineCard = createPipelineCard(pipeline);
                    pipelinesContainer.appendChild(pipelineCard);
                });
            } else {
                // No pipelines message
                pipelinesContainer.innerHTML = '<div class="no-data">No pipelines found. Create your first pipeline!</div>';
            }
        }
        
    } catch (error) {
        console.error('Pipelines loading error:', error);
        
        const pipelinesContainer = document.getElementById('pipelines-container');
        if (pipelinesContainer) {
            pipelinesContainer.innerHTML = '<div class="error">Failed to load pipelines</div>';
        }
    }
    
    // Also load some mock activity data
    loadMockActivity();
}

/**
 * Create a pipeline card element
 * @param {Object} pipeline - The pipeline data
 * @returns {HTMLElement} - The pipeline card element
 */
function createPipelineCard(pipeline) {
    const card = document.createElement('div');
    card.className = 'pipeline-card';
    
    // Format date
    const date = new Date(pipeline.lastRun);
    const formattedDate = date.toLocaleString();
    
    // Determine status class
    let statusClass = '';
    switch (pipeline.status) {
        case 'completed':
            statusClass = 'status-success';
            break;
        case 'running':
            statusClass = 'status-info';
            break;
        case 'failed':
            statusClass = 'status-error';
            break;
        default:
            statusClass = '';
    }
    
    card.innerHTML = `
        <div class="pipeline-header">
            <h3>${pipeline.name}</h3>
            <span class="pipeline-status ${statusClass}">${pipeline.status}</span>
        </div>
        <div class="pipeline-details">
            <div class="pipeline-stat">
                <span class="label">Last Run:</span>
                <span class="value">${formattedDate}</span>
            </div>
            <div class="pipeline-stat">
                <span class="label">Nodes:</span>
                <span class="value">${pipeline.nodes}</span>
            </div>
            <div class="pipeline-stat">
                <span class="label">Edges:</span>
                <span class="value">${pipeline.edges}</span>
            </div>
        </div>
        <div class="pipeline-actions">
            <button class="btn btn-secondary edit-pipeline" data-id="${pipeline.id}">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-primary run-pipeline" data-id="${pipeline.id}">
                <i class="fas fa-play"></i> Run
            </button>
        </div>
    `;
    
    // Add event listeners
    const editBtn = card.querySelector('.edit-pipeline');
    const runBtn = card.querySelector('.run-pipeline');
    
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            window.location.href = `/pipeline-designer?id=${pipeline.id}`;
        });
    }
    
    if (runBtn) {
        runBtn.addEventListener('click', function() {
            showToast(`Running pipeline: ${pipeline.name}`, 'info');
            // In a real app, this would trigger the pipeline execution
        });
    }
    
    return card;
}

/**
 * Load mock activity data
 */
function loadMockActivity() {
    const activityContainer = document.getElementById('activity-container');
    
    if (activityContainer) {
        // Mock activity data
        const activities = [
            {
                type: 'pipeline_run',
                name: 'Customer Data ETL',
                status: 'completed',
                timestamp: new Date(Date.now() - 30 * 60000).toLocaleString() // 30 minutes ago
            },
            {
                type: 'notebook_deploy',
                name: 'Data Validation',
                status: 'completed',
                timestamp: new Date(Date.now() - 2 * 60 * 60000).toLocaleString() // 2 hours ago
            },
            {
                type: 'cluster_start',
                name: 'Analytics Cluster',
                status: 'completed',
                timestamp: new Date(Date.now() - 3 * 60 * 60000).toLocaleString() // 3 hours ago
            },
            {
                type: 'pipeline_run',
                name: 'Sales Analytics',
                status: 'failed',
                timestamp: new Date(Date.now() - 5 * 60 * 60000).toLocaleString() // 5 hours ago
            }
        ];
        
        // Clear loading message
        activityContainer.innerHTML = '';
        
        // Create activity items
        activities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            
            let icon = '';
            let statusClass = '';
            
            switch (activity.type) {
                case 'pipeline_run':
                    icon = '<i class="fas fa-project-diagram"></i>';
                    break;
                case 'notebook_deploy':
                    icon = '<i class="fas fa-code"></i>';
                    break;
                case 'cluster_start':
                    icon = '<i class="fas fa-server"></i>';
                    break;
                default:
                    icon = '<i class="fas fa-info-circle"></i>';
            }
            
            switch (activity.status) {
                case 'completed':
                    statusClass = 'status-success';
                    break;
                case 'running':
                    statusClass = 'status-info';
                    break;
                case 'failed':
                    statusClass = 'status-error';
                    break;
                default:
                    statusClass = '';
            }
            
            activityItem.innerHTML = `
                <div class="activity-icon">${icon}</div>
                <div class="activity-content">
                    <div class="activity-header">
                        <span class="activity-name">${activity.name}</span>
                        <span class="activity-status ${statusClass}">${activity.status}</span>
                    </div>
                    <div class="activity-time">${activity.timestamp}</div>
                </div>
            `;
            
            activityContainer.appendChild(activityItem);
        });
    }
}

/**
 * Set up create pipeline button
 */
function setupCreatePipelineButton() {
    const createPipelineBtn = document.getElementById('create-pipeline-btn');
    
    if (createPipelineBtn) {
        createPipelineBtn.addEventListener('click', function() {
            window.location.href = '/pipeline-designer';
        });
    }
}
