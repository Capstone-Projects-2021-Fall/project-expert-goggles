import React , {useEffect} from 'react'
import './Navbar.css';
import { NavLink } from 'react-router-dom';
import $ from 'jquery';

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
            <NavLink className = "navbar-brand navbar-logo" to="/" exact>
                Expert Goggles 🥽
            </NavLink>

            <button
                className="navbar-toggle"
                onClick ={ function() {
                    setTimeout(function() { animation(); });
                }}
                    type = "button"
                    data-toggle = "collapse"
                    data-target = "#navbarSupportedContent"
                    aria-controls = "navbarSupportedContent"
                    aria-expanded = "false"
                    aria-hidden = "true"
                    aria-label = "Toggle navigation">
                <i className = "fas fa-bars text-white"></i>
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
                        <NavLink className = "nav-link" to = "/Download" exact>
                            <i
                            className = "fa fa-arrow-circle-o-down">
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
                    
                    <li className = "nav-item">
                        <NavLink classname = "nav-link"
                        to = "/Settings" exact>
                            <i
                            className = "fa fa-cog">
                            </i> Settings
                        </NavLink>
                    </li>

                </ul>
            </div>
        </nav>
    )
}
export default Navbar;