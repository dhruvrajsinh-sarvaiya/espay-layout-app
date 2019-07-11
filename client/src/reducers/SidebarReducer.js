/**
 * Sidebar Reducers
 */
import update from 'react-addons-update';
import { TOGGLE_MENU } from 'Actions/types';

// nav links
import navLinks from 'Components/Sidebar/NavLinks';

const INIT_STATE = {
	sidebarMenus: navLinks,
};

export default (state, action) => {
	if (typeof state === 'undefined') {
		return INIT_STATE
	}
	if (action.type === TOGGLE_MENU) {
		let index = state.sidebarMenus[action.payload.stateCategory].indexOf(action.payload.menu);
		for (var key in state.sidebarMenus) {
			var obj = state.sidebarMenus[key];
			for (let i = 0; i < obj.length; i++) {
				const element = obj[i];
				if (element.open) {
					if (key === action.payload.stateCategory) {
						return update(state, {
							sidebarMenus: {
								[key]: {
									[i]: {
										open: { $set: false }
									},
									[index]: {
										open: { $set: !action.payload.menu.open }
									}
								}
							}
						});
					} else {
						return update(state, {
							sidebarMenus: {
								[key]: {
									[i]: {
										open: { $set: false }
									}
								},
								[action.payload.stateCategory]: {
									[index]: {
										open: { $set: !action.payload.menu.open }
									}
								}
							}
						});
					}
				}
			}
		}
		return update(state, {
			sidebarMenus: {
				[action.payload.stateCategory]: {
					[index]: {
						open: { $set: !action.payload.menu.open }
					}
				}
			}
		});
	} else {
		return { ...state };
	}
}
