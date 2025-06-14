// JavaScript to handle interactivity: selection highlighting, score updates, and info panel.
    // Data structures for graph relationships and initial scores:
    const edges = [
        // Each edge: {source: "NodeName", target: "NodeName", weight: X}
        // Positive influence edges (weight +):
        {source: "Organic amendments", target: "Soil OM", weight: 10},
        {source: "Organic amendments", target: "Detritivores", weight: 5},
        {source: "Organic amendments", target: "Microbial diversity", weight: 5},
        {source: "Internal inputs", target: "Soil OM", weight: 8},
        {source: "Internal inputs", target: "Decomposition", weight: 5},
        {source: "Occasional tillage", target: "Detritivores", weight: 5},
        {source: "Occasional tillage", target: "Soil structure", weight: 5},
        {source: "Cover crops (soil health)", target: "Soil OM", weight: 7},
        {source: "Cover crops (soil health)", target: "Nutrient availability", weight: 5},
        {source: "Cover crops (soil health)", target: "Microbial diversity", weight: 3},
        {source: "Cover crops (soil health)", target: "Weeds", weight: -5}, // suppresses weeds (negative effect on weeds)
        {source: "Cover crops (biodiversity)", target: "Pollinators", weight: 8},
        {source: "Cover crops (biodiversity)", target: "Natural enemies", weight: 5},
        {source: "Cover crops (biodiversity)", target: "Pests", weight: -3}, // slight pest suppression via habitat
        {source: "Biofortification", target: "Crop health", weight: 5},
        {source: "IPDM", target: "Pests", weight: -10},      // reduces pests
        {source: "IPDM", target: "Pathogens", weight: -8},   // reduces disease
        {source: "Cultural control", target: "Weeds", weight: -7}, // reduces weeds
        {source: "Semi-natural habitat", target: "Natural enemies", weight: 7},
        {source: "Semi-natural habitat", target: "Pollinators", weight: 7},
        {source: "Diversified cropping", target: "Legumes (BNF)", weight: 10},
        {source: "Diversified cropping", target: "Microbial diversity", weight: 4},
        {source: "Diversified cropping", target: "Pathogens", weight: -6}, // crop rotation breaks disease cycles
        {source: "Diversified cropping", target: "Pests", weight: -4},
        {source: "Nutrient budgeting", target: "Nutrient uptake", weight: 6},
        // Indirect influence edges (within system components):
        {source: "Detritivores", target: "Soil structure", weight: 5},
        {source: "Detritivores", target: "Decomposition", weight: 3},
        {source: "Microbial diversity", target: "Decomposition", weight: 4},
        {source: "Microbial diversity", target: "Soil structure", weight: 2},
        {source: "Decomposition", target: "Nutrient availability", weight: 6},
        {source: "Legumes (BNF)", target: "Nutrient availability", weight: 8},
        {source: "Soil structure", target: "Roots", weight: 5},
        {source: "Roots", target: "Nutrient uptake", weight: 5},
        {source: "Nutrient availability", target: "Nutrient uptake", weight: 5},
        {source: "Nutrient uptake", target: "Crop health", weight: 5},
        {source: "Crop health", target: "Crop yield", weight: 10},
        {source: "Pollinators", target: "Crop yield", weight: 5},
        {source: "Weeds", target: "Crop yield", weight: -8},
        {source: "Pests", target: "Crop health", weight: -6},
        {source: "Pathogens", target: "Crop health", weight: -6}
      ];
  
      // Initial baseline scores for each node (out of 100 for demonstration).
      const baseScores = {
        "Organic amendments": 0, "Internal inputs": 0, "Occasional tillage": 0,
        "Cover crops (soil health)": 0, "Cover crops (biodiversity)": 0,
        "Biofortification": 0, "IPDM": 0, "Cultural control": 0,
        "Semi-natural habitat": 0, "Nutrient budgeting": 0, "Diversified cropping": 0,
        "Detritivores": 50, "Soil structure": 50, "Roots": 50,
        "Microbial diversity": 50, "Soil OM": 50, "Nutrient availability": 50,
        "Nutrient uptake": 50, "Crop health": 50, "Crop yield": 50,
        "Pathogens": 50, "Pests": 50, "Natural enemies": 50,
        "Weeds": 50, "Pollinators": 50, "Decomposition": 50,
        "Legumes (BNF)": 50, "Field margins": 50
      };
      // Note: Management nodes might not need "scores" in the same sense; baseScores for them set to 0 (not used for display except as triggers).
  
      // Utility: Update all node score indicators (circle color) based on current scores
      function updateScoreIndicators(currentScores) {
        for (let node in currentScores) {
          const score = currentScores[node];
          // Determine color from red (0) to green (100) scale:
          const hue = (score / 100) * 120; // 0 -> 120 (red to green)
          const color = `hsl(${hue}, 70%, 50%)`;
          // Select the circle indicator for this node and update its fill color
          const circle = document.querySelector(`#node-${CSS.escape(node)} .score-indicator`);
          if (circle) {
            circle.setAttribute("fill", color);
          }
        }
      }
  
      // Initial score indicator coloring
      updateScoreIndicators(baseScores);
  
      // Handle selection of management options
      const checkboxes = document.querySelectorAll('.sidebar-left input[type="checkbox"]');
      checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
          const selectedOptions = Array.from(checkboxes)
                                       .filter(c => c.checked)
                                       .map(c => c.value);
          // Highlight nodes and links based on selected options
          applyHighlights(selectedOptions);
          // Recalculate scores based on selected options
          const newScores = calculateScores(selectedOptions);
          updateScoreIndicators(newScores);
          // Update overall impact summary (placeholder logic)
          updateOverallImpact(selectedOptions);
        });
      });
  
      // Function to apply highlight classes to nodes and links for selected options
      function applyHighlights(selectedOptions) {
        // First remove any existing highlight classes
        document.querySelectorAll('.node').forEach(nodeEl => {
          nodeEl.classList.remove('highlight', 'highlight-secondary');
        });
        document.querySelectorAll('.link').forEach(linkEl => {
          linkEl.classList.remove('highlight');
        });
        // If no selection, nothing to highlight
        if (selectedOptions.length === 0) return;
        // For each selected management option:
        selectedOptions.forEach(option => {
          const nodeId = `#node-${CSS.escape(option)}`;
          const nodeEl = document.querySelector(nodeId);
          if (nodeEl) {
            nodeEl.classList.add('highlight');  // highlight selected node
          }
          // Find direct edges from this option
          edges.filter(e => e.source === option).forEach(edge => {
            // Highlight link from source to target
            const linkId = `#link-${edge.source.split(' ').join('').replace(/[^a-zA-Z0-9]/g,'')}-${edge.target.split(' ').join('').replace(/[^a-zA-Z0-9]/g,'')}`;
            const linkEl = document.querySelector(linkId);
