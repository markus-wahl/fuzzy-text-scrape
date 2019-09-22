import fs = require('fs')
import { Attribute } from './attribute'
import { Scraper } from './scraper'
import { ScrapeTarget } from '../targets/target'
import { ScrapeTargetsLoader } from '../targets/loader'

const args = require('yargs').argv

console.log('Input file: ' + args.inputFile)
console.log('Scrape targets file: ' + args.scrapeTargetsFile)

let targets: ScrapeTarget[] = ScrapeTargetsLoader.load(args.scrapeTargetsFile)

console.log(targets.length + ' scrape targets')

let scraper: Scraper = new Scraper(targets)
let attributes: Attribute[] = scraper.scrapeAttributesFromFile(args.inputFile)

attributes.forEach(function(attribute: Attribute) {
    console.log(attribute)
})

if(attributes.length == 0) {
	console.log("Scrape failure. No attributes found")
} else if(attributes.length < targets.length) {
	console.log("Scrape failure. Only " + attributes.length + " attributes out of " + targets.length + " found")
}