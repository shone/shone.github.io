"use strict";

const now = new Date();

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
function bendTime(t) {
  return t*t*t*t;
}

const timelineStart = 1989 + ((1/12)*9) + ((1/365)*26);
const timelineEnd = datetimeToYearFloat(now);

function yearToTimelinePercentage(year) {
  return 100 * bendTime((year - timelineStart) / (timelineEnd - timelineStart));
}

const timelineHeader = document.getElementById('timeline-header');
for (let year = 1989; year < now.getFullYear()+1; year++) {
  timelineHeader.insertAdjacentHTML('beforeend', `
    <span class="timeline-block" data-start="01.01.${year}" data-end="01.01.${year+1}">
      ${year < now.getFullYear() ? year : ''}
    </span>
  `);
}

for (let block of document.getElementsByClassName('timeline-block')) {
  const startYear = timeStringToYear(block.dataset.start);
  const endYear   = timeStringToYear(block.dataset.end);
  block.style.left = yearToTimelinePercentage(startYear) + '%';
  if (startYear > 1989) {
    block.style.width = (yearToTimelinePercentage(endYear) - yearToTimelinePercentage(startYear)) + '%';
  }
  if (!block.closest('#timeline-header') && !block.hasAttribute('nomarkers')) {
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
    block.insertAdjacentHTML('beforeend', `<div class="date-marker start"> <span>${startDisplayText}</span> </div>`);
    if (block.dataset.end !== 'now') {
      const endDisplayText = block.dataset.end.split('.').slice(0, 2).join('.');
      block.insertAdjacentHTML('beforeend', `<div class="date-marker end"> <span>${endDisplayText}</span> </div>`);
    }
  }
}

function adjustTimelineForWindowSize() {
  const yearLabelWidthPx = 50;
  for (let block of timelineHeader.getElementsByClassName('timeline-block')) {
    block.classList.toggle('hide-text', (block.textContent.trim() !== '1989') && (block.getBoundingClientRect().width < yearLabelWidthPx));
  }
  for (let block of document.getElementsByClassName('timeline-block')) {
    const startMarker = block.querySelector('.date-marker.start span');
    const endMarker   = block.querySelector('.date-marker.end span');
    if (startMarker && endMarker) {
      const blockWidth = block.getBoundingClientRect().width;
      const markerWidth = startMarker.getBoundingClientRect().width;
      const distanceBetweenMarkers = blockWidth - markerWidth;
      if (distanceBetweenMarkers < 15) {
        startMarker.style.marginRight = (15 - distanceBetweenMarkers) + 'px';
        endMarker.style.marginLeft    = (15 - distanceBetweenMarkers) + 'px';
      }
    }
  }
}
adjustTimelineForWindowSize();
window.onresize = adjustTimelineForWindowSize;
