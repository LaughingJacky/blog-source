import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTwitterSquare,
    faFacebookSquare,
    faInstagram,
    faGithubSquare
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Icon = ({ href, icon }) => (
    <a
        target="_blank"
        href={href}
        rel="external nofollow noopener noreferrer"
        className="icon custom-icon"
    >
        <span className="fa-layers fa-fw fa-2x">
            <FontAwesomeIcon icon={icon} />
        </span>
    </a>
);

const Footer = () => (
    <footer id="footer">
        <div className="inner">
            <ul className="icons">
                <li>
                    <Icon href="https://twitter.com/Shawb_Wong" icon={faTwitterSquare} />
                </li>
                <li>
                    <Icon href="https://www.facebook.com/ShawbWong" icon={faFacebookSquare} />
                </li>
                <li>
                    <Icon href="https://www.instagram.com/laughingjacky/" icon={faInstagram} />
                </li>
                <li>
                    <Icon href="https://github.com/LaughingJacky" icon={faGithubSquare} />
                </li>
                <li>
                    <Icon href="mailto:4264332@qq.com" icon={faEnvelope} />
                </li>
            </ul>
            <ul className="copyright">
                <li>
                    &copy; Powered by
                    <a href="https://www.gatsbyjs.org/">Gatsby</a>
                    & Hosted on
                    <a href="https://www.netlify.com/">Netlify</a>
                </li>
                <li>
                    Design:
                    <a href="https://html5up.net">HTML5 UP</a>
                </li>
            </ul>
        </div>
    </footer>
)

export default Footer
