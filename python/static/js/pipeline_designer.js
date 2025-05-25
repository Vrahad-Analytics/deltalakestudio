document.addEventListener('DOMContentLoaded', function() {
    console.log('Pipeline Designer loaded');
    
    // Canvas state
    const canvasState = {
        nodes: [],
        edges: [],
        nextNodeId: 1,
        nextEdgeId: 1,
        selectedNode: null,
        selectedPort: null,
        edgeStartPort: null,
        isDragging: false,
        dragOffsetX: 0,
        dragOffsetY: 0,
        scale: 1,
        translateX: 0,
        translateY: 0
    };
    
    // DOM elements
    const canvas = document.getElementById('pipeline-canvas');
    const paletteItems = document.querySelectorAll('.palette-item');
    
    // Set up drag and drop for palette items
    paletteItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
    });
    
    // Canvas event listeners
    if (canvas) {
        canvas.addEventListener('dragover', handleDragOver);
        canvas.addEventListener('drop', handleDrop);
        canvas.addEventListener('click', handleCanvasClick);
    } else {
        console.error('Canvas element not found');
    }
    
    // Drag and drop handlers
    function handleDragStart(e) {
        console.log('Drag started');
        const nodeType = e.target.getAttribute('data-type');
        const nodeFormat = e.target.getAttribute('data-format');
        const nodeTransformation = e.target.getAttribute('data-transformation');
        
        e.dataTransfer.setData('nodeType', nodeType);
        if (nodeFormat) e.dataTransfer.setData('nodeFormat', nodeFormat);
        if (nodeTransformation) e.dataTransfer.setData('nodeTransformation', nodeTransformation);
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }
    
    function handleDrop(e) {
        e.preventDefault();
        console.log('Drop event triggered');
        
        const nodeType = e.dataTransfer.getData('nodeType');
        const nodeFormat = e.dataTransfer.getData('nodeFormat');
        const nodeTransformation = e.dataTransfer.getData('nodeTransformation');
        
        console.log('Node data:', nodeType, nodeFormat, nodeTransformation);
        
        // Calculate position relative to canvas
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / canvasState.scale - canvasState.translateX;
        const y = (e.clientY - rect.top) / canvasState.scale - canvasState.translateY;
        
        // Create node
        createNode(nodeType, x, y, { format: nodeFormat, transformation: nodeTransformation });
    }
    
    function handleCanvasClick(e) {
        if (e.target === canvas) {
            // Deselect nodes when clicking on empty canvas
            canvasState.selectedNode = null;
        }
    }
    
    // Node management
    function createNode(type, x, y, options = {}) {
        console.log('Creating node:', type, x, y, options);
        const nodeId = `node-${canvasState.nextNodeId++}`;
        const nodeElement = document.createElement('div');
        nodeElement.className = `node node-${type}`;
        nodeElement.id = nodeId;
        nodeElement.style.left = `${x}px`;
        nodeElement.style.top = `${y}px`;
        
        // Node content
        let nodeLabel = type;
        if (options.format) nodeLabel = `${options.format} ${type}`;
        if (options.transformation) nodeLabel = `${options.transformation} transformation`;
        
        // Create input port only if not a source type
        const inputPortHtml = type !== 'source' ? 
            `<div class="input-port" data-node-id="${nodeId}" data-port-type="input"></div>` : '';
        
        // Create output port only if not a sink type
        const outputPortHtml = type !== 'sink' ? 
            `<div class="output-port" data-node-id="${nodeId}" data-port-type="output"></div>` : '';
        
        nodeElement.innerHTML = `
            <div class="node-header">
                <div class="node-title">${nodeLabel}</div>
                <div class="node-actions">
                    <span class="node-edit" data-node-id="${nodeId}"><i class="fas fa-cog"></i></span>
                    <span class="node-delete" data-node-id="${nodeId}"><i class="fas fa-times"></i></span>
                </div>
            </div>
            <div class="node-content">
                <div class="node-ports">
                    ${inputPortHtml}
                    ${outputPortHtml}
                </div>
            </div>
        `;
        
        // Add node to canvas
        canvas.appendChild(nodeElement);
        
        // Add node to state
        canvasState.nodes.push({
            id: nodeId,
            type: type,
            x: x,
            y: y,
            data: {
                format: options.format,
                transformation: options.transformation,
                label: nodeLabel,
                config: {}
            }
        });
        
        // Add event listeners
        nodeElement.addEventListener('mousedown', handleNodeMouseDown);
        const editBtn = nodeElement.querySelector('.node-edit');
        if (editBtn) editBtn.addEventListener('click', handleNodeEdit);
        
        const deleteBtn = nodeElement.querySelector('.node-delete');
        if (deleteBtn) deleteBtn.addEventListener('click', handleNodeDelete);
        
        // Add port event listeners
        const inputPort = nodeElement.querySelector('.input-port');
        if (inputPort) {
            inputPort.addEventListener('mousedown', handlePortMouseDown);
        }
        
        const outputPort = nodeElement.querySelector('.output-port');
        if (outputPort) {
            outputPort.addEventListener('mousedown', handlePortMouseDown);
        }
        
        return nodeId;
    }
    
    function handleNodeMouseDown(e) {
        if (e.target.closest('.node-actions')) return;
        
        const nodeElement = e.target.closest('.node');
        if (!nodeElement) return;
        
        canvasState.selectedNode = nodeElement.id;
        canvasState.isDragging = true;
        
        const rect = nodeElement.getBoundingClientRect();
        canvasState.dragOffsetX = e.clientX - rect.left;
        canvasState.dragOffsetY = e.clientY - rect.top;
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }
    
    function handleMouseMove(e) {
        if (!canvasState.isDragging || !canvasState.selectedNode) return;
        
        const nodeElement = document.getElementById(canvasState.selectedNode);
        if (!nodeElement) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - canvasState.dragOffsetX) / canvasState.scale;
        const y = (e.clientY - rect.top - canvasState.dragOffsetY) / canvasState.scale;
        
        nodeElement.style.left = `${x}px`;
        nodeElement.style.top = `${y}px`;
        
        // Update node position in state
        const nodeIndex = canvasState.nodes.findIndex(node => node.id === canvasState.selectedNode);
        if (nodeIndex !== -1) {
            canvasState.nodes[nodeIndex].x = x;
            canvasState.nodes[nodeIndex].y = y;
        }
        
        // Update connected edges
        updateConnectedEdges(canvasState.selectedNode);
    }
    
    function handleMouseUp() {
        canvasState.isDragging = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }
    
    function updateConnectedEdges(nodeId) {
        // Find all edges connected to this node
        const connectedEdges = canvasState.edges.filter(edge => 
            edge.source.nodeId === nodeId || edge.target.nodeId === nodeId);
        
        connectedEdges.forEach(edge => {
            const edgeElement = document.getElementById(edge.id);
            if (!edgeElement) return;
            
            // Get source and target nodes
            const sourceNode = document.getElementById(edge.source.nodeId);
            const targetNode = document.getElementById(edge.target.nodeId);
            if (!sourceNode || !targetNode) return;
            
            // Get port elements
            const sourcePort = sourceNode.querySelector('.output-port');
            const targetPort = targetNode.querySelector('.input-port');
            if (!sourcePort || !targetPort) return;
            
            // Get port positions
            const sourceRect = sourcePort.getBoundingClientRect();
            const targetRect = targetPort.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            
            const startX = sourceRect.left + sourceRect.width / 2 - canvasRect.left;
            const startY = sourceRect.top + sourceRect.height / 2 - canvasRect.top;
            const endX = targetRect.left + targetRect.width / 2 - canvasRect.left;
            const endY = targetRect.top + targetRect.height / 2 - canvasRect.top;
            
            // Update path
            edgeElement.setAttribute('d', `M ${startX} ${startY} C ${startX + 50} ${startY}, ${endX - 50} ${endY}, ${endX} ${endY}`);
        });
    }
    
    function handleNodeEdit(e) {
        const nodeId = e.target.closest('.node-edit').getAttribute('data-node-id');
        const node = canvasState.nodes.find(n => n.id === nodeId);
        
        if (!node) return;
        
        console.log('Edit node:', node);
        // For now, just log the node data
    }
    
    function handleNodeDelete(e) {
        const nodeId = e.target.closest('.node-delete').getAttribute('data-node-id');
        
        // Remove node from DOM
        const nodeElement = document.getElementById(nodeId);
        if (nodeElement) nodeElement.remove();
        
        // Remove node from state
        const nodeIndex = canvasState.nodes.findIndex(node => node.id === nodeId);
        if (nodeIndex !== -1) {
            canvasState.nodes.splice(nodeIndex, 1);
        }
        
        // Remove associated edges
        const edgesToRemove = canvasState.edges.filter(edge => 
            edge.source.nodeId === nodeId || edge.target.nodeId === nodeId);
        
        edgesToRemove.forEach(edge => {
            const edgeElement = document.getElementById(edge.id);
            if (edgeElement) edgeElement.remove();
        });
        
        canvasState.edges = canvasState.edges.filter(edge => 
            edge.source.nodeId !== nodeId && edge.target.nodeId !== nodeId);
        
        console.log('Node deleted:', nodeId);
    }
    
    // Port handling
    function handlePortMouseDown(e) {
        e.stopPropagation(); // Prevent node drag
        
        const portElement = e.target;
        const nodeId = portElement.getAttribute('data-node-id');
        const portType = portElement.getAttribute('data-port-type');
        
        if (!nodeId || !portType) return;
        
        // Start edge creation if it's an output port
        if (portType === 'output') {
            canvasState.edgeStartPort = {
                nodeId: nodeId,
                portType: portType,
                element: portElement
            };
            
            // Create temporary edge
            createTemporaryEdge(portElement);
            
            // Add mouse move and up listeners
            document.addEventListener('mousemove', handleEdgeMouseMove);
            document.addEventListener('mouseup', handleEdgeMouseUp);
        } else if (portType === 'input' && canvasState.edgeStartPort) {
            // Complete edge if we have a start port and this is an input port
            const startNodeId = canvasState.edgeStartPort.nodeId;
            const endNodeId = nodeId;
            
            // Don't connect a node to itself
            if (startNodeId === endNodeId) {
                cancelEdgeCreation();
                return;
            }
            
            // Create permanent edge
            createEdge(canvasState.edgeStartPort.element, portElement);
            
            // Reset edge creation state
            canvasState.edgeStartPort = null;
            
            // Remove temporary edge
            const tempEdge = document.getElementById('temp-edge');
            if (tempEdge) tempEdge.remove();
            
            // Remove event listeners
            document.removeEventListener('mousemove', handleEdgeMouseMove);
            document.removeEventListener('mouseup', handleEdgeMouseUp);
        }
    }
    
    function handleEdgeMouseMove(e) {
        if (!canvasState.edgeStartPort) return;
        
        const tempEdge = document.getElementById('temp-edge');
        if (!tempEdge) return;
        
        // Get start port position
        const startPort = canvasState.edgeStartPort.element;
        const startRect = startPort.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        
        const startX = startRect.left + startRect.width / 2 - canvasRect.left;
        const startY = startRect.top + startRect.height / 2 - canvasRect.top;
        
        // Get current mouse position relative to canvas
        const endX = e.clientX - canvasRect.left;
        const endY = e.clientY - canvasRect.top;
        
        // Update path
        tempEdge.setAttribute('d', `M ${startX} ${startY} C ${startX + 50} ${startY}, ${endX - 50} ${endY}, ${endX} ${endY}`);
    }
    
    function handleEdgeMouseUp(e) {
        // If we're not over an input port, cancel edge creation
        if (e.target.className !== 'input-port') {
            cancelEdgeCreation();
            return;
        }
    }
    
    function cancelEdgeCreation() {
        // Remove temporary edge
        const tempEdge = document.getElementById('temp-edge');
        if (tempEdge) tempEdge.remove();
        
        // Reset edge creation state
        canvasState.edgeStartPort = null;
        
        // Remove event listeners
        document.removeEventListener('mousemove', handleEdgeMouseMove);
        document.removeEventListener('mouseup', handleEdgeMouseUp);
    }
    
    function createTemporaryEdge(startPort) {
        // Create SVG container if it doesn't exist
        let svgContainer = document.getElementById('edge-container');
        if (!svgContainer) {
            svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgContainer.id = 'edge-container';
            svgContainer.style.position = 'absolute';
            svgContainer.style.top = '0';
            svgContainer.style.left = '0';
            svgContainer.style.width = '100%';
            svgContainer.style.height = '100%';
            svgContainer.style.pointerEvents = 'none';
            svgContainer.style.zIndex = '5';
            canvas.appendChild(svgContainer);
        }
        
        // Get start port position
        const startRect = startPort.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        
        const startX = startRect.left + startRect.width / 2 - canvasRect.left;
        const startY = startRect.top + startRect.height / 2 - canvasRect.top;
        
        // Create path element
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.id = 'temp-edge';
        path.setAttribute('d', `M ${startX} ${startY} C ${startX + 50} ${startY}, ${startX + 50} ${startY}, ${startX + 50} ${startY}`);
        path.style.stroke = '#aaa';
        path.style.strokeWidth = '2';
        path.style.fill = 'none';
        path.style.strokeDasharray = '5,5';
        
        svgContainer.appendChild(path);
    }
    
    function createEdge(startPort, endPort) {
        // Create SVG container if it doesn't exist
        let svgContainer = document.getElementById('edge-container');
        if (!svgContainer) {
            svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgContainer.id = 'edge-container';
            svgContainer.style.position = 'absolute';
            svgContainer.style.top = '0';
            svgContainer.style.left = '0';
            svgContainer.style.width = '100%';
            svgContainer.style.height = '100%';
            svgContainer.style.pointerEvents = 'none';
            svgContainer.style.zIndex = '5';
            canvas.appendChild(svgContainer);
        }
        
        // Get port positions
        const startRect = startPort.getBoundingClientRect();
        const endRect = endPort.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        
        const startX = startRect.left + startRect.width / 2 - canvasRect.left;
        const startY = startRect.top + startRect.height / 2 - canvasRect.top;
        const endX = endRect.left + endRect.width / 2 - canvasRect.left;
        const endY = endRect.top + endRect.height / 2 - canvasRect.top;
        
        // Create edge ID
        const edgeId = `edge-${canvasState.nextEdgeId++}`;
        
        // Create path element
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.id = edgeId;
        path.setAttribute('d', `M ${startX} ${startY} C ${startX + 50} ${startY}, ${endX - 50} ${endY}, ${endX} ${endY}`);
        path.style.stroke = '#666';
        path.style.strokeWidth = '2';
        path.style.fill = 'none';
        
        svgContainer.appendChild(path);
        
        // Add edge to state
        const sourceNodeId = startPort.getAttribute('data-node-id');
        const targetNodeId = endPort.getAttribute('data-node-id');
        
        canvasState.edges.push({
            id: edgeId,
            source: {
                nodeId: sourceNodeId,
                portType: 'output'
            },
            target: {
                nodeId: targetNodeId,
                portType: 'input'
            }
        });
        
        console.log('Edge created:', edgeId, sourceNodeId, targetNodeId);
        return edgeId;
    }
    
    // Initialize
    function init() {
        console.log('Initializing pipeline designer');
        
        // Set up toolbar buttons
        setupToolbarButtons();
        
        // Load pipeline if ID is provided in URL
        const pipelineId = getPipelineIdFromUrl();
        if (pipelineId) {
            loadPipeline(pipelineId);
        }
    }
    
    function setupToolbarButtons() {
        // Generate Code button
        const generateCodeBtn = document.getElementById('generate-code-btn');
        if (generateCodeBtn) {
            generateCodeBtn.addEventListener('click', handleGenerateCode);
        }
        
        // Save button
        const saveBtn = document.getElementById('save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', handleSavePipeline);
        }
        
        // Validate button
        const validateBtn = document.getElementById('validate-btn');
        if (validateBtn) {
            validateBtn.addEventListener('click', handleValidatePipeline);
        }
        
        // Deploy button
        const deployBtn = document.getElementById('deploy-btn');
        if (deployBtn) {
            deployBtn.addEventListener('click', handleDeployPipeline);
        }
        
        // Back button
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.location.href = '/dashboard';
            });
        }
    }
    
    function getPipelineIdFromUrl() {
        const pathParts = window.location.pathname.split('/');
        return pathParts[pathParts.length - 1] !== 'pipeline-designer' ? pathParts[pathParts.length - 1] : null;
    }
    
    function loadPipeline(pipelineId) {
        fetch(`/api/pipelines/${pipelineId}`)
            .then(response => response.json())
            .then(data => {
                // Set pipeline name
                const pipelineNameInput = document.getElementById('pipeline-name');
                if (pipelineNameInput && data.name) {
                    pipelineNameInput.value = data.name;
                }
                
                // Load nodes and edges
                if (data.nodes && data.nodes.length > 0) {
                    // Clear placeholder
                    const placeholder = document.querySelector('.canvas-placeholder');
                    if (placeholder) placeholder.style.display = 'none';
                    
                    // Create nodes
                    data.nodes.forEach(node => {
                        createNode(node.type, node.x, node.y, {
                            format: node.data?.format,
                            transformation: node.data?.transformation,
                            config: node.data?.config || {}
                        });
                    });
                    
                    // Create edges
                    if (data.edges && data.edges.length > 0) {
                        data.edges.forEach(edge => {
                            const sourceNode = document.getElementById(edge.source);
                            const targetNode = document.getElementById(edge.target);
                            if (sourceNode && targetNode) {
                                const sourcePort = sourceNode.querySelector('.output-port');
                                const targetPort = targetNode.querySelector('.input-port');
                                if (sourcePort && targetPort) {
                                    createEdge(sourcePort, targetPort);
                                }
                            }
                        });
                    }
                }
            })
            .catch(error => {
                console.error('Error loading pipeline:', error);
                showToast('Error loading pipeline', 'error');
            });
    }
    
    function handleGenerateCode() {
        // Check if we have nodes
        if (canvasState.nodes.length === 0) {
            showToast('No nodes to generate code from', 'error');
            return;
        }
        
        // Get pipeline name
        const pipelineName = document.getElementById('pipeline-name').value || 'Untitled Pipeline';
        
        // Prepare data for API
        const data = {
            nodes: canvasState.nodes,
            edges: canvasState.edges,
            pipelineName: pipelineName
        };
        
        // Call API to generate code
        fetch('/api/pipeline/generate-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            if (data.code) {
                // Show code in modal
                const codePreview = document.getElementById('code-preview');
                if (codePreview) {
                    codePreview.textContent = data.code;
                }
                
                // Show modal
                const modal = document.getElementById('code-preview-modal');
                if (modal) {
                    modal.style.display = 'block';
                }
                
                // Set up copy button
                const copyBtn = document.getElementById('copy-code');
                if (copyBtn) {
                    copyBtn.onclick = function() {
                        navigator.clipboard.writeText(data.code)
                            .then(() => {
                                showToast('Code copied to clipboard', 'success');
                            })
                            .catch(err => {
                                console.error('Error copying code:', err);
                                showToast('Error copying code', 'error');
                            });
                    };
                }
                
                // Set up download button
                const downloadBtn = document.getElementById('download-code');
                if (downloadBtn) {
                    downloadBtn.onclick = function() {
                        const blob = new Blob([data.code], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${pipelineName.replace(/\s+/g, '_').toLowerCase()}.py`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    };
                }
                
                // Set up close button
                const closeBtn = document.getElementById('close-code-preview');
                if (closeBtn) {
                    closeBtn.onclick = function() {
                        modal.style.display = 'none';
                    };
                }
            } else {
                showToast('Error generating code', 'error');
            }
        })
        .catch(error => {
            console.error('Error generating code:', error);
            showToast('Error generating code', 'error');
        });
    }
    
    function handleSavePipeline() {
        // Get pipeline name
        const pipelineName = document.getElementById('pipeline-name').value || 'Untitled Pipeline';
        
        // Get pipeline ID from URL if available
        const pipelineId = getPipelineIdFromUrl();
        
        // Prepare data for API
        const data = {
            id: pipelineId,
            name: pipelineName,
            nodes: canvasState.nodes,
            edges: canvasState.edges
        };
        
        // Call API to save pipeline
        fetch('/api/pipeline/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast('Pipeline saved successfully', 'success');
                
                // Update URL if this is a new pipeline
                if (!pipelineId && data.pipeline && data.pipeline.id) {
                    window.history.replaceState(
                        {}, 
                        document.title, 
                        `/pipeline-designer/${data.pipeline.id}`
                    );
                }
            } else {
                showToast(data.message || 'Error saving pipeline', 'error');
            }
        })
        .catch(error => {
            console.error('Error saving pipeline:', error);
            showToast('Error saving pipeline', 'error');
        });
    }
    
    function handleValidatePipeline() {
        // Check if we have nodes
        if (canvasState.nodes.length === 0) {
            showToast('No nodes to validate', 'error');
            return;
        }
        
        // Prepare data for API
        const data = {
            nodes: canvasState.nodes,
            edges: canvasState.edges
        };
        
        // Call API to validate pipeline
        fetch('/api/pipeline/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            if (data.valid) {
                showToast('Pipeline validation successful', 'success');
            } else {
                let message = 'Pipeline validation failed';
                if (data.issues && data.issues.length > 0) {
                    message += `: ${data.issues[0].message}`;
                }
                showToast(message, 'error');
            }
        })
        .catch(error => {
            console.error('Error validating pipeline:', error);
            showToast('Error validating pipeline', 'error');
        });
    }
    
    function handleDeployPipeline() {
        // First save the pipeline
        handleSavePipeline();
        
        // Then generate code
        handleGenerateCode();
        
        // Show toast
        showToast('Pipeline deployment initiated', 'info');
    }
    
    function showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        // Set message and type
        toast.textContent = message;
        toast.className = `toast ${type}`;
        
        // Show toast
        toast.classList.add('show');
        
        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    init();
});
