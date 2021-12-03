# Expert Goggles

Proposed and led by Professor Stephen MacNeil <br>

Project Team:
Aaron Wile,
Ayman M Al-Sayed,
Conlin C Fox,
Edward Brace,
Joshua D. Withka,
Tyler Wolf

<h3>System Overview</h3>
Over the past few decades, society has shifted toward data-driven decision making. In all facets of society, experts and non-experts are using data to make decisions about their health (e.g.: vaccines), their life (e.g.: buy a house vs rent), their jobs (e.g.: choosing majors, schools, etc), their political opinions (e.g.: voting, climate change). However, a significant amount of prior research has demonstrated that interpreting data is incredibly difficult, even for experts. Cognitive biases, complex visual representations, and limited training further compound this challenge for non-experts. And while some research has shown that data literacy training can help, most people will do not have the time or money to get formal training in data literacy.
<br><br>
Expert Goggles is a web browser extension that assists user in interpreting various forms of data visualization. As a start for the project, Expert Goggles is currently designed to work with visualizations from the D3 library. With Expert Goggles installed, a user browses the web and finds an article or other publication containing data visualizations. The extension uses a web scraper to parse the source code of the page to locate the point at which the D3 visualization occurs and determine its type. Once this is done, a notice is generated near the visualization point on the page, which the user can click and access a sidebar with information as to how to interpret it.<br><br>
Expert Goggles will track and store some user information (such as logging webpages visited and types of visualizations encountered), which the user can access via a dashboard page via a database (such as Firebase or MySQL). On the dashboard, the user will be able to view the types of visualizations previously encountered, as well as the links to the pages they are featured on. <br><br>
You can use this link to visit the Dashboard Page: https://expertgoggles-b21b1.web.app/
<br>
<h3>Installing Expert Goggles</h3>
Expert Goggles can be installed using the following steps:<br>
1.	Download the zip file from the “releases link” on this page.<br>
2.	Navigate to chrome://extensions.<br>
3.	At the top right, enable Developer Mode.<br>
4.	At the top left, click “load unpacked.”<br>
5.	Navigate to the unzipped directory and click “select folder.”<br>
6.	Expert Goggles is now installed! <br>
<h3>Acceptance Testing</h3>
Steps for using and testing the extension can be found in Docs/testing.xlsx.
