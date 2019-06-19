/**
 * Jbs Collapsible Card
 */
import React, { Component } from "react";
import { Collapse, Badge } from "reactstrap";
import classnames from "classnames";

// jbs section loader
import JbsSectionLoader from "../JbsSectionLoader/JbsSectionLoader";

class JbsCollapsibleCard extends Component {
  state = {
    reload: false,
    collapse: true,
    close: false
  };

  onCollapse() {
    this.setState({ collapse: !this.state.collapse });
  }

  onReload() {
    this.setState({ reload: true });
    let self = this;
    setTimeout(() => {
      self.setState({ reload: false });
    }, 1500);
  }

  onCloseSection() {
    this.setState({ close: true });
  }

  render() {
    const { close, reload, collapse } = this.state;
    const {
      children,
      collapsible,
      closeable,
      reloadable,
      heading,
      fullBlock,
      colClasses,
      customClasses,
      headingCustomClasses,
      contentCustomClasses,
      badge
    } = this.props;
    return (
      <div
        className={classnames(colClasses ? colClasses : "", {
          "d-block": !collapse
        })}
      >
        <div
          className={classnames(
            `jbs-block ${customClasses ? customClasses : ""}`,
            { "d-none": close }
          )}
        >
          {heading && (
            <div
              className={`jbs-block-title ${
                headingCustomClasses ? headingCustomClasses : ""
              }`}
            >
              <h4>
                {heading}{" "}
                {badge && (
                  <Badge className="p-1 ml-10" color={badge.class}>
                    {badge.name}
                  </Badge>
                )}
              </h4>
              {(collapsible || reloadable || closeable) && (
                <div className="contextual-link">
                  {collapsible && (
                    <a
                      href="javascript:void(0)"
                      onClick={() => this.onCollapse()}
                    >
                      <i className="ti-minus" />
                    </a>
                  )}
                  {reloadable && (
                    <a
                      href="javascript:void(0)"
                      onClick={() => this.onReload()}
                    >
                      <i className="ti-reload" />
                    </a>
                  )}
                  {closeable && (
                    <a
                      href="javascript:void(0)"
                      onClick={() => this.onCloseSection()}
                    >
                      <i className="ti-close" />
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
          <Collapse isOpen={collapse}>
            <div
              className={classnames(
                contentCustomClasses ? contentCustomClasses : "",
                { "jbs-block-content": !fullBlock, "jbs-full-block": fullBlock }
              )}
            >
              {children}
            </div>
          </Collapse>
          {reload && <JbsSectionLoader />}
        </div>
      </div>
    );
  }
}

export default JbsCollapsibleCard;
