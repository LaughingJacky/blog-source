import React from 'react'

const Footer = (props) => (
    <footer id="footer">
        <div className="inner">
            <ul className="icons">
                <li><a href="https://twitter.com/Shawb_Wong" className="icon alt fa-twitter"><span className="label">Twitter</span></a></li>
                <li><a href="https://www.facebook.com/ShawbWong" className="icon alt fa-facebook"><span className="label">Facebook</span></a></li>
                <li><a href="https://www.instagram.com/laughingjacky/" className="icon alt fa-instagram"><span className="label">Instagram</span></a></li>
                <li><a href="https://github.com/LaughingJacky" className="icon alt fa-github"><span className="label">GitHub</span></a></li>
                <li><a href="mailto:laughingjacky@gmail.com" className="icon alt fa-envelope"><span className="label">LinkedIn</span></a></li>
            </ul>
            <ul className="copyright">
                <li>&copy; Powered by <a href="https://www.gatsbyjs.org/">Gatsby</a> & Hosted on <a href="https://www.netlify.com/">Netlify</a></li><li>Design: <a href="https://html5up.net">HTML5 UP</a></li>
            </ul>
        </div>
    </footer>
)

export default Footer
