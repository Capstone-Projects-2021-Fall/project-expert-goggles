import React from 'react'
import './Welcome.css'
<link rel = "stylesheet" href = "./Welcome.css" />


function Welcome() {
        return (
            <main>
                <section class="section section-1">
                    <p>Welcome to Expert Goggles 🥽</p>
                </section>
                <section class="section section-2">
                    <p>Expert goggles is a context-aware browswer extention in regards to training for data literacy.
                        This extention proposes an approach to integrate data literacey training into activities that people are already doing such as web browsing.
                    </p>
                </section>
                <section class="section section-3">
                    <p>How does it work?     The extention reacds each page that the user navigates to and parses out the visualization on the page using a web scraping library.
                        After scraping the web page and identifying the visualization type, the extention would show an HTML page with training for how to interpret the visualization on that page.
                    </p>
                </section>
                <section class="section section-4">
                    <p>Each time the extention detects a visualization and provides contextual guidance for interpreting that visualization, the extention will log the date, time, and web page in a database.</p>
                </section>
                <section class="section section-5">
                    <h2>You can use the navigation bar at the top of the screen to view the other features with this extention.</h2>
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
