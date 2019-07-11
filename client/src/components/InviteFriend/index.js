/* 
    Createdby : dhara gajera
    CreatedDate :18-01-2019
    Description : Component For Invite Friend 
*/
import React, { Component,Fragment } from 'react';
// app config
import AppConfig from 'Constants/AppConfig';
import './shareMe.css';
import {

  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  PinterestShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  GooglePlusIcon,
  LinkedinIcon,
  PinterestIcon,
  WhatsappIcon,
  TelegramIcon,
} from 'react-share';

export default class InviteFriend extends Component {
	
	handleClick(){
		document.getElementById("social-wrapper").classList.toggle('active');
	}
  render() {
    const shareUrl = 'https://new-stack-front.azurewebsites.net';
	const title = AppConfig.brandName;
	const shareLogo ='https://miro.medium.com/fit/c/240/240/1*kmeXr3HB5QWbY3SnOsruvw.jpeg';
    return (
		<Fragment>
			<div className="share-wrapper">
				<i className="zmdi zmdi-share zmdi-hc-stack-1x share active" onClick={ this.handleClick }></i> 
				<ul id="social-wrapper" className="social">
					<li><FacebookShareButton
							url={shareUrl}
							quote={title}
							className="social_share-button">
							<FacebookIcon
							size={40}
							round />
						</FacebookShareButton>
					</li>
					<li><TwitterShareButton
							url={shareUrl}
							title={title}
							className="social_share-button">
								<TwitterIcon
								size={40}
								round />
						</TwitterShareButton>
					</li>
					<li><LinkedinShareButton
							url={shareUrl}
							title={title}
							windowWidth={750}
							windowHeight={600}
							className="social_share-button">
							<LinkedinIcon
							size={40}
							round />
						</LinkedinShareButton>
					</li>
					<li><GooglePlusShareButton
								url={shareUrl}
								className="social_share-button">
								<GooglePlusIcon
								size={40}
								round />
							</GooglePlusShareButton>
					</li>
					<li><WhatsappShareButton
								url={shareUrl}
								title={title}
								separator=":: "
								className="social_share-button">
								<WhatsappIcon size={40} round />
							</WhatsappShareButton>
					</li>
					<li><PinterestShareButton
							url={String(window.location)}
							media={shareLogo}
							windowWidth={1000}
							windowHeight={730}
							className="social_share-button">
							<PinterestIcon size={40} round />
						</PinterestShareButton>
					</li>
					<li><TelegramShareButton
								url={shareUrl}
								title={title}
								className="social_share-button">
								<TelegramIcon size={32} round />
						</TelegramShareButton>
					</li>

					
				</ul>
			</div>
		</Fragment>
    );
  }
}
