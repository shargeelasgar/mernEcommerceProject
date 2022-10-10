import React from 'react'
import playStore from '../../../images/playstore.png'
import Appstore from '../../../images/Appstore.png'
import './Footer.css'
const Footer = () => {
  return (
    <footer id='footer'>
      <div className='leftFooter'>
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App from Android and IOS mobile phone</p>
        <img src={playStore} alt='playStore' />
        <img src={Appstore} alt='Appstore' />
      </div>
      <div className='midFooter'>
        <h1>Ecommerce.</h1>
        <p>High Quality is our first priority</p>
        <p>Copyrights 2022 &copy; SyedShargeelAsgar Gareeb Banda</p>
      </div>
      <div className='rightFooter'>
        <h1>Follow Us</h1>
      {/* <a href='/instagram' />Instagram<a/>
      <a href='/youtube' />Youtube<a/> */}
      <a href='https://web.facebook.com/me/'> Facebook</a>
     
      </div>

    </footer>
  )
}

export default Footer
