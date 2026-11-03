let currentStep = 1;

let calculatorData = {
  reason: "",
  situation: "",
};

const question = document.getElementById("question");
const options = document.getElementById("options");
const stepNumber = document.getElementById("step-number");
const backButton = document.getElementById("back-button");
const nextButton = document.getElementById("next-button");
const message = document.getElementById("message");

// Step 1 options
const reasonOptions = `
    <label>
        <input type="radio" name="reason" value="alcohol">
        Alcohol
    </label>
    <br>

    <label>
        <input type="radio" name="reason" value="drugs">
        Drugs or cannabis
    </label>
    <br>

    <label>
        <input type="radio" name="reason" value="points">
        Points
    </label>
    <br>

    <label>
        <input type="radio" name="reason" value="criminal">
        Criminal offence
    </label>
    <br>

    <label>
        <input type="radio" name="reason" value="multiple">
        Multiple reasons
    </label>
`;

// Step 2 options
const situationOptions = `
    <label>
        <input type="radio" name="situation" value="first">
        This is my first MPU
    </label>
    <br>

    <label>
        <input type="radio" name="situation" value="failed">
        I have already failed an MPU
    </label>
    <br>

    <label>
        <input type="radio" name="situation" value="preparing">
        I am already preparing for my MPU
    </label>
`;

function showStep() {
  stepNumber.textContent = currentStep;
  message.textContent = "";

  backButton.disabled = currentStep === 1;

  if (currentStep === 1) {
    question.textContent = "Step 1: What is the reason for your MPU?";

    options.innerHTML = reasonOptions;

    if (calculatorData.reason) {
      const selected = document.querySelector(
        `input[name="reason"][value="${calculatorData.reason}"]`
      );

      if (selected) {
        selected.checked = true;
      }
    }
  }

  if (currentStep === 2) {
    question.textContent = "Step 2: What is your current situation?";

    options.innerHTML = situationOptions;

    if (calculatorData.situation) {
      const selected = document.querySelector(
        `input[name="situation"][value="${calculatorData.situation}"]`
      );

      if (selected) {
        selected.checked = true;
      }
    }
  }
}

nextButton.addEventListener("click", function () {
  if (currentStep === 1) {
    const selectedReason = document.querySelector(
      'input[name="reason"]:checked'
    );

    if (!selectedReason) {
      message.textContent = "Please select an MPU reason.";
      return;
    }

    calculatorData.reason = selectedReason.value;
    currentStep = 2;
    showStep();
  } else if (currentStep === 2) {
    const selectedSituation = document.querySelector(
      'input[name="situation"]:checked'
    );

    if (!selectedSituation) {
      message.textContent = "Please select your current situation.";
      return;
    }

    calculatorData.situation = selectedSituation.value;

    message.textContent =
      "Your answers have been saved. More questions will be added in the next step.";

    nextButton.disabled = true;
  }
});

backButton.addEventListener("click", function () {
  if (currentStep > 1) {
    currentStep--;
    showStep();
    nextButton.disabled = false;
  }
});

// Showing the first step when page loads
showStep();
