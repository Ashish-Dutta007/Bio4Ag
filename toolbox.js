document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.opt-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', handleOptionChange);
    });
  });
  
  /**
   * handleOptionChange:
   * 1) Parse data-effects and data-knockon attributes for the checkbox.
   * 2) Highlight direct/knock-on effects in green (pos) or red (neg).
   * 3) Update row-level impact score circle.
   * 4) Update the overall system impact panel (dummy logic).
   */
  function handleOptionChange(event) {
    const checkbox = event.target;
    const row = checkbox.closest('tr');
    const directTd = row.querySelector('.direct-effects');
    const knockonTd = row.querySelector('.knockon-effects');
    const secondaryTd = row.querySelector('.secondary-effects');
    const impactCircle = row.querySelector('.impact-score');
  
    // Reset all effects in this row to neutral
    directTd.querySelectorAll('.effect').forEach(e => e.className = 'effect neutral');
    knockonTd.querySelectorAll('.effect').forEach(e => e.className = 'effect neutral');
    if (secondaryTd) {
      secondaryTd.querySelectorAll('.effect').forEach(e => e.className = 'effect neutral');
    }
    impactCircle.className = 'impact-score';
  
    if (checkbox.checked) {
      // If checked, parse the data attributes for "pos" or "neg"
      const directList = checkbox.getAttribute('data-effects') || '';
      const knockonList = checkbox.getAttribute('data-knockon') || '';
  
      // For direct effects
      directList.split(',').forEach(effectItem => {
        const [impactType, effectName] = effectItem.split(':'); 
        highlightEffect(directTd, effectName.trim(), impactType.trim());
      });
  
      // For knock-on effects
      knockonList.split(',').forEach(effectItem => {
        const [impactType, effectName] = effectItem.split(':'); 
        // We can decide if 1° or 2° in-field effects appear in knockonTd or secondaryTd
        // For simplicity, let's put them in knockonTd if they exist there, else secondaryTd
        if (knockonTd && knockonTd.textContent.includes(effectName.trim())) {
          highlightEffect(knockonTd, effectName.trim(), impactType.trim());
        } else if (secondaryTd && secondaryTd.textContent.includes(effectName.trim())) {
          highlightEffect(secondaryTd, effectName.trim(), impactType.trim());
        }
      });
  
      // Simple logic to color the row-level impact circle
      // If we see any negative effect, color circle red, else green
      const hasNegative = row.querySelector('.effect.negative');
      if (hasNegative) {
        impactCircle.classList.add('red');
      } else {
        impactCircle.classList.add('green');
      }
    }
  
    // Update the overall system impact panel (dummy approach)
    recalcSystemImpact();
  }
  
  /**
   * highlightEffect: Finds a span with matching text and sets its class to positive or negative.
   */
  function highlightEffect(container, effectName, impactType) {
    const spans = container.querySelectorAll('.effect');
    spans.forEach(span => {
      if (span.textContent.trim().toLowerCase() === effectName.toLowerCase()) {
        span.classList.remove('neutral');
        if (impactType === 'pos') {
          span.classList.add('positive');
        } else if (impactType === 'neg') {
          span.classList.add('negative');
        }
      }
    });
  }
  
  /**
   * recalcSystemImpact:
   * A simple placeholder function that toggles some system impact bars to show how they might change.
   * In a real app, you'd do an actual calculation or scoring logic based on selected options.
   */
  function recalcSystemImpact() {
    // Example: If cover-crop is selected, GHG goes green, yield is yellow, etc.
    // We'll just do random color changes for demonstration:
    const categories = ['impact-ghg', 'impact-biodiversity', 'impact-carbon', 'impact-pollution', 'impact-financial', 'impact-yield'];
    const colors = ['neutral','green','red','yellow'];
    categories.forEach(cat => {
      const el = document.getElementById(cat);
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      el.className = 'bar-segment ' + randomColor;
      el.textContent = randomColor === 'neutral'
        ? 'Neutral'
        : (randomColor === 'green' ? 'Improved' : (randomColor === 'red' ? 'Worse' : 'Mixed'));
    });
    // Overall Score
    const overall = document.getElementById('impact-overall');
    const overallColor = colors[Math.floor(Math.random() * colors.length)];
    overall.className = 'bar-segment ' + overallColor;
    overall.textContent = (overallColor === 'neutral') ? 'Neutral' 
      : (overallColor === 'green' ? 'Good' : (overallColor === 'red' ? 'Poor' : 'Mixed'));
  }
  