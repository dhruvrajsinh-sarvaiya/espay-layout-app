/*
 * Created By : Megha Kariya
 * Date : 17-01-2019
 * Comment : Multi select component that used in push message file
 */
import React from "react";
import ClearIcon from '@material-ui/icons/Clear';
import Chip from '@material-ui/core/Chip';
import Select from 'react-select';
import Typography from '@material-ui/core/Typography';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import CancelIcon from '@material-ui/icons/Cancel';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';

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

const MultiSelectComponent = ({
  data,
  classes,
  selectedUser,
  handleChangeMulti
}) => {
  return (

    <Input
      fullWidth
      inputComponent={SelectWrapped}
      inputProps={{
        classes,
        value: selectedUser,
        multi: true,
        onChange: handleChangeMulti,
        placeholder: 'Select Users…',
        instanceId: 'react-select-chip',
        id: 'selectUser',
        name: 'selectUser',
        simpleValue: true,
        options: data,
      }}
    />
  );
}
export default MultiSelectComponent;