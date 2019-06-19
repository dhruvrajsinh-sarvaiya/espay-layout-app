/**
 * Agency Dashboard
 */
import React, { Component, Fragment } from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import MatButton from "@material-ui/core/Button";
import DownloadAppWdgt from "./DownloadAppWdgt";
import ScanQrWdgt from "./ScanQrWdgt";
import BackupKeyWdgt from "./BackupKeyWdgt";
import EnableGoogleAuthWdgt from "./EnableGoogleAuthWdgt";
// intl messages
import IntlMessages from "Util/IntlMessages";

function getSteps() {
	return [
		<IntlMessages id="my_account.downloadApp" />,
		<IntlMessages id="my_account.scanQRCode" />,
		<IntlMessages id="my_account.backupKey" />,
		<IntlMessages id="my_account.enableGlgAuth" />
	];
}

/* const GoogleAuthStep = (step,props) => {
  console.log('Teting',step,props);
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
      return <DownloadAppWdgt {...props} />
  }
} */
function getStepContent(step, props) {
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

export default class GoogleAuthWdgt extends Component {
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
			<div className="appstepbtn">
				{/* <JbsCollapsibleCard customClasses="col-lg-9 mx-auto"> */}
				<Stepper nonLinear activeStep={activeStep} className="step_tlt">
					{steps.map((label, index) => {
						return (
							<Step key={label} className="step_in_tlt">
								<StepButton /* onClick={this.handleStep(index)} */ completed={this.state.completed[index]}>{label}</StepButton>
							</Step>
						);
					})}
				</Stepper>
				<div>
					{this.allStepsCompleted() ? (
						<div className="pl-40">
							<p>All steps completed - you&quot;re finished</p>
							<Button variant="raised" className="btn-success text-white" onClick={this.handleReset}><IntlMessages id="sidebar.btnReset" /></Button>
						</div>
					) : (
							<div className="clearfix">
								<Fragment>{getStepContent(activeStep, { ...this.props })}</Fragment>
								{/* <p><GoogleAuthStep step={activeStep} {...this.props} /></p> */}
								<div className="float-right mt-10">
									<MatButton id="glg_btn_back" variant="raised" hidden={activeStep === 0} className=" btn-danger text-white ml-10 mb-10" onClick={this.handleBack}><IntlMessages id="sidebar.btnBack" /></MatButton>
									<MatButton id="glg_btn_next" variant="raised" className="perverbtn text-white ml-10 mb-10" hidden={activeStep === 3} onClick={this.handleNext}><IntlMessages id="sidebar.btnNext" /></MatButton>
								</div>
							</div>
						)}
				</div>
				{/* </JbsCollapsibleCard> */}
			</div>
		);
	}
}
