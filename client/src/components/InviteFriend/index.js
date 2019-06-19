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
  VKShareButton,
  OKShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  RedditShareButton,
  EmailShareButton,
  TumblrShareButton,
  LivejournalShareButton,
  MailruShareButton,
  ViberShareButton,
  WorkplaceShareButton,
  LineShareButton,
  WeiboShareButton,

  FacebookIcon,
  TwitterIcon,
  GooglePlusIcon,
  LinkedinIcon,
  PinterestIcon,
  WhatsappIcon,
  TelegramIcon,
  VKIcon,
  OKIcon,
  RedditIcon,
  TumblrIcon,
  MailruIcon,
  EmailIcon,
  LivejournalIcon,
  ViberIcon,
  WorkplaceIcon,
  LineIcon,
} from 'react-share';

export default class InviteFriend extends Component {
	
	handleClick(){
		document.getElementById("social-wrapper").classList.toggle('active');
	}
  render() {
    const shareUrl = 'https://new-stack-front.azurewebsites.net';
	const title = AppConfig.brandName;
	const applogo = require('Assets/img/cool_dex_one.png');
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

					{/* <li><VKShareButton
							url={shareUrl}
							image={`${String(window.location)}/${applogo}`}
							windowWidth={660}
							windowHeight={460}
							className="social_share-button">
							<VKIcon
							size={40}
							round />
						</VKShareButton>
					</li>

					<li><OKShareButton
							url={shareUrl}
							image={`${String(window.location)}/${applogo}`}
							windowWidth={660}
							windowHeight={460}
							className="social_share-button">
							<OKIcon
							size={32}
							round />
						</OKShareButton>
					</li>

					<li><RedditShareButton
							url={shareUrl}
							title={title}
							windowWidth={660}
							windowHeight={460}
							className="social_share-button">
							<RedditIcon
							size={32}
							round />
						</RedditShareButton>
					</li>

					<li><TumblrShareButton
							url={shareUrl}
							title={title}
							windowWidth={660}
							windowHeight={460}
							className="social_share-button">
							<TumblrIcon
							size={32}
							round />
						</TumblrShareButton>
					</li>

					<li><LivejournalShareButton
							url={shareUrl}
							title={title}
							description={shareUrl}
							className="social_share-button"
						>
							<LivejournalIcon size={32} round />
						</LivejournalShareButton>
					</li>

					<li><MailruShareButton
							url={shareUrl}
							title={title}
							className="social_share-button">
							<MailruIcon
							size={32}
							round />
						</MailruShareButton>
					</li>

					<li><EmailShareButton
							url={shareUrl}
							subject={title}
							body="body"
							className="social_share-button">
							<EmailIcon
							size={32}
							round />
						</EmailShareButton>
					</li>
					<li><ViberShareButton
							url={shareUrl}
							title={title}
							body="body"
							className="social_share-button">
							<ViberIcon
							size={32}
							round />
						</ViberShareButton>
					</li>

					<li><WorkplaceShareButton
							url={shareUrl}
							quote={title}
							className="social_share-button">
							<WorkplaceIcon
							size={32}
							round />
						</WorkplaceShareButton>
					</li>

					<li><LineShareButton
							url={shareUrl}
							title={title}
							className="social_share-button">
							<LineIcon
							size={32}
							round />
						</LineShareButton>
					</li> */}
				</ul>
			</div>
		</Fragment>
    );
  }
}
