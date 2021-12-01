from selenium import webdriver #requires "pip install selenium"
import chromedriver_binary #requires "pip install chromedriver-binary==your-chrome-version-or-closest-preceding"
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import ElementNotInteractableException
import time

config = webdriver.ChromeOptions()
config.add_extension("/PATH/OF/PACKED/EXTENSION/project-expert-goggles.crx")
driver = webdriver.Chrome(options=config)

urlList = {}

try:
    file = open("TypeTestURLs.txt", "r")
except FileNotFoundError:
    print("Tests Aborted: File TypeTextURLs.txt does not exist.")
    exit(1)

while True:
    line = file.readline()
    if line == "":
        break

    words = line.split()
    urlList[words[0]] = " ".join(words[1:])

i = 1
for url, chart_type in urlList.items():
    driver.get(url)

    try:
        time.sleep(3) #run time of tests is O(4 secs * # tests); this seems to be set in stone given UI lag
        promptButton = driver.find_element_by_xpath('//div[@id="ExpertGoggles"]').click()
        sidebar = driver.find_element_by_xpath('//div[@class="expertGogglesSidebar"]')
        time.sleep(1)
        name = sidebar.find_element_by_class_name("guideTitle").text

        if (name == chart_type):
            print("Test %d success - is a %s" % (i, chart_type))
        else:
            print("Test %d failed - ID'd a %s as a %s" % (i, chart_type, name))

    except (NoSuchElementException, ElementNotInteractableException):
        print("Test %d failed - no sidebar created" % i)

    i += 1

file.close()
driver.close()
