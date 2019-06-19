import React,{Component} from 'react';
import Menu from '@material-ui/core/Menu';

//Components
import JbsDropdownItem from './JbsDropdownItem';

class JbsDropdownMenu extends Component {
   state = {
      anchorEl: null,
   };

   handleClick = event => {
      this.setState({ anchorEl: event.currentTarget });
   };

   handleClose = () => {
      this.setState({ anchorEl: null });
   };

   render() {
      const { anchorEl } = this.state;
      const { children } = this.props;
      return (
         <div>
            <div
               aria-owns={anchorEl ? 'jbs-dropdown-menu' : null}
               aria-haspopup="true"
               onClick={this.handleClick}
            >
               {children}
            </div>
            <Menu
               id="jbs-dropdown-menu"
               anchorEl={anchorEl}
               open={Boolean(anchorEl)}
               onClose={this.handleClose}
            >
               <JbsDropdownItem>
                 {children}
               </JbsDropdownItem>
            </Menu>
         </div>
      );
   }
}

export default JbsDropdownMenu;