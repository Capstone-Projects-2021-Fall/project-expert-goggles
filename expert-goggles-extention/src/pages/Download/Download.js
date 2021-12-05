import React from 'react'
import './Download.css'
<link rel = "stylesheet" href = "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.15.4/css/fontawesome.min.css"/>

const Downloads = () => {
    return (
        <bodytwo>
            <section class = "page-1">
                    <h1 class = "Download" data-shadow='Download'>Download</h1>
                    <ol class = "centerlist">
                        <li>Download the zip file and unzip it into the desired directory.</li>
                        <li>Navigate to chrome://extensions.</li>
                        <li>At the top right, enable Developer Mode.</li>
                        <li>At the top left, click “load unpacked.”</li>
                        <li>Navigate to the unzipped directory and click “select folder.”</li>
                        <li>Expert Goggles is now installed!</li>
                    </ol>
                        <a href = "https://github.com/Capstone-Projects-2021-Fall/project-expert-goggles/releases" target = "_blank" rel="noopener noreferrer" class = "dwnldbtn">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            Open Package Page
                        </a>
            </section>
        </bodytwo>

    )
}
export default Downloads;