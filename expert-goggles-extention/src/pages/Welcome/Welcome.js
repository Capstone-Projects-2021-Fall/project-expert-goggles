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
                        <li>Expert goggles is a context-aware browser extension in regards to training for data literacy.
                        This extension proposes an approach to integrate data literacey training into activities that people are already doing such as web browsing.
                        </li>
                        <li>
                            This application consists of a Google Chrome Browser Extenson that users can install and use
                            while they surf the web.
                        </li>
                    </ul>
                </section>
                </section>
                <section class="section section-3">
                    <p>How does it work?     The extension reads each page that the user navigates to and parses out the visualization on the page using a web scraping library.
                        After scraping the web page and identifying the visualization type, the extension would show an HTML page with training for how to interpret the visualization on that page.
                    </p>
                </section>
                <section class="section section-4">
                    <p>Each time the extension detects a visualization and provides contextual guidance for interpreting that visualization, the extension will log the date, time, and web page in a database.</p>
                </section>
                <section class="section section-5">
                    <h2>You can use the navigation bar at the top of the screen to view the other features with this extension.</h2>
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
