import React, { Component, Fragment } from "react";
import ClearIcon from '@material-ui/icons/Clear';
// import { Label } from "reactstrap";
import Chip from '@material-ui/core/Chip';
import Select from 'react-select';
import Typography from '@material-ui/core/Typography';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import CancelIcon from '@material-ui/icons/Cancel';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
// import IntlMessages from "Util/IntlMessages";

class Option extends React.Component {
    handleClick = event => {
      this.props.onSelect(this.props.option, event);
    };
  
    render() {
      const { children, isFocused, isSelected, onFocus } = this.props;
      return (
        <MenuItem
          onFocus={onFocus}
          selected={isFocused}
          onClick={this.handleClick}
          component="div"
          style={{
            fontWeight: isSelected ? 500 : 400,
          }}
        >
          {children}
        </MenuItem>
      );
    }
  }
  function SelectWrapped(props) {
    const { classes, ...other } = props;
    return (
      <Select
        optionComponent={Option}
        noResultsText={<Typography>{'No results found'}</Typography>}
        arrowRenderer={arrowProps => {
          return arrowProps.isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />;
        }}
        clearRenderer={() => <ClearIcon />}
        valueComponent={valueProps => {
          const { value, children, onRemove } = valueProps;
          const onDelete = event => {
            event.preventDefault();
            event.stopPropagation();
            onRemove(value);
          };
          if (onRemove) {
            return (
              <Chip
                tabIndex={-1}
                label={children}
                className={classes.chip}
                deleteIcon={<CancelIcon onTouchEnd={onDelete} />}
                onDelete={onDelete}
              />
            );
          }
          return <div className="Select-value">{children}</div>;
        }}
        {...other}
      />
    );
  }
  
  const MultiSelectComponentD = ({
    data = [
      { label: 'Afghanistan' },
      { label: 'Aland Islands' },
      { label: 'Albania' },
      { label: 'Algeria' },
      { label: 'American Samoa' },
      { label: 'Andorra' },
      { label: 'Angola' },
      { label: 'Anguilla' },
      { label: 'Antajbsica' },
      { label: 'Antigua and Barbuda' },
      { label: 'Argentina' },
      { label: 'Armenia' },
      { label: 'Aruba' },
      { label: 'Australia' },
      { label: 'Austria' },
      { label: 'Azerbaijan' },
      { label: 'Bahamas' },
      { label: 'Bahrain' },
      { label: 'Bangladesh' },
      { label: 'Barbados' },
      { label: 'Belarus' },
      { label: 'Belgium' },
      { label: 'Belize' },
      { label: 'Benin' },
      { label: 'Bermuda' },
      { label: 'Bhutan' },
      { label: 'Bolivia, Plurinational State of' },
      { label: 'Bonaire, Sint Eustatius and Saba' },
      { label: 'Bosnia and Herzegovina' },
      { label: 'Botswana' },
      { label: 'Bouvet Island' },
      { label: 'Brazil' },
      { label: 'British Indian Ocean Territory' },
      { label: 'Brunei Darussalam' },].map(suggestion => ({
        value: suggestion.label,
        label: suggestion.label,
      })),
    classes,
    distrebuter,
    handleChangeMultiforDistrebuter
  }) => {
    return (
        <div className="col-md-12">
          <Input
            fullWidth
            inputComponent={SelectWrapped}
            inputProps={{
              classes,
              value: distrebuter,
              multi: true,
              onChange: handleChangeMultiforDistrebuter,
              placeholder: 'Select multi-value…',
              instanceId: 'react-select-chip',
              id: 'selectUser',
              name: 'selectUser',
              simpleValue: true,
              options: data,
            }}
          />

          
        </div>
    );
}
export default  MultiSelectComponentD