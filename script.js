// MPU Cost Calculator
// Demo estimates only. Confirm actual prices before publishing.

const calculatorData = {
  reason: "",
  situation: "",
  abstinence: "",
  preparation: "",
};

let currentStep = 1;
let showingResults = false;

const question = document.getElementById("question");
const description = document.getElementById("question-description");
const options = document.getElementById("options");
const message = document.getElementById("message");

const stepLabel = document.getElementById("step-label");
const progressPercent = document.getElementById("progress-percent");
const progressBar = document.getElementById("progress-bar");

const backButton = document.getElementById("back-button");
const nextButton = document.getElementById("next-button");
const restartButton = document.getElementById("restart-button");

// estimated demo amounts in euro's
const COSTS = {
  assessment: {
    alcohol: 750,
    drugs: 750,
    points: 650,
    criminal: 750,
    multiple: 850,
  },

  preparation: {
    none: 0,
    consultation: 300,
    standard: 900,
    intensive: 1500,
  },

  abstinence: {
    none: 0,
    sixMonths: 600,
    twelveMonths: 1200,
    fifteenMonths: 1500,
  },

  administrative: 200,
  medical: 150,
};

// Question definitions
const steps = {
  1: {
    title: "Step 1: What is the reason for your MPU?",
    description: "Choose the main reason for your MPU.",
    field: "reason",
    options: [
      {
        value: "alcohol",
        label: "Alcohol",
        description: "MPU due to alcohol-related driving",
      },
      {
        value: "drugs",
        label: "Drugs or cannabis",
        description: "MPU due to drug-related driving",
      },
      {
        value: "points",
        label: "Points",
        description: "MPU due to accumulated traffic points",
      },
      {
        value: "criminal",
        label: "Criminal offence",
        description: "MPU related to a criminal offence",
      },
      {
        value: "multiple",
        label: "Multiple reasons",
        description: "More than one reason applies",
      },
    ],
  },

  2: {
    title: "Step 2: What is your current situation?",
    description: "Choose the option that best describes your situation.",
    field: "situation",
    options: [
      {
        value: "first",
        label: "This is my first MPU",
        description: "I have not taken an MPU before",
      },
      {
        value: "failed",
        label: "I have already failed an MPU",
        description: "I need to prepare for another attempt",
      },
      {
        value: "preparing",
        label: "I am already preparing",
        description: "I have started my preparation",
      },
    ],
  },

  3: {
    title: "Step 3: Do you need abstinence evidence?",
    description: "Select the planned duration, if applicable.",
    field: "abstinence",
    options: [
      {
        value: "none",
        label: "No abstinence evidence planned",
        description: "I do not currently plan to provide abstinence evidence",
      },
      {
        value: "sixMonths",
        label: "6 months",
        description: "Estimated cost for a 6-month programme",
      },
      {
        value: "twelveMonths",
        label: "12 months",
        description: "Estimated cost for a 12-month programme",
      },
      {
        value: "fifteenMonths",
        label: "15 months",
        description: "Estimated cost for a 15-month programme",
      },
    ],
  },

  4: {
    title: "Step 4: What type of preparation do you need?",
    description: "Choose your preferred preparation option.",
    field: "preparation",
    options: [
      {
        value: "none",
        label: "No preparation",
        description: "I only want to estimate the basic costs",
      },
      {
        value: "consultation",
        label: "Initial consultation",
        description: "A consultation to understand my situation",
      },
      {
        value: "standard",
        label: "Standard preparation",
        description: "Structured MPU preparation",
      },
      {
        value: "intensive",
        label: "Intensive preparation",
        description: "More comprehensive individual preparation",
      },
    ],
  },
};

// Determining whether abstinence step applies or not
function requiresAbstinenceStep() {
  return (
    calculatorData.reason === "alcohol" || calculatorData.reason === "drugs"
  );
}

// return the steps relevant to the selected MPU reason
function getVisibleSteps() {
  if (requiresAbstinenceStep()) {
    return [1, 2, 3, 4];
  }

  return [1, 2, 4];
}

// Render radio options for the current question
function renderOptions(step) {
  options.innerHTML = "";

  step.options.forEach(function (option) {
    const label = document.createElement("label");
    label.className = "option";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = step.field;
    input.value = option.value;

    const textContainer = document.createElement("span");

    const title = document.createElement("span");
    title.className = "option-text";
    title.textContent = option.label;

    const detail = document.createElement("span");
    detail.className = "option-description";
    detail.textContent = option.description;

    textContainer.appendChild(title);
    textContainer.appendChild(detail);

    label.appendChild(input);
    label.appendChild(textContainer);

    // Restore saved answer when returning to a step
    if (calculatorData[step.field] === option.value) {
      input.checked = true;
      label.classList.add("selected");
    }

    // Update answer when radio selection changes
    input.addEventListener("change", function () {
      calculatorData[step.field] = input.value;

      options.querySelectorAll(".option").forEach(function (item) {
        item.classList.remove("selected");
      });

      label.classList.add("selected");
      message.textContent = "";
    });

    options.appendChild(label);
  });
}

// Update progress bar based on completed steps
function updateProgress() {
  const visibleSteps = getVisibleSteps();
  const totalSteps = visibleSteps.length;
  const currentIndex = visibleSteps.indexOf(currentStep);

  // Step 1 starts at 0%; & increases with steps
  const percent = Math.round((currentIndex / totalSteps) * 100);

  stepLabel.textContent = "Step " + (currentIndex + 1) + " of " + totalSteps;

  progressPercent.textContent = percent + "%";
  progressBar.style.width = percent + "%";
}

// Display the current step
function showStep() {
  showingResults = false;

  const step = steps[currentStep];

  question.textContent = step.title;
  description.textContent = step.description;

  renderOptions(step);
  updateProgress();

  message.textContent = "";

  backButton.style.display = "inline-block";
  nextButton.style.display = "inline-block";
  restartButton.style.display = "none";

  backButton.disabled = currentStep === 1;

  nextButton.textContent = currentStep === 4 ? "Calculate costs" : "Next";
}

// Validate the current question
function validateCurrentStep() {
  const step = steps[currentStep];

  if (!calculatorData[step.field]) {
    message.textContent = "Please select an option to continue.";
    return false;
  }

  return true;
}

// Moving to the next step
function goToNextStep() {
  if (showingResults) {
    return;
  }

  if (!validateCurrentStep()) {
    return;
  }

  if (currentStep === 1) {
    currentStep = 2;
  } else if (currentStep === 2) {
    currentStep = requiresAbstinenceStep() ? 3 : 4;
  } else if (currentStep === 3) {
    currentStep = 4;
  } else if (currentStep === 4) {
    showResults();
    return;
  }

  showStep();
}

// Moving to the previous step
function goToPreviousStep() {
  if (showingResults) {
    showingResults = false;
    currentStep = 4;
    showStep();
    return;
  }

  if (currentStep === 4) {
    currentStep = requiresAbstinenceStep() ? 3 : 2;
  } else if (currentStep === 3) {
    currentStep = 2;
  } else if (currentStep === 2) {
    currentStep = 1;
  }

  showStep();
}

// Format a number as euros
function formatEuro(amount) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Calculate the estimated total
function calculateCosts() {
  const assessment = COSTS.assessment[calculatorData.reason] || 0;
  const preparation = COSTS.preparation[calculatorData.preparation] || 0;

  let abstinence = 0;

  if (requiresAbstinenceStep()) {
    abstinence = COSTS.abstinence[calculatorData.abstinence] || 0;
  }

  const administrative = COSTS.administrative;
  const medical = COSTS.medical;

  const total =
    assessment + preparation + abstinence + administrative + medical;

  return {
    assessment,
    preparation,
    abstinence,
    administrative,
    medical,
    total,
  };
}

// Convert reason value to readable text
function getReasonLabel() {
  const labels = {
    alcohol: "Alcohol",
    drugs: "Drugs or cannabis",
    points: "Points",
    criminal: "Criminal offence",
    multiple: "Multiple reasons",
  };

  return labels[calculatorData.reason] || "Not specified";
}

// Now display the result
function showResults() {
  showingResults = true;

  const costs = calculateCosts();

  question.textContent = "Your estimated MPU costs";
  description.textContent =
    "Here is an approximate overview based on your answers.";

  stepLabel.textContent = "Estimated costs";
  progressPercent.textContent = "100%";
  progressBar.style.width = "100%";

  options.innerHTML = `
        <h3 class="result-heading">Your cost estimate</h3>

        <p class="result-intro">
            MPU reason: <strong>${getReasonLabel()}</strong>
        </p>

        <div class="estimate-total">
            <div class="estimate-label">Estimated total cost</div>
            <div class="estimate-amount">${formatEuro(costs.total)}</div>
        </div>

        <div class="cost-list">
            <div class="cost-row">
                <span>MPU assessment</span>
                <strong>${formatEuro(costs.assessment)}</strong>
            </div>

            <div class="cost-row">
                <span>Preparation</span>
                <strong>${formatEuro(costs.preparation)}</strong>
            </div>

            <div class="cost-row">
                <span>Abstinence evidence</span>
                <strong>${formatEuro(costs.abstinence)}</strong>
            </div>

            <div class="cost-row">
                <span>Administrative costs</span>
                <strong>${formatEuro(costs.administrative)}</strong>
            </div>

            <div class="cost-row">
                <span>Medical examination estimate</span>
                <strong>${formatEuro(costs.medical)}</strong>
            </div>
        </div>

        <div class="result-note">
            This is a non-binding demo estimate. Actual prices may differ
            depending on the assessment provider, laboratory, preparation
            programme, and individual case. Some costs may not apply in
            every situation.
        </div>
    `;

  message.textContent = "";

  backButton.style.display = "inline-block";
  backButton.disabled = false;

  nextButton.style.display = "none";
  restartButton.style.display = "inline-block";
}

// reset the calculator
function restartCalculator() {
  calculatorData.reason = "";
  calculatorData.situation = "";
  calculatorData.abstinence = "";
  calculatorData.preparation = "";

  currentStep = 1;
  showingResults = false;

  showStep();
}

// Button event listeners
nextButton.addEventListener("click", goToNextStep);
backButton.addEventListener("click", goToPreviousStep);
restartButton.addEventListener("click", restartCalculator);

// Initialize calculator
showStep();
