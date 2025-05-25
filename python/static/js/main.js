document.addEventListener('DOMContentLoaded', function() {
    console.log('Delta Lake Studio loaded');
    
    // Modal functionality
    setupModals();
    
    // Login form functionality
    setupLoginForm();
    
    // Contact form functionality
    setupContactForm();
    
    // Check authentication status
    checkAuthStatus();
});

/**
 * Set up modal functionality
 */
function setupModals() {
    // About modal
    const aboutModal = document.getElementById('about-modal');
    const aboutLinks = [document.getElementById('about-link'), document.getElementById('about-footer')];
    const aboutClose = aboutModal?.querySelector('.close');
    
    // Privacy modal
    const privacyModal = document.getElementById('privacy-modal');
    const privacyLinks = [document.getElementById('privacy-link'), document.getElementById('privacy-footer')];
    const privacyClose = privacyModal?.querySelector('.close');
    
    // Contact modal
    const contactModal = document.getElementById('contact-modal');
    const contactLinks = [document.getElementById('contact-link'), document.getElementById('contact-footer')];
    const contactClose = contactModal?.querySelector('.close');
    
    // Set up event listeners for about modal
    if (aboutModal && aboutLinks) {
        aboutLinks.forEach(link => {
            if (link) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    aboutModal.style.display = 'block';
                });
            }
        });
        
        if (aboutClose) {
            aboutClose.addEventListener('click', function() {
                aboutModal.style.display = 'none';
            });
        }
    }
    
    // Set up event listeners for privacy modal
    if (privacyModal && privacyLinks) {
        privacyLinks.forEach(link => {
            if (link) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    privacyModal.style.display = 'block';
                });
            }
        });
        
        if (privacyClose) {
            privacyClose.addEventListener('click', function() {
                privacyModal.style.display = 'none';
            });
        }
    }
    
    // Set up event listeners for contact modal
    if (contactModal && contactLinks) {
        contactLinks.forEach(link => {
            if (link) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    contactModal.style.display = 'block';
                });
            }
        });
        
        if (contactClose) {
            contactClose.addEventListener('click', function() {
                contactModal.style.display = 'none';
            });
        }
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === aboutModal) {
            aboutModal.style.display = 'none';
        }
        if (e.target === privacyModal) {
            privacyModal.style.display = 'none';
        }
        if (e.target === contactModal) {
            contactModal.style.display = 'none';
        }
    });
}

/**
 * Set up login form functionality
 */
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    const exampleCredentialsBtn = document.getElementById('example-credentials');
    
    // No need to handle form submission as we're using traditional form submission
    // Just set up the example credentials button
    
    if (exampleCredentialsBtn) {
        exampleCredentialsBtn.addEventListener('click', function() {
            document.getElementById('workspace-url').value = 'https://example-workspace.cloud.databricks.com';
            document.getElementById('token').value = 'dapi1234567890abcdef';
            
            // Submit the form directly
            if (loginForm) {
                loginForm.submit();
            }
        });
    }
}

/**
 * Set up contact form functionality
 */
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !message) {
                showToast('Please fill in all fields', 'error');
                return;
            }
            
            // In a real application, this would send the form data to a server
            // For now, just show a success message
            showToast('Message sent successfully!', 'success');
            
            // Close the modal and reset the form
            document.getElementById('contact-modal').style.display = 'none';
            contactForm.reset();
        });
    }
}

/**
 * Check authentication status
 */
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        if (data.loggedIn) {
            // If user is logged in and on the home page, redirect to dashboard
            if (window.location.pathname === '/') {
                window.location.href = '/dashboard';
            }
        } else {
            // If user is not logged in and not on the home page, redirect to home
            if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
                window.location.href = '/';
            }
        }
    } catch (error) {
        console.error('Auth check error:', error);
    }
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of toast (success, error, info)
 */
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    
    if (toast) {
        // Remove any existing classes
        toast.className = 'toast';
        
        // Add the appropriate class based on type
        toast.classList.add(type);
        
        // Set the message
        toast.textContent = message;
        
        // Show the toast
        toast.style.display = 'block';
        
        // Hide the toast after 3 seconds
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
}

/**
 * Pipeline code generation functionality
 * @param {Array} nodes - The pipeline nodes
 * @param {Array} edges - The pipeline edges
 * @param {string} pipelineName - The name of the pipeline
 * @returns {Promise<string>} - The generated code
 */
async function generatePipelineCode(nodes, edges, pipelineName) {
    try {
        const response = await fetch('/api/pipeline/generate-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nodes, edges, pipelineName }),
        });
        
        const data = await response.json();
        return data.code;
    } catch (error) {
        console.error('Code generation error:', error);
        throw error;
    }
}

/**
 * Save pipeline to server
 * @param {Object} pipeline - The pipeline data
 * @returns {Promise<Object>} - The saved pipeline data
 */
async function savePipeline(pipeline) {
    try {
        const response = await fetch('/api/pipeline/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pipeline),
        });
        
        return await response.json();
    } catch (error) {
        console.error('Pipeline save error:', error);
        throw error;
    }
}

/**
 * Deploy notebook to Databricks
 * @param {Object} node - The node data
 * @param {string} workspaceUrl - The Databricks workspace URL
 * @param {string} token - The Databricks access token
 * @returns {Promise<Object>} - The deployment result
 */
async function deployNotebook(node, workspaceUrl, token) {
    try {
        const response = await fetch('/api/databricks/deploy-notebook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ node, workspaceUrl, token }),
        });
        
        return await response.json();
    } catch (error) {
        console.error('Notebook deployment error:', error);
        throw error;
    }
}