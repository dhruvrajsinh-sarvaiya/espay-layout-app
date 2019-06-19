/**
 * Footer
 */
import React, { Component,Fragment } from 'react';
import MatButton from '@material-ui/core/Button';
// intl messages
import IntlMessages from 'Util/IntlMessages';
// app config
import AppConfig from 'Constants/AppConfig';

export default class Social extends Component {
	render() {
		return (
			<Fragment>
				<ul className="list-inline footer-menus mb-0 d-flex">
					{typeof AppConfig.facebooklink!='undefined' && AppConfig.facebooklink!='' && 
					<a href={AppConfig.facebooklink} target="_blank">
						<li className="list-inline-item">
							<MatButton variant="fab" mini className="btn-facebook text-white">
								<i className="zmdi zmdi-facebook"></i>
							</MatButton>
						</li>
					</a>
					}
					{typeof AppConfig.twitterlink!='undefined' && AppConfig.twitterlink!='' && 
					<a href={AppConfig.twitterlink} target="_blank">
						<li className="list-inline-item">
							<MatButton variant="fab" mini className="btn-twitter text-white">
								<i className="zmdi zmdi-twitter"></i>
							</MatButton>
						</li>
					</a>
					}
					{typeof AppConfig.linkedinlink!='undefined' && AppConfig.linkedinlink!='' && 
					<a href={AppConfig.linkedinlink} target="_blank">
						<li className="list-inline-item">
							<MatButton variant="fab" mini className="btn-linkedin text-white">
								<i className="zmdi zmdi-linkedin"></i>
							</MatButton>
						</li>
					</a>
					}
					{typeof AppConfig.googlepluslink!='undefined' && AppConfig.googlepluslink!='' && 
					<a href={AppConfig.googlepluslink} target="_blank">
						<li className="list-inline-item">
							<MatButton variant="fab" mini className="btn-google text-white">
								<i className="zmdi zmdi-google"></i>
							</MatButton>
						</li>
					</a>
					}
					{typeof AppConfig.skypelink!='undefined' && AppConfig.skypelink!='' && 
					<a href={AppConfig.skypelink} target="_blank">
						<li className="list-inline-item">
							<MatButton variant="fab" mini className="btn-skype text-white">
								<i className="zmdi zmdi-skype"></i>
							</MatButton>
						</li>
					</a>
					}
					{typeof AppConfig.youtubelink!='undefined' && AppConfig.youtubelink!='' && 
					<a href={AppConfig.youtubelink} target="_blank">
						<li className="list-inline-item">
							<MatButton variant="fab" mini className="btn-youtube text-white">
								<i className="zmdi zmdi-youtube"></i>
							</MatButton>
						</li>
					</a>
					}
					{typeof AppConfig.pinterestlink!='undefined' && AppConfig.pinterestlink!='' && 
					<a href={AppConfig.pinterestlink} target="_blank">
						<li className="list-inline-item">
							<MatButton variant="fab" mini className="btn-pinterest text-white">
								<i className="zmdi zmdi-pinterest"></i>
							</MatButton>
						</li>
					</a>
					}
					{typeof AppConfig.instagramlink!='undefined' && AppConfig.instagramlink!='' && 
					<a href={AppConfig.instagramlink} target="_blank">
						<li className="list-inline-item">
							<MatButton variant="fab" mini className="btn-instagram text-white">
								<i className="zmdi zmdi-instagram"></i>
							</MatButton>
						</li>
					</a>
					}
				</ul>
			</Fragment>
		);
	}
}