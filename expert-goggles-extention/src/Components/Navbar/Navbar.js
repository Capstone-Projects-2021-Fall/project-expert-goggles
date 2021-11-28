import React , {useEffect} from 'react'
import './Navbar.css';
import { NavLink } from 'react-router-dom';
import $ from 'jquery';
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>

const Navbar = () => {

  function animation(){
    var tabsNewAnim = $('#navbarSupportedContent');
    var activeItemNewAnim = tabsNewAnim.find('.active');
    var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
    var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
    var itemPosNewAnimTop = activeItemNewAnim.position();
    var itemPosNewAnimLeft = activeItemNewAnim.position();
    $(".hori-selector").css({
      "top":itemPosNewAnimTop.top + "px", 
      "left":itemPosNewAnimLeft.left + "px",
      "height": activeWidthNewAnimHeight + "px",
      "width": activeWidthNewAnimWidth + "px"
    });
    $("#navbarSupportedContent").on("click","li",function(e){
      $('#navbarSupportedContent ul li').removeClass("active");
      $(this).addClass('active');
      var activeWidthNewAnimHeight = $(this).innerHeight();
      var activeWidthNewAnimWidth = $(this).innerWidth();
      var itemPosNewAnimTop = $(this).position();
      var itemPosNewAnimLeft = $(this).position();
      $(".hori-selector").css({
        "top":itemPosNewAnimTop.top + "px", 
        "left":itemPosNewAnimLeft.left + "px",
        "height": activeWidthNewAnimHeight + "px",
        "width": activeWidthNewAnimWidth + "px"
      });
    });
  }

  useEffect(() => {
    
    animation();
    $(window).on('resize', function(){
      setTimeout(function(){ animation(); }, 500);
    });
    
  }, []);
    return ( 
        <nav className="navbar navbar-expand-lg navbar-mainbg">
            <NavLink className = "navbar-brand" to="/" exact>
                Expert Goggles 🥽
            </NavLink>

            <button
                class="navbar-toggler"
                onClick ={ function() {
                    setTimeout(function() { animation(); });
                }}
                type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <i className = "fa fa-bars" aria-hidden = "true"></i>
            </button>

            <div
                className = "collapse navbar-collape"
                id = "navbarSupportedContent">
                <ul className = "navbar-nav ml-auto">
                    <div className = "hori-selector">
                        <div className = "left"></div>
                        <div className = "right"></div>
                    </div>
                    
                    <li classname = "nav-item-active">
                        <NavLink classname = "nav-link" to = "/" exact>
                            <i
                            className = "fa fa-home">
                            </i> Home
                        </NavLink>
                    </li>
                    

                    <li className = "nav-item">
                        <NavLink classname = "nav-link" to = "/Download" exact>
                            <i
                            className = "fa fa-arrow-circle-down">
                            </i> Download
                        </NavLink>
                    </li>

                    <li className = "nav-item">
                        <NavLink classname = "nav-link" to = "/HistoryofViews" exact>
                            <i
                            className = "fa fa-history">
                            </i> History of Views
                        </NavLink>
                    </li>

                    <li className = "nav-item">
                        <NavLink classname = "nav-link" to = "/AvailableGuides" exact>
                            <i
                            className = "fa fa-book">
                            </i> Available Guides
                        </NavLink>
                    </li>
                    

                </ul>
            </div>
        </nav>
    )
}
export default Navbar;