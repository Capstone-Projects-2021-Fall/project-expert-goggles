import React from 'react'
import './Welcome.css'
<link rel = "stylesheet" href = "./Welcome.css" />


function Welcome() {
        return (
            <main>
                <section id = "sec-1">
                    <section class="section section-1">
                        <h1 class = "one">Welcome to Expert Goggles 🥽</h1>
                        <a href = "#sec-2" class = "button"><span> Explore</span></a>
                    </section>
                </section>
                <section id = "sec-2">
                <section class="section section-2">
                    <p className = "question1" style = {{padding: "20px"}}>What is Expert Goggles?</p>
                    <ul id = "welcomesection2">
                        <li>
                            Expert goggles is a context-aware browser extension in regards to training for data literacy.
                            This extension proposes an approach to integrate data literacey training into activities that people are already doing such as web browsing.
                        </li>
                        <br/>
                        <br/>
                        <br/>
                        <li>
                            This application consists of a Google Chrome Browser Extenson that users can install and use
                            while they surf the web.
                        </li>
                    </ul>
                </section>
                </section>
                <section class="section section-3">
                    <p className = "question2" style = {{padding: "20px"}}>How does it work?</p>
                    <ul id = "welcomesection3">
                        <li>
                            The extension reads each page that the user navigates to and parses out the visualization on the page using a web scraping library.
                            After scraping the web page and identifying the visualization type, the extension would show an HTML page with training for how to interpret the visualization on that page.
                        </li>
                        <br/>
                        <br/>
                        <li>
                            Expert Goggles is currently designed to work with visualizations from the D3 library to assist the user
                            in interpreting various forms of data visualizations.
                        </li>
                        <br/>
                        <br/>
                        <li>
                            Expert Goggles will track and store some user information (such as logging webpages visited and types of visualizations encountered), which the user
                            can access via a dashboard page via a database.
                        </li>
                    </ul>
                </section>
                <section class="section section-4">
                    <p className = "question3" style = {{padding: "20px"}}>Dashboard Features</p>
                    <ul id = "welcomesection4">
                        <li>
                            Each time the extension detects a visualization and provides contextual guidance for interpreting that visualization, 
                            the extension will log the date, time, and web page in a database.
                        </li>
                        <br/>
                        <br/>
                        <li>
                            Downloads page will help instruct you on how to download the extention to your browser.
                        </li>
                        <br/>
                        <br/>
                        <li>
                            History page will display all the previous visualizations that the extension has detected and you have viewed details about.
                        </li>
                        <br/>
                        <br/>
                        <li>
                            Available guides will display all the current available guides that our extension can detect and provide information for including 
                            the name description and visualization of what it should look like.
                        </li>
                    </ul>
                </section>
                <section class="section section-5">
                    <ul id = "finalpage">
                        <li>
                            <h2 class = "lastpage" style = {{padding: "20px"}}>You can use the navigation bar at the top of the screen to view the other features with this extension.</h2>
                        </li>
                        <br/>
                        <br/>
                        <br/>
                        <li>
                            <h2 class = "finalwords" style = {{padding: "20px"}}>Happy Analyzing 🥽</h2>
                        </li>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <li>
                            <h3 class = "footerone" style = {{padding: "0px"}}>Created By:</h3>
                        </li>
                        <li>
                            <h4 class = "footer" style = {{padding: "0px"}}>Ayman El-sayed, Aaron Wile, Conlin Fox, Edward Brace, Joshua Withka, Tyler Wolf</h4>
                        </li>
                    </ul>
                </section>
            </main>
        )
}

export default Welcome;


/*
            <div className = "page_player">
                <section className = 'container'>
                    <h1 className = 'child'> Slide 1 </h1>
                    <h1 className = 'child'> Slide 2 </h1>
                    <h1 className = 'child'> Slide 3 </h1>
                    <h1 className = 'child'> Slide 4 </h1>
                </section>
            </div>
*/


/*function Welcome () {
    return (
        <div className = "container">
            <section className = "one">
                <h1>First Page</h1>
            </section>
            <section className = "two">
                <h1>Second Page</h1>
            </section>
            <section className = "three">
                <h1> Third Page</h1>
            </section>
            <section className = "four">
                <h1>Egypt</h1>
            </section>
        </div>
    )
}
export default Welcome;


/*
His videocard = our container
his video = our section
his video_player = our one .. two .. three .. four
*/
