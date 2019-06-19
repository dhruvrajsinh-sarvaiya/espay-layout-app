/**
 * Agency Dashboard
 */
import React, { Component } from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import Button from "@material-ui/core/Button";

// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

import {
  DownloadAppWdgt,
  ScanQrWdgt,
  BackupKeyWdgt,
  EnableGoogleAuthWdgt
} from "Components/MyAccount";

function getSteps() {
  return [
    "Download App",
    "Scan QR Code",
    "Backup Key",
    "Enable Google Authentication"
  ];
}

function getStepContent(step,props) {
  switch (step) {
    case 0:
      return <DownloadAppWdgt {...props} />;
    case 1:
      return <ScanQrWdgt {...props} />;
    case 2:
      return <BackupKeyWdgt {...props} />;
    case 3:
      return <EnableGoogleAuthWdgt {...props} />;
    default:
      return "Unable Case";
  }
}

export default class googleauth extends Component {
  state = {
    activeStep: 0,
    completed: {}
  };

  completedSteps() {
    return Object.keys(this.state.completed).length;
  }

  totalSteps = () => {
    return getSteps().length;
  };

  isLastStep() {
    return this.state.activeStep === this.totalSteps() - 1;
  }

  allStepsCompleted() {
    return this.completedSteps() === this.totalSteps();
  }

  handleNext = () => {
    let activeStep;

    if (this.isLastStep() && !this.allStepsCompleted()) {
      // It's the last step, but not all steps have been completed,
      // find the first step that has been completed
      const steps = getSteps();
      activeStep = steps.findIndex((step, i) => !(i in this.state.completed));
    } else {
      activeStep = this.state.activeStep + 1;
    }
    this.setState({
      activeStep
    });
  };

  handleBack = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep - 1
    });
  };

  handleStep = step => () => {
    this.setState({
      activeStep: step
    });
  };

  handleComplete = () => {
    const { completed } = this.state;
    completed[this.state.activeStep] = true;
    this.setState({
      completed
    });
    this.handleNext();
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
      completed: {}
    });
  };

  render() {
    const steps = getSteps();
    const { activeStep } = this.state;
    return (
      <div>
        <JbsCollapsibleCard customClasses="col-lg-9 mx-auto">
          <Stepper nonLinear activeStep={activeStep}>
            {steps.map((label, index) => {
              return (
                <Step key={label}>
                  <StepButton
                    onClick={this.handleStep(index)}
                    completed={this.state.completed[index]}
                  >
                    {label}
                  </StepButton>
                </Step>
              );
            })}
          </Stepper>
          <div>
            {this.allStepsCompleted() ? (
              <div className="pl-40">
                <p>All steps completed - you&quot;re finished</p>
                <Button
                  variant="raised"
                  className="btn-success text-white"
                  onClick={this.handleReset}
                >
                  Reset
                </Button>
              </div>
            ) : (
              <div className="pl-40">
                <p>{getStepContent(activeStep,this.props)}</p>
                <div className="float-right mb-10">
                  <Button
                    variant="raised"
                    className=" btn-danger text-white mr-10 mb-10"
                    disabled={activeStep === 0}
                    onClick={this.handleBack}
                  >
                    Back
                  </Button>
                  <Button
                    variant="raised"
                    color="primary"
                    className="text-white mr-10 mb-10"
                    onClick={this.handleNext}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </JbsCollapsibleCard>
      </div>
    );
  }
}
