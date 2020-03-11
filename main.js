"use strict";

// Setup header
const h1Element = document.querySelector('h1');
function updateH1CollapsedState() {
  h1Element.classList.toggle('collapsed', (document.documentElement.scrollTop || document.body.scrollTop) > 30);
}
updateH1CollapsedState();
window.addEventListener('scroll', updateH1CollapsedState, {passive: true});
h1Element.onclick = () => {
  if (!document.querySelector('h1').classList.contains('collapsed')) {
    location.reload();
  }
}

const now = new Date();
const timelineStart = 1989 + ((1/12)*9) + ((1/365)*26);
const timelineEnd = datetimeToYearFloat(now);

// Setup timeline header/background
const timelineHeader     = document.getElementById('timeline-header');
const timelineBackground = document.getElementById('timeline-background');
for (let year = 1989; year < now.getFullYear()+1; year++) {
  timelineHeader.insertAdjacentHTML('beforeend', `
    <span class="timeline-block" data-start="01.01.${year}" data-end="01.01.${year+1}">
      ${year < now.getFullYear() ? year : ''}
    </span>
  `);
  timelineBackground.insertAdjacentHTML('beforeend', `
    <span class="timeline-block" data-start="01.01.${year}" data-end="01.01.${year+1}"></span>
  `);
}

// Setup timeline blocks
for (const block of document.getElementsByClassName('timeline-block')) {
  const startYear = timeStringToYear(block.dataset.start);
  const endYear   = timeStringToYear(block.dataset.end);

  // Set position
  block.style.left = yearToTimelinePercentage(startYear) + '%';
  if (startYear > 1989) {
    block.style.width = (yearToTimelinePercentage(endYear) - yearToTimelinePercentage(startYear)) + '%';
  }

  // Set label
  if (block.hasAttribute('show-labels')) {
    const durationText = document.createElement('div');
    durationText.classList.add('duration');
    durationText.classList.toggle('right-aligned', block.dataset.end === 'now');
    const duration = endYear - startYear;
    const years = Math.floor(duration);
    const months = Math.round((duration%1) * 12);
    if (duration < 1) {
      durationText.textContent = `${months} month${months>=2 ? 's' : ''}`;
    } else if (months > 0) {
      durationText.textContent = `${years} year${years>=2?'s':''}, ${months} month${months>=2 ? 's' : ''}`;
    } else {
      durationText.textContent = `${years} year${years>=2?'s':''}`;
    }
    block.appendChild(durationText);
    const startDisplayText = block.dataset.start.split('.').slice(0, 2).join('.');
    block.insertAdjacentHTML('beforeend', `<div class="date-label start"> <span>${startDisplayText}</span> </div>`);
    if (block.dataset.end !== 'now') {
      const endDisplayText = block.dataset.end.split('.').slice(0, 2).join('.');
      block.insertAdjacentHTML('beforeend', `<div class="date-label end"> <span>${endDisplayText}</span> </div>`);
    }
  }
}

function datetimeToYearFloat(datetime) {
  return datetime.getFullYear() + ((1/12)*datetime.getMonth()) + ((1/365)*datetime.getDay());
}
function timeStringToYear(string) {
  if (string === 'now') {
    return datetimeToYearFloat(now);
  } else {
    const [day, month, year] = string.split('.').map(s => parseInt(s));
    return year + ((month-1) * 1/12) + ((day-1) * 1/365);
  }
}

function yearToTimelinePercentage(year) {
  const ratio = (year - timelineStart) / (timelineEnd - timelineStart);
  const ratioWithPowerCurve = ratio*ratio*ratio*ratio; // So that recent events are given more space
  return ratioWithPowerCurve * 100;
}

function adjustTimelineForWindowSize() {
  // Hide/show each timeline header label depending if there's enough space
  const yearLabelWidthPx = 50;
  for (const block of timelineHeader.getElementsByClassName('timeline-block')) {
    block.classList.toggle('hide-text', (block.textContent.trim() !== '1989') && (block.getBoundingClientRect().width < yearLabelWidthPx));
  }

  // Move start/end labels to ensure they don't overlap
  const minLabelMargin = 15;
  for (const block of document.getElementsByClassName('timeline-block')) {
    const startLabel = block.querySelector('.date-label.start span');
    const endLabel   = block.querySelector('.date-label.end span');
    if (startLabel && endLabel) {
      const blockWidth = block.getBoundingClientRect().width;
      const labelWidth = startLabel.getBoundingClientRect().width;
      const distanceBetweenLabels = blockWidth - labelWidth;
      if (distanceBetweenLabels < minLabelMargin) {
        startLabel.style.marginRight = (minLabelMargin - distanceBetweenLabels) + 'px';
        endLabel.style.marginLeft    = (minLabelMargin - distanceBetweenLabels) + 'px';
      }
    }
  }
}
adjustTimelineForWindowSize();
window.onresize = adjustTimelineForWindowSize;
