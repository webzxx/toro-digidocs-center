import { Button } from "../../ui/button";
import { useStepper } from "../../ui/stepper";

export const StepperFormActions = () => {
  const {
    prevStep,
    resetSteps,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
    isDisabledStep,
  } = useStepper();

  function backStep() {
    prevStep();
    scrollToForm();
  }

  return (
    <div className="w-full flex justify-end gap-2">
      {hasCompletedAllSteps ? (
        <Button size="sm" onClick={resetSteps}>
          Reset
        </Button>
      ) : (
        <>
          <Button
            disabled={isDisabledStep}
            onClick={backStep}
            size="sm"
            variant="secondary"
          >
            Back
          </Button>
          <Button size="sm">
            {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
          </Button>
        </>
      )}
    </div>
  );
};

export const scrollToForm = () => {
  const formElement = document.querySelector("form");
  if (formElement && formElement.previousElementSibling) {
    formElement.previousElementSibling.scrollIntoView({ behavior: "smooth" });
  }
};