// Function to open a modal (detailed view) for a section
function openModal(section) {
  const modal = document.getElementById(`modal-${section}`);
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

// Function to close the modal for a section
function closeModal(section) {
  const modal = document.getElementById(`modal-${section}`);
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

// Helper: show info modal (if used for pop-ups on effects or fields)
function showInfo(text) {
  const modal = document.getElementById('infoModal');
  const modalText = document.getElementById('modalText');
  modalText.textContent = text;
  modal.style.display = 'flex';
}

// Event listener for closing info modal when clicking outside the content
window.onclick = function(event) {
  const modal = document.getElementById('infoModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

// Update effect highlights and impact score when an option checkbox is toggled
function updateEffectsAndImpact(checkbox) {
  const row = checkbox.closest('tr');
  if (!row) return;
  const effects = row.querySelectorAll('.effect');
  const impactIndicator = row.querySelector('.impact-score');

  if (checkbox.checked) {
    effects.forEach(effect => {
      const impactType = effect.getAttribute('data-impact'); // "pos" or "neg"
      if (impactType === 'pos') {
        effect.classList.add('positive');
        effect.classList.remove('negative');
      } else if (impactType === 'neg') {
        effect.classList.add('negative');
        effect.classList.remove('positive');
      }
    });
    let hasNeg = false, hasPos = false;
    effects.forEach(effect => {
      if (effect.classList.contains('positive')) hasPos = true;
      if (effect.classList.contains('negative')) hasNeg = true;
    });
    if (hasNeg && !hasPos) {
      impactIndicator.classList.add('red');
      impactIndicator.classList.remove('green', 'yellow');
      impactIndicator.textContent = '●';
    } else if (hasPos && !hasNeg) {
      impactIndicator.classList.add('green');
      impactIndicator.classList.remove('red', 'yellow');
      impactIndicator.textContent = '●';
    } else if (hasPos && hasNeg) {
      impactIndicator.classList.add('yellow');
      impactIndicator.classList.remove('red', 'green');
      impactIndicator.textContent = '●';
    } else {
      impactIndicator.classList.remove('red', 'green', 'yellow');
      impactIndicator.textContent = '●';
    }
  } else {
    effects.forEach(effect => {
      effect.classList.remove('positive', 'negative');
    });
    impactIndicator.classList.remove('red', 'green', 'yellow');
    impactIndicator.textContent = '●';
  }
}

// Attach event listeners to all option checkboxes
document.querySelectorAll('.opt-checkbox').forEach(cb => {
  cb.addEventListener('change', function() {
    updateEffectsAndImpact(this);
  });
});

// Attach click event to each effect span for info pop-up
document.querySelectorAll('.effect').forEach(effectSpan => {
  effectSpan.addEventListener('click', function() {
    const target = effectSpan.getAttribute('data-target');
    const impactType = effectSpan.getAttribute('data-impact');
    let message = '';
    if (impactType === 'pos') {
      message = target + " is positively affected by this management option.";
    } else if (impactType === 'neg') {
      message = target + " is negatively affected by this management option.";
    } else {
      message = target + " may be affected by this option.";
    }
    showInfo(message);
  });
});

// Attach click events to image map areas (if used)
document.querySelectorAll('area[data-field]').forEach(area => {
  area.addEventListener('click', function(event) {
    event.preventDefault();
    const fieldName = area.getAttribute('data-field');
    let fieldInfo;
    switch(fieldName) {
      case 'Field 1':
        fieldInfo = "Field 1 Status:\n- Current: Wheat (sown Spring 2025)\n- Last season: Cover crop (clover)";
        break;
      case 'Field 2':
        fieldInfo = "Field 2 Status:\n- Current: Fallow/Green manure\n- Last season: Winter Barley (stubble)";
        break;
      case 'Field 3':
        fieldInfo = "Field 3 Status:\n- Current: Potatoes (planted)\n- Last season: Wheat";
        break;
      case 'Field 4':
        fieldInfo = "Field 4 Status:\n- Current: Pasture (grazed)\n- Last season: Pasture";
        break;
      default:
        fieldInfo = fieldName + " details are not available.";
    }
    showInfo(fieldInfo);
  });
});
