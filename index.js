const puppeteer = require('puppeteer')
const fs = require('fs')

async function getDataFromInternshala() {
    const browser = await puppeteer.launch({})
    const page = await browser.newPage()
    const data = []

    await page.goto('https://internshala.com/internships/work-from-home-.net-development,angular.js-development,backend-development,front-end-development,full-stack-development,javascript-development,node.js-development,php-development,python%2Fdjango,software-development,web-development,wordpress-development-internships/part-time-true/big-brand/')
    const allElements = await page.$$('#internships_list_container #reference #list_container #internship_list_container #internship_list_container_1 .individual_internship')

    for (let index = 0; index < allElements.length; index++) {
        const subject = await allElements[index].$eval('.profile a', element => element.textContent.trim())
        const duration = await allElements[index].$eval('.other_detail_item:nth-child(2) .item_body', element => element.textContent.trim())
        const salary = await page.evaluate((index) => {
            const element = document.querySelector(`#internships_list_container #reference #list_container #internship_list_container #internship_list_container_1 .individual_internship:nth-child(${index + 1}) .stipend`)
            if (element) {
                return element.textContent.trim()
            }
            return 'Not Found'
        }, index)
        const company = await allElements[index].$eval('.company_name a', element => element.textContent.trim())
        const date = await allElements[index].$eval('.posted_by_container .status', element => element.textContent.trim())
        const apply = await allElements[index].$eval('.profile a', element => element.href.trim())
        data.push({
            index,
            subject,
            duration,
            salary,
            company,
            date,
            apply
        })
    }

    browser.close()
    return data
}

async function prepareDataForStorage(){
    const data = await getDataFromInternshala()
    let preparedData = ""

    for(let i = 0; i < data.length; i++){
        preparedData += `${data[i].index}) ${data[i].subject}
duration: ${data[i].duration}
salary: ${data[i].salary}
date: ${data[i].date}
company: ${data[i].company}
apply: ${data[i].apply}\n\n`
    }

    return preparedData
}

async function storeDataInTextFile(){
    const data = await prepareDataForStorage()

    fs.writeFile('data.txt', data, function (err) {
        if (err) throw err
        console.log('Saved successfully !')
    });
}

(async () => {
    await storeDataInTextFile()
})()