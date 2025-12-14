// Calendar functionality
const months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
];

const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

// Sample events - in a real application, this would come from a backend
const events = [
    { date: '2024-03-15', title: 'Schulfest 2024', type: 'event', description: 'Am 15. Juni laden wir alle Schüler, Eltern und Interessierte zu unserem jährlichen Schulfest ein.' },
    { date: '2024-03-20', title: 'Infoveranstaltung für Fünftklässler', type: 'event', description: 'Weitere Informationen für neue Fünftklässler und ihre Eltern.' },
    { date: '2024-03-25', title: 'Projektabgabe', type: 'deadline', description: 'Abgabetermin für die Projektarbeit.' },
    { date: '2024-04-05', title: 'Mathematik-Klausur', type: 'exam', description: 'Klausur in Mathematik für die Oberstufe.' },
    { date: '2024-04-10', title: 'Osterferien', type: 'holiday', description: 'Osterferien - Schulferien' },
    { date: '2024-04-11', title: 'Osterferien', type: 'holiday', description: 'Osterferien - Schulferien' },
    { date: '2024-04-12', title: 'Osterferien', type: 'holiday', description: 'Osterferien - Schulferien' },
    { date: '2024-04-13', title: 'Osterferien', type: 'holiday', description: 'Osterferien - Schulferien' },
    { date: '2024-04-14', title: 'Osterferien', type: 'holiday', description: 'Osterferien - Schulferien' },
    { date: '2024-04-17', title: 'Osterferien', type: 'holiday', description: 'Osterferien - Schulferien' },
    { date: '2024-04-18', title: 'Osterferien', type: 'holiday', description: 'Osterferien - Schulferien' },
    { date: '2024-04-19', title: 'Osterferien', type: 'holiday', description: 'Osterferien - Schulferien' },
    { date: '2024-04-20', title: 'Osterferien', type: 'holiday', description: 'Osterferien - Schulferien' },
    { date: '2024-04-21', title: 'Osterferien', type: 'holiday', description: 'Osterferien - Schulferien' },
    { date: '2024-06-15', title: 'Schulfest 2024', type: 'event', description: 'Jährliches Schulfest mit Aufführungen und Aktivitäten.' },
];

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Initialize calendar
function initCalendar() {
    renderCalendar();
    updateEventList();
    
    // Event listeners
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
        updateEventList();
    });
    
    document.getElementById('nextMonth').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
        updateEventList();
    });
    
    document.getElementById('todayBtn').addEventListener('click', () => {
        const today = new Date();
        currentMonth = today.getMonth();
        currentYear = today.getFullYear();
        renderCalendar();
        updateEventList();
    });
    
    // Filter checkboxes
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            renderCalendar();
            updateEventList();
        });
    });
}

function renderCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthYear = document.getElementById('currentMonthYear');
    
    // Update header
    currentMonthYear.textContent = `${months[currentMonth]} ${currentYear}`;
    
    // Clear grid
    calendarGrid.innerHTML = '';
    
    // Add weekday headers
    weekDays.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Convert Sunday (0) to Monday (0)
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Get active filters
    const activeFilters = Array.from(document.querySelectorAll('.filter-checkbox:checked'))
        .map(cb => cb.dataset.type);
    
    // Add days of the month
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dayElement.className = 'calendar-day';
        dayElement.dataset.date = dateStr;
        
        // Check if it's today
        if (isCurrentMonth && day === today.getDate()) {
            dayElement.classList.add('today');
        }
        
        // Add day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);
        
        // Add events for this day
        const dayEvents = events.filter(event => {
            return event.date === dateStr && activeFilters.includes(event.type);
        });
        
        if (dayEvents.length > 0) {
            dayElement.classList.add('has-events');
            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'day-events';
            
            dayEvents.forEach(event => {
                const eventDot = document.createElement('div');
                eventDot.className = `event-dot event-${event.type}`;
                eventDot.title = event.title;
                eventsContainer.appendChild(eventDot);
            });
            
            dayElement.appendChild(eventsContainer);
        }
        
        calendarGrid.appendChild(dayElement);
    }
    
    // Fill remaining cells to complete the grid (up to 42 cells total for 6 weeks)
    const totalCells = calendarGrid.children.length;
    const remainingCells = 42 - totalCells;
    for (let i = 0; i < remainingCells; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
}

function updateEventList() {
    const eventsListContent = document.getElementById('eventsListContent');
    const activeFilters = Array.from(document.querySelectorAll('.filter-checkbox:checked'))
        .map(cb => cb.dataset.type);
    
    // Get events for current month
    const monthEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getMonth() === currentMonth && 
               eventDate.getFullYear() === currentYear &&
               activeFilters.includes(event.type);
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Clear list
    eventsListContent.innerHTML = '';
    
    if (monthEvents.length === 0) {
        eventsListContent.innerHTML = '<p class="no-events">Keine Termine für diesen Monat.</p>';
        return;
    }
    
    // Group events by date
    const eventsByDate = {};
    monthEvents.forEach(event => {
        if (!eventsByDate[event.date]) {
            eventsByDate[event.date] = [];
        }
        eventsByDate[event.date].push(event);
    });
    
    // Render events
    Object.keys(eventsByDate).sort().forEach(date => {
        const dateEvents = eventsByDate[date];
        const eventDate = new Date(date);
        const dateStr = `${String(eventDate.getDate()).padStart(2, '0')}.${String(eventDate.getMonth() + 1).padStart(2, '0')}.${eventDate.getFullYear()}`;
        
        dateEvents.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';
            eventItem.innerHTML = `
                <div class="event-date">${dateStr}</div>
                <div class="event-details">
                    <div class="event-title">${event.title}</div>
                    <div class="event-type event-type-${event.type}">${getEventTypeLabel(event.type)}</div>
                </div>
            `;
            eventsListContent.appendChild(eventItem);
        });
    });
}

function getEventTypeLabel(type) {
    const labels = {
        'event': 'Veranstaltung',
        'holiday': 'Ferien',
        'deadline': 'Abgabetermin',
        'exam': 'Klausur'
    };
    return labels[type] || type;
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalendar);
} else {
    initCalendar();
}
