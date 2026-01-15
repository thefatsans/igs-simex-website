// Klassenarbeit Timer und Notenberechnung

// Timer-Konfiguration
let EXAM_DURATION_MINUTES = 90; // Standard: 90 Minuten
const TIMER_STORAGE_KEY = 'exam_timer_start';
const EXAM_STARTED_KEY = 'exam_started';
const EXAM_SUBMITTED_KEY = 'exam_submitted';
const SELECTED_EXAM_KEY = 'selected_exam_id';
const SELECTED_DIFFICULTY_KEY = 'selected_difficulty';
const EXTRA_TIME_USED_KEY = 'extra_time_used';
const HINT_USED_KEY = 'hint_used';
const HINT_QUESTION_KEY = 'hint_question_id';

// Notenberechnung (deutsches System)
const GRADE_SCALE = {
    1: { min: 92, max: 100, label: 'Sehr gut', emoji: '🎉' },
    2: { min: 81, max: 91, label: 'Gut', emoji: '👍' },
    3: { min: 67, max: 80, label: 'Befriedigend', emoji: '😐' },
    4: { min: 50, max: 66, label: 'Ausreichend', emoji: '😕' },
    5: { min: 30, max: 49, label: 'Mangelhaft', emoji: '😢' },
    6: { min: 0, max: 29, label: 'Ungenügend', emoji: '💀' },
    7: { min: -1, max: -1, label: 'Stinkig', emoji: '☠️' } // Für sehr schlechte Leistungen
};

// Verfügbare Klassenarbeiten - werden dynamisch aus MATH_EXAM_DIFFICULTIES erstellt
let AVAILABLE_EXAMS = [];

// Initialisiere Arbeiten aus Schwierigkeitsstufen
function initializeExams() {
    if (typeof MATH_EXAM_DIFFICULTIES !== 'undefined') {
        AVAILABLE_EXAMS = Object.keys(MATH_EXAM_DIFFICULTIES).map(level => {
            const diff = MATH_EXAM_DIFFICULTIES[level];
            return {
                id: `math-brueche-${level}`,
                title: `Mathematik: Brüche - ${diff.name}`,
                subject: 'Mathematik',
                duration: 45,
                description: diff.description || '',
                difficulty: parseInt(level),
                difficultyName: diff.name,
                emoji: diff.emoji,
                questions: diff.questions || []
            };
        });
    }
}

// Beispiel-Fragen (wird später durch echte Fragen ersetzt)
let examQuestions = [];
let selectedExam = null;
let selectedDifficulty = null;
let extraTimeUsed = false;
let hintUsed = false;
let hintQuestionId = null;
let extraTimeAdded = 0; // Sekunden

// Auswahlseite anzeigen
function showExamSelection() {
    const selectionContainer = document.getElementById('examSelectionContainer');
    const examContainer = document.getElementById('klassenarbeitContainer');
    
    selectionContainer.classList.remove('hidden');
    examContainer.classList.add('hidden');
    
    const examGrid = document.getElementById('examGrid');
    examGrid.innerHTML = '';
    
    // Initialisiere Arbeiten falls noch nicht geschehen
    if (AVAILABLE_EXAMS.length === 0) {
        initializeExams();
    }
    
    AVAILABLE_EXAMS.forEach(exam => {
        const examCard = document.createElement('div');
        examCard.className = 'exam-card';
        examCard.innerHTML = `
            <h3 class="exam-card-title">${exam.emoji || ''} ${exam.title}</h3>
            <p class="exam-card-info"><strong>Fach:</strong> ${exam.subject}</p>
            <p class="exam-card-info">${exam.description || ''}</p>
            <p class="exam-card-duration">⏱️ ${exam.duration} Minuten | ${exam.questions ? exam.questions.length : 0} Aufgaben</p>
        `;
        examCard.addEventListener('click', () => selectExam(exam));
        examGrid.appendChild(examCard);
    });
}

// Arbeit auswählen
function selectExam(exam) {
    selectedExam = exam;
    const confirmationOverlay = document.getElementById('confirmationOverlay');
    const confirmationText = document.getElementById('confirmationText');
    
    confirmationText.innerHTML = `
        Sie möchten die <strong>${exam.title}</strong> starten.<br>
        Dauer: <strong>${exam.duration} Minuten</strong><br><br>
        <span style="color: var(--primary-color); font-weight: bold;">⚠️ WICHTIG:</span> Nach dem Start können Sie nicht mehr zurückgehen!
    `;
    
    confirmationOverlay.classList.add('show');
}

// Bestätigung - Arbeit starten
function startExam() {
    if (!selectedExam) return;
    
    // Verstecke Auswahlseite und zeige Arbeit
    document.getElementById('examSelectionContainer').classList.add('hidden');
    document.getElementById('klassenarbeitContainer').classList.remove('hidden');
    document.getElementById('confirmationOverlay').classList.remove('show');
    
    // Setze Arbeit in localStorage (verhindert Zurückgehen)
    localStorage.setItem(SELECTED_EXAM_KEY, selectedExam.id);
    if (selectedExam.difficulty) {
        localStorage.setItem(SELECTED_DIFFICULTY_KEY, selectedExam.difficulty.toString());
    }
    
    // Lade Fragen und starte Timer
    loadExamData(selectedExam);
    initTimer();
    
    // Verhindere Zurückgehen
    preventBackNavigation();
}

// Schwierigkeitsauswahl anzeigen
function showDifficultySelection() {
    document.getElementById('examSelectionContainer').classList.add('hidden');
    document.getElementById('difficultySelection').classList.remove('hidden');
    
    const difficultyGrid = document.getElementById('difficultyGrid');
    difficultyGrid.innerHTML = '';
    
    // Lade Schwierigkeitsstufen aus math-exam-data.js
    if (typeof MATH_EXAM_DIFFICULTIES !== 'undefined') {
        Object.keys(MATH_EXAM_DIFFICULTIES).forEach(diffKey => {
            const diff = MATH_EXAM_DIFFICULTIES[diffKey];
            const diffCard = document.createElement('div');
            diffCard.className = `difficulty-card difficulty-${diffKey}`;
            diffCard.innerHTML = `
                <div class="difficulty-title">${diff.emoji} Stufe ${diffKey}: ${diff.name}</div>
            `;
            diffCard.addEventListener('click', () => selectDifficulty(parseInt(diffKey), diff));
            difficultyGrid.appendChild(diffCard);
        });
    }
}

// Schwierigkeit auswählen
function selectDifficulty(level, difficultyData) {
    selectedDifficulty = { level, data: difficultyData };
    
    const confirmationOverlay = document.getElementById('confirmationOverlay');
    const confirmationText = document.getElementById('confirmationText');
    
    confirmationText.innerHTML = `
        Schwierigkeitsstufe: <strong>${difficultyData.name}</strong><br><br>
        <span style="color: var(--primary-color); font-weight: bold;">⚠️ WICHTIG:</span> Nach dem Start können Sie nicht mehr zurückgehen!
    `;
    
    confirmationOverlay.classList.add('show');
    
    // Überschreibe confirmStartButton Event
    const confirmBtn = document.getElementById('confirmStartButton');
    confirmBtn.onclick = () => {
        startExamWithDifficulty();
    };
}

// Arbeit mit Schwierigkeit starten
function startExamWithDifficulty() {
    if (!selectedExam || !selectedDifficulty) return;
    
    // Verstecke Schwierigkeitsauswahl und zeige Arbeit
    document.getElementById('difficultySelection').classList.add('hidden');
    document.getElementById('klassenarbeitContainer').classList.remove('hidden');
    document.getElementById('confirmationOverlay').classList.remove('show');
    
    // Setze in localStorage
    localStorage.setItem(SELECTED_EXAM_KEY, selectedExam.id);
    localStorage.setItem(SELECTED_DIFFICULTY_KEY, selectedDifficulty.level.toString());
    
    // Lade Fragen für diese Schwierigkeit
    examQuestions = selectedDifficulty.data.questions;
    
    // Setze Design basierend auf Schwierigkeit
    applyDifficultyDesign(selectedDifficulty.level);
    
    // Lade Arbeit
    loadExamData(selectedExam);
    renderQuestions();
    
    // Initialisiere Tools vor Timer (für Extra-Zeit)
    initTools();
    initTimer();
    
    // Verhindere Zurückgehen
    preventBackNavigation();
}

// Design je nach Schwierigkeit anwenden
function applyDifficultyDesign(level) {
    const container = document.getElementById('klassenarbeitContainer');
    const timerContainer = document.getElementById('timerContainer');
    const body = document.body;
    
    // Entferne alle Difficulty-Klassen
    container.className = 'klassenarbeit-container';
    timerContainer.className = 'timer-container';
    body.classList.remove('difficulty-1', 'difficulty-2', 'difficulty-3', 'difficulty-4', 'difficulty-5', 'difficulty-6');
    
    // Füge entsprechende Klasse hinzu
    container.classList.add(`difficulty-${level}`);
    timerContainer.classList.add(`difficulty-${level}`);
    body.classList.add(`difficulty-${level}`);
    
    // Spezielle Styles für jede Stufe
    const styles = {
        1: { 
            bg: 'linear-gradient(135deg, #e0f2fe, #bae6fd, #7dd3fc)', 
            color: '#0369a1',
            shadow: '0 4px 20px rgba(3, 105, 161, 0.3)'
        },
        2: { 
            bg: 'linear-gradient(135deg, #dcfce7, #bbf7d0, #86efac)', 
            color: '#166534',
            shadow: '0 4px 20px rgba(22, 101, 52, 0.3)'
        },
        3: { 
            bg: 'linear-gradient(135deg, #fef3c7, #fde68a, #fcd34d)', 
            color: '#92400e',
            shadow: '0 4px 20px rgba(146, 64, 14, 0.3)'
        },
        4: { 
            bg: 'linear-gradient(135deg, #fed7aa, #fdba74, #fb923c)', 
            color: '#9a3412',
            shadow: '0 4px 20px rgba(154, 52, 18, 0.3)'
        },
        5: { 
            bg: 'linear-gradient(135deg, #fecaca, #fca5a5, #f87171)', 
            color: '#991b1b',
            shadow: '0 4px 20px rgba(153, 27, 27, 0.4)'
        },
        6: { 
            bg: 'linear-gradient(135deg, #1a0000, #000000, #1a0000)', 
            color: '#ff0000',
            shadow: '0 4px 30px rgba(255, 0, 0, 0.6), inset 0 0 50px rgba(255, 0, 0, 0.2)'
        }
    };
    
    if (styles[level]) {
        timerContainer.style.background = styles[level].bg;
        timerContainer.style.color = styles[level].color;
        timerContainer.style.boxShadow = styles[level].shadow;
        
        // Hintergrund für Container
        container.style.background = level <= 3 ? '#f9fafb' : level <= 5 ? '#fef2f2' : '#0a0000';
    }
}

// Tools initialisieren
function initTools() {
    extraTimeUsed = localStorage.getItem(EXTRA_TIME_USED_KEY) === 'true';
    hintUsed = localStorage.getItem(HINT_USED_KEY) === 'true';
    hintQuestionId = localStorage.getItem(HINT_QUESTION_KEY);
    
    if (extraTimeUsed) {
        extraTimeAdded = 600; // 10 Minuten bereits hinzugefügt
    }
    
    const extraTimeBtn = document.getElementById('extraTimeButton');
    const hintBtn = document.getElementById('hintButton');
    
    // Entferne alte Event Listeners
    const newExtraTimeBtn = extraTimeBtn.cloneNode(true);
    extraTimeBtn.parentNode.replaceChild(newExtraTimeBtn, extraTimeBtn);
    const newHintBtn = hintBtn.cloneNode(true);
    hintBtn.parentNode.replaceChild(newHintBtn, hintBtn);
    
    if (extraTimeUsed) {
        newExtraTimeBtn.disabled = true;
        newExtraTimeBtn.classList.add('used');
        newExtraTimeBtn.textContent = '⏱️ Extra-Zeit (verwendet)';
    }
    
    if (hintUsed) {
        newHintBtn.disabled = true;
        newHintBtn.classList.add('used');
        newHintBtn.textContent = '💡 Tipp (verwendet)';
        
        // Zeige Tipp falls bereits verwendet
        if (hintQuestionId) {
            const question = examQuestions.find(q => q.id.toString() === hintQuestionId);
            if (question && question.hint) {
                const hintDisplay = document.getElementById('hintDisplay');
                const hintTextEl = document.getElementById('hintText');
                hintTextEl.textContent = question.hint;
                hintDisplay.classList.remove('hidden');
            }
        }
    }
    
    // Event Listeners
    newExtraTimeBtn.addEventListener('click', useExtraTime);
    newHintBtn.addEventListener('click', showHintSelector);
}

// Extra-Zeit verwenden
function useExtraTime() {
    if (extraTimeUsed) return;
    
    if (!confirm('Möchten Sie wirklich 10 Minuten Extra-Zeit verwenden? Dies kann nur einmal genutzt werden!')) {
        return;
    }
    
    extraTimeUsed = true;
    extraTimeAdded = 600; // 10 Minuten in Sekunden
    localStorage.setItem(EXTRA_TIME_USED_KEY, 'true');
    
    const btn = document.getElementById('extraTimeButton');
    btn.disabled = true;
    btn.classList.add('used');
    btn.textContent = '⏱️ Extra-Zeit (verwendet)';
    
    alert('10 Minuten Extra-Zeit wurden hinzugefügt!');
}

// Tipp-Anzeige
function showHintSelector() {
    if (hintUsed) return;
    
    // Zeige alle Fragen mit Tipp-Button
    const questions = document.querySelectorAll('.question-container');
    let hintShown = false;
    
    questions.forEach(qDiv => {
        const questionId = parseInt(qDiv.getAttribute('data-question-id'));
        const question = examQuestions.find(q => q.id === questionId);
        
        if (question && question.hint && !hintShown) {
            // Füge Tipp-Button hinzu
            const hintBtn = document.createElement('button');
            hintBtn.type = 'button';
            hintBtn.className = 'tool-button hint-button';
            hintBtn.style.marginTop = '1rem';
            hintBtn.textContent = '💡 Tipp für diese Aufgabe anzeigen';
            hintBtn.onclick = () => showHintForQuestion(questionId, question.hint);
            qDiv.appendChild(hintBtn);
        }
    });
    
    if (!hintShown) {
        alert('Keine Tipps verfügbar für diese Aufgaben.');
    }
}

// Tipp für spezifische Frage anzeigen
function showHintForQuestion(questionId, hintText) {
    if (hintUsed && hintQuestionId !== questionId.toString()) {
        alert('Sie haben den Tipp bereits für eine andere Aufgabe verwendet!');
        return;
    }
    
    if (!confirm('Möchten Sie den Tipp für diese Aufgabe anzeigen? Dies kann nur einmal verwendet werden!')) {
        return;
    }
    
    hintUsed = true;
    hintQuestionId = questionId.toString();
    localStorage.setItem(HINT_USED_KEY, 'true');
    localStorage.setItem(HINT_QUESTION_KEY, questionId.toString());
    
    // Zeige Tipp
    const hintDisplay = document.getElementById('hintDisplay');
    const hintTextEl = document.getElementById('hintText');
    hintTextEl.textContent = hintText;
    hintDisplay.classList.remove('hidden');
    
    // Entferne alle Tipp-Buttons
    document.querySelectorAll('.hint-button').forEach(btn => {
        if (btn.id !== 'hintButton') {
            btn.remove();
        }
    });
    
    // Deaktiviere Haupt-Tipp-Button
    const hintBtn = document.getElementById('hintButton');
    hintBtn.disabled = true;
    hintBtn.classList.add('used');
    hintBtn.textContent = '💡 Tipp (verwendet)';
    
    // Scroll zu Tipp
    hintDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Bestätigung abbrechen
function cancelStart() {
    document.getElementById('confirmationOverlay').classList.remove('show');
    selectedExam = null;
}

// Arbeit laden
function loadExamData(exam) {
    EXAM_DURATION_MINUTES = exam.duration;
    
    // Titel und Beschreibung setzen
    const title = exam.title || 'Klassenarbeit';
    const description = exam.description || 'Bitte bearbeiten Sie alle Aufgaben sorgfältig.';
    window.setExamTitle(title, description);
    
    // Design basierend auf Schwierigkeit anwenden
    if (exam.difficulty) {
        applyDifficultyDesign(exam.difficulty);
        selectedDifficulty = { level: exam.difficulty, data: exam };
    }
    
    // Lade Fragen
    if (exam.questions && exam.questions.length > 0) {
        examQuestions = exam.questions;
        renderQuestions();
    } else {
        loadQuestions(); // Fallback
    }
    
    // Initialisiere Tools
    initTools();
}

// Verhindere Zurückgehen
function preventBackNavigation() {
    // Verhindere Browser-Zurück-Button
    history.pushState(null, null, location.href);
    window.onpopstate = function() {
        history.pushState(null, null, location.href);
        alert('Sie können während der Klassenarbeit nicht zurückgehen!');
    };
    
    // Verhindere Seitenwechsel
    window.addEventListener('beforeunload', (e) => {
        const examSubmitted = localStorage.getItem(EXAM_SUBMITTED_KEY);
        if (examSubmitted !== 'true') {
            e.preventDefault();
            e.returnValue = 'Möchten Sie die Seite wirklich verlassen? Der Timer läuft weiter.';
            return e.returnValue;
        }
    });
}

// Timer-Funktionen
function initTimer() {
    // Prüfe ob bereits ein Timer läuft
    const timerStart = localStorage.getItem(TIMER_STORAGE_KEY);
    const examStarted = localStorage.getItem(EXAM_STARTED_KEY);
    const examSubmitted = localStorage.getItem(EXAM_SUBMITTED_KEY);
    const selectedExamId = localStorage.getItem(SELECTED_EXAM_KEY);

    // Wenn bereits abgegeben, Timer stoppen
    if (examSubmitted === 'true') {
        document.getElementById('timerDisplay').textContent = 'Abgegeben';
        document.getElementById('timerDisplay').classList.add('timer-danger');
        return;
    }

    // Wenn keine Arbeit ausgewählt wurde, zeige Auswahl
    if (!selectedExamId) {
        showExamSelection();
        return;
    }

    let startTime;
    
    if (timerStart && examStarted === 'true') {
        // Timer läuft bereits - setze fort
        startTime = parseInt(timerStart);
    } else {
        // Neuer Timer starten
        startTime = Date.now();
        localStorage.setItem(TIMER_STORAGE_KEY, startTime.toString());
        localStorage.setItem(EXAM_STARTED_KEY, 'true');
    }

    updateTimer(startTime);
    setInterval(() => updateTimer(startTime), 1000);
}

function updateTimer(startTime) {
    const now = Date.now();
    const elapsed = now - startTime;
    const totalSeconds = EXAM_DURATION_MINUTES * 60 + extraTimeAdded;
    const remaining = totalSeconds - Math.floor(elapsed / 1000);

    if (remaining <= 0) {
        // Zeit abgelaufen
        document.getElementById('timerDisplay').textContent = '00:00:00';
        document.getElementById('timerDisplay').classList.add('timer-danger');
        document.getElementById('submitButton').disabled = true;
        alert('Die Zeit ist abgelaufen! Die Arbeit wird automatisch abgegeben.');
        submitExam();
        return;
    }

    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;

    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.getElementById('timerDisplay').textContent = timeString;

    // Warnung bei weniger als 10 Minuten
    const timerDisplay = document.getElementById('timerDisplay');
    timerDisplay.classList.remove('timer-warning', 'timer-danger');
    
    if (remaining < 600) { // 10 Minuten
        timerDisplay.classList.add('timer-danger');
    } else if (remaining < 1800) { // 30 Minuten
        timerDisplay.classList.add('timer-warning');
    }
}

// Fragen laden (wird später durch echte Fragen ersetzt)
function loadQuestions() {
    // Diese Funktion wird später durch echte Fragen ersetzt
    // Für jetzt: Platzhalter
    examQuestions = [
        {
            id: 1,
            type: 'text',
            question: 'Beispiel-Frage 1: Beschreiben Sie...',
            points: 10,
            correctAnswer: 'beispiel antwort'
        }
    ];
    
    renderQuestions();
}

function renderQuestions() {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';

    examQuestions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-container';
        if (q.negativePoints && q.negativePoints > 0) {
            questionDiv.classList.add('negative');
        }
        questionDiv.setAttribute('data-question-id', q.id);
        questionDiv.setAttribute('data-points', q.points);

        let answerHTML = '';
        
        if (q.type === 'text') {
            answerHTML = `
                <input type="text" 
                       class="answer-input" 
                       name="question_${q.id}" 
                       id="answer_${q.id}"
                       placeholder="Ihre Antwort hier...">
            `;
        } else if (q.type === 'textarea') {
            answerHTML = `
                <textarea class="answer-input" 
                          name="question_${q.id}" 
                          id="answer_${q.id}"
                          rows="5"
                          placeholder="Ihre Antwort hier..."></textarea>
            `;
        } else if (q.type === 'radio') {
            answerHTML = '<div class="answer-options">';
            q.options.forEach((option, optIndex) => {
                answerHTML += `
                    <label class="answer-option">
                        <input type="radio" 
                               name="question_${q.id}" 
                               value="${optIndex}"
                               id="answer_${q.id}_${optIndex}">
                        <span>${option}</span>
                    </label>
                `;
            });
            answerHTML += '</div>';
        } else if (q.type === 'checkbox') {
            answerHTML = '<div class="answer-options">';
            q.options.forEach((option, optIndex) => {
                answerHTML += `
                    <label class="answer-option">
                        <input type="checkbox" 
                               name="question_${q.id}" 
                               value="${optIndex}"
                               id="answer_${q.id}_${optIndex}">
                        <span>${option}</span>
                    </label>
                `;
            });
            answerHTML += '</div>';
        }

        const pointsText = q.negativePoints && q.negativePoints > 0 
            ? `${q.points} Punkte (${q.negativePoints} Minus-Punkte bei falscher Antwort)`
            : `${q.points} Punkte`;
        
        questionDiv.innerHTML = `
            <div class="question-number">Aufgabe ${index + 1} (${pointsText})</div>
            <div class="question-text">${q.question}</div>
            ${answerHTML}
        `;

        container.appendChild(questionDiv);
    });
}

// Notenberechnung
function calculateGrade(points, maxPoints) {
    if (maxPoints === 0) return 7; // Keine Punkte möglich = stinkig
    
    // Wenn negative Punkte, immer Note 7 (stinkig)
    if (points < 0) {
        return 7;
    }
    
    const percentage = (points / maxPoints) * 100;
    
    // Sehr schlechte Leistung (< 10%) = Note 7 (stinkig)
    if (percentage < 10) {
        return 7;
    }

    // Normale Notenberechnung
    for (let grade = 1; grade <= 6; grade++) {
        const scale = GRADE_SCALE[grade];
        if (percentage >= scale.min && percentage <= scale.max) {
            return grade;
        }
    }

    return 6; // Fallback
}

// Antworten auswerten
function evaluateAnswers() {
    let totalPoints = 0;
    let maxPoints = 0;
    const results = [];

    examQuestions.forEach(q => {
        maxPoints += q.points;
        const userAnswer = getUserAnswer(q.id, q.type);
        const points = checkAnswer(q, userAnswer);
        totalPoints += points;
        
        results.push({
            questionId: q.id,
            points: points,
            maxPoints: q.points,
            correct: points === q.points
        });
    });

    return {
        totalPoints,
        maxPoints,
        results,
        grade: calculateGrade(totalPoints, maxPoints)
    };
}

function getUserAnswer(questionId, type) {
    if (type === 'text' || type === 'textarea') {
        const input = document.getElementById(`answer_${questionId}`);
        return input ? input.value.trim().toLowerCase() : '';
    } else if (type === 'radio') {
        const selected = document.querySelector(`input[name="question_${questionId}"]:checked`);
        return selected ? selected.value : '';
    } else if (type === 'checkbox') {
        const checked = Array.from(document.querySelectorAll(`input[name="question_${questionId}"]:checked`))
            .map(cb => cb.value);
        return checked;
    }
    return '';
}

function checkAnswer(question, userAnswer) {
    // Einfache String-Vergleichung (kann später erweitert werden)
    if (question.type === 'text' || question.type === 'textarea') {
        const correct = question.correctAnswer.toLowerCase().trim();
        const user = userAnswer.toLowerCase().trim();
        
        // Exakte Übereinstimmung = volle Punkte
        if (user === correct) {
            return question.points;
        }
        
        // Teilweise Übereinstimmung (enthält wichtige Schlüsselwörter)
        if (question.keywords) {
            const keywords = question.keywords.map(k => k.toLowerCase());
            const foundKeywords = keywords.filter(k => user.includes(k));
            const matchRatio = foundKeywords.length / keywords.length;
            
            if (matchRatio >= 0.7) {
                return Math.floor(question.points * matchRatio);
            }
        }
        
        // Falsche Antwort: Minus-Punkte (wenn negativePoints definiert)
        if (question.negativePoints && question.negativePoints > 0) {
            return -question.negativePoints;
        }
        
        return 0;
    } else if (question.type === 'radio') {
        const correctIndex = question.correctAnswer;
        return userAnswer === String(correctIndex) ? question.points : 0;
    } else if (question.type === 'checkbox') {
        const correctAnswers = question.correctAnswer; // Array
        const userAnswers = userAnswer.map(v => parseInt(v)).sort();
        const correct = correctAnswers.sort();
        
        if (userAnswers.length === correct.length && 
            userAnswers.every((v, i) => v === correct[i])) {
            return question.points;
        }
        
        // Teilpunkte für teilweise richtige Antworten
        const correctCount = userAnswers.filter(v => correct.includes(v)).length;
        const wrongCount = userAnswers.filter(v => !correct.includes(v)).length;
        
        if (wrongCount === 0 && correctCount > 0) {
            return Math.floor((correctCount / correct.length) * question.points);
        }
        
        return 0;
    }
    
    return 0;
}

// Notenanzeige
function showGrade(result) {
    const grade = result.grade;
    const gradeInfo = GRADE_SCALE[grade];
    
    const overlay = document.getElementById('gradeOverlay');
    const display = document.getElementById('gradeDisplay');
    const number = document.getElementById('gradeNumber');
    const label = document.getElementById('gradeLabel');
    const emoji = document.getElementById('gradeEmoji');
    const points = document.getElementById('pointsDisplay');
    const stats = document.getElementById('gradeStats');
    
    // Entferne alle Grade-Klassen
    display.className = 'grade-display';
    display.classList.add(`grade-${grade}`);
    
    number.textContent = grade;
    label.textContent = gradeInfo.label;
    emoji.textContent = gradeInfo.emoji;
    const percentage = result.maxPoints > 0 ? Math.round((result.totalPoints / result.maxPoints) * 100) : 0;
    points.textContent = `${result.totalPoints} / ${result.maxPoints} Punkte (${percentage}%)`;
    if (result.totalPoints < 0) {
        points.classList.add('negative-points');
    }
    
    // Statistiken
    const correctCount = result.results.filter(r => r.correct).length;
    stats.textContent = `${correctCount} von ${result.results.length} Aufgaben richtig`;
    
    overlay.classList.add('show');
}

function closeGradeOverlay() {
    document.getElementById('gradeOverlay').classList.remove('show');
}

// Verifizierungstexte zum Abschreiben
const VERIFICATION_TEXTS = [
    "Ich bestätige hiermit, dass ich die Klassenarbeit wirklich beenden möchte und verstehe, dass diese Aktion nicht rückgängig gemacht werden kann. Ich habe alle Aufgaben sorgfältig bearbeitet und bin mir sicher, dass ich die Arbeit jetzt schließen möchte.",
    "Durch das Abschreiben dieses Textes bestätige ich, dass ich die Klassenarbeit endgültig beenden möchte. Ich bin mir bewusst, dass ich nach dem Schließen nicht mehr zurückkehren kann und alle bisherigen Eingaben verloren gehen.",
    "Ich verstehe vollständig, dass das Schließen der Arbeit eine endgültige Entscheidung ist. Durch das Abschreiben dieses Satzes bestätige ich meine Absicht, die Klassenarbeit jetzt zu beenden, ohne die Möglichkeit, später Änderungen vorzunehmen.",
    "Mit dem Abschreiben dieses Textes erkläre ich mich damit einverstanden, die Klassenarbeit zu schließen. Ich bin mir der Konsequenzen bewusst und bestätige, dass ich wirklich die Arbeit beenden möchte, ohne weitere Bearbeitungsmöglichkeiten zu haben."
];

let currentVerificationText = '';

// Arbeit schließen - Verifizierung anzeigen
function showCloseVerification() {
    const examSubmitted = localStorage.getItem(EXAM_SUBMITTED_KEY);
    if (examSubmitted === 'true') {
        alert('Diese Arbeit wurde bereits abgegeben!');
        return;
    }

    // Zufälligen Verifizierungstext auswählen
    currentVerificationText = VERIFICATION_TEXTS[Math.floor(Math.random() * VERIFICATION_TEXTS.length)];
    
    const overlay = document.getElementById('verificationOverlay');
    const quote = document.getElementById('verificationQuote');
    const input = document.getElementById('verificationInput');
    const confirmBtn = document.getElementById('confirmVerificationButton');
    const hint = document.getElementById('verificationHint');
    
    quote.textContent = currentVerificationText;
    input.value = '';
    input.className = 'verification-input';
    confirmBtn.disabled = true;
    hint.textContent = '';
    hint.className = 'verification-hint';
    
    overlay.classList.remove('hidden');
    input.focus();
    
    // Event Listener für Eingabe
    input.addEventListener('input', checkVerificationText);
}

// Verifizierungstext prüfen
function checkVerificationText() {
    const input = document.getElementById('verificationInput');
    const confirmBtn = document.getElementById('confirmVerificationButton');
    const hint = document.getElementById('verificationHint');
    const userText = input.value.trim();
    const correctText = currentVerificationText.trim();
    
    // Normalisiere beide Texte (entferne mehrfache Leerzeichen, normalisiere Zeilenumbrüche)
    const normalizedUser = userText.replace(/\s+/g, ' ').toLowerCase();
    const normalizedCorrect = correctText.replace(/\s+/g, ' ').toLowerCase();
    
    if (normalizedUser === normalizedCorrect) {
        input.classList.remove('incorrect');
        input.classList.add('correct');
        confirmBtn.disabled = false;
        hint.textContent = '✓ Text korrekt abgeschrieben!';
        hint.className = 'verification-hint correct';
    } else if (userText.length > 0) {
        input.classList.remove('correct');
        input.classList.add('incorrect');
        confirmBtn.disabled = true;
        hint.textContent = '✗ Der Text stimmt nicht überein. Bitte schreiben Sie den Text wortwörtlich ab.';
        hint.className = 'verification-hint incorrect';
    } else {
        input.classList.remove('correct', 'incorrect');
        confirmBtn.disabled = true;
        hint.textContent = '';
        hint.className = 'verification-hint';
    }
}

// Verifizierung bestätigen - Arbeit schließen
function confirmCloseExam() {
    const input = document.getElementById('verificationInput');
    const userText = input.value.trim();
    const correctText = currentVerificationText.trim();
    
    // Nochmal prüfen
    const normalizedUser = userText.replace(/\s+/g, ' ').toLowerCase();
    const normalizedCorrect = correctText.replace(/\s+/g, ' ').toLowerCase();
    
    if (normalizedUser !== normalizedCorrect) {
        alert('Der Text stimmt nicht überein. Bitte schreiben Sie den Text wortwörtlich ab.');
        return;
    }
    
    // Alle Daten löschen
    localStorage.removeItem('exam_timer_start');
    localStorage.removeItem('exam_started');
    localStorage.removeItem('exam_submitted');
    localStorage.removeItem('selected_exam_id');
    localStorage.removeItem('selected_difficulty');
    localStorage.removeItem('extra_time_used');
    localStorage.removeItem('hint_used');
    localStorage.removeItem('hint_question_id');
    
    // Verifizierungs-Modal schließen
    document.getElementById('verificationOverlay').classList.add('hidden');
    
    // Zur Startseite weiterleiten
    alert('Die Arbeit wurde geschlossen. Sie werden zur Startseite weitergeleitet.');
    window.location.href = 'index.html';
}

// Verifizierung abbrechen
function cancelCloseVerification() {
    document.getElementById('verificationOverlay').classList.add('hidden');
    const input = document.getElementById('verificationInput');
    input.value = '';
    input.className = 'verification-input';
}

// Formular absenden
function submitExam() {
    const examSubmitted = localStorage.getItem(EXAM_SUBMITTED_KEY);
    if (examSubmitted === 'true') {
        alert('Diese Arbeit wurde bereits abgegeben!');
        return;
    }

    if (!confirm('Möchten Sie die Arbeit wirklich abgeben? Diese Aktion kann nicht rückgängig gemacht werden.')) {
        return;
    }

    // Markiere als abgegeben
    localStorage.setItem(EXAM_SUBMITTED_KEY, 'true');
    
    // Deaktiviere Formular
    document.getElementById('examForm').style.pointerEvents = 'none';
    document.getElementById('submitButton').disabled = true;
    document.getElementById('closeExamButton').disabled = true;
    
    // Berechne Note
    const result = evaluateAnswers();
    
    // Zeige Note nach kurzer Verzögerung
    setTimeout(() => {
        showGrade(result);
    }, 500);
}

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    // Initialisiere Arbeiten aus Schwierigkeitsstufen
    initializeExams();
    
    const selectedExamId = localStorage.getItem(SELECTED_EXAM_KEY);
    const examStarted = localStorage.getItem(EXAM_STARTED_KEY);
    const selectedDiffLevel = localStorage.getItem(SELECTED_DIFFICULTY_KEY);
    
    // Prüfe ob bereits eine Arbeit gestartet wurde
    if (selectedExamId && examStarted === 'true') {
        // Arbeit läuft bereits - zeige Arbeit
        const exam = AVAILABLE_EXAMS.find(e => e.id === selectedExamId);
        if (exam) {
            selectedExam = exam;
            
            document.getElementById('examSelectionContainer').classList.add('hidden');
            document.getElementById('difficultySelection').classList.add('hidden');
            document.getElementById('klassenarbeitContainer').classList.remove('hidden');
            loadExamData(exam);
            initTimer();
            preventBackNavigation();
        } else {
            // Arbeit nicht gefunden - zeige Auswahl
            showExamSelection();
        }
    } else {
        // Keine Arbeit gestartet - zeige Auswahl
        showExamSelection();
    }
    
    // Formular-Event
    document.getElementById('examForm').addEventListener('submit', (e) => {
        e.preventDefault();
        submitExam();
    });

    // Bestätigungs-Buttons
    document.getElementById('confirmStartButton').addEventListener('click', startExam);
    document.getElementById('cancelStartButton').addEventListener('click', cancelStart);
    
    // Schließen-Button
    const closeExamButton = document.getElementById('closeExamButton');
    if (closeExamButton) {
        closeExamButton.addEventListener('click', showCloseVerification);
    }
    
    // Verifizierungs-Buttons
    const confirmVerificationBtn = document.getElementById('confirmVerificationButton');
    const cancelVerificationBtn = document.getElementById('cancelVerificationButton');
    if (confirmVerificationBtn) {
        confirmVerificationBtn.addEventListener('click', confirmCloseExam);
    }
    if (cancelVerificationBtn) {
        cancelVerificationBtn.addEventListener('click', cancelCloseVerification);
    }
});

// Export für spätere Verwendung
window.setExamQuestions = function(questions) {
    examQuestions = questions;
    renderQuestions();
};

window.setExamTitle = function(title, info) {
    document.getElementById('examTitle').textContent = title;
    if (info) {
        document.getElementById('examInfo').textContent = info;
    }
};

window.setExamDuration = function(minutes) {
    EXAM_DURATION_MINUTES = minutes;
};
