import { Scraper } from "../../scrape/scraper"
import { ScrapeTarget, Type } from "../../targets/target"
import { Attribute } from '../../scrape/attribute'

let testee: Scraper

let unitLessTarget: ScrapeTarget = {
	  "attributeKeys": [
	  	"Anl.nr"
	  ],
	  "type": "WITHOUT_UNIT",
	  "numberOfValues": 1
	}

let unitLessAttribute: Attribute = {
	  "key": "Anl.nr",
	  "values": ['41910608']
	}

let unitLessMultipleValuesTarget: ScrapeTarget = {
	  "attributeKeys": [
	  	"Fakturaperiod"
	  ],
	  "type": "WITHOUT_UNIT",
	  "numberOfValues": 2
	}

let unitLessMultipleValuesAlternativeLocaleTarget: ScrapeTarget = {
	  "attributeKeys": [
	  	"Invoice period",
	  	"Fakturaperiod"
	  ],
	  "type": "WITHOUT_UNIT",
	  "numberOfValues": 2
	}

let unitLessMultipleValuesAttribute: Attribute = {
	  "key": "Fakturaperiod",
	  "values": ['2018 11 01', '2018 12 01']
	}

let unitTarget: ScrapeTarget = {
	  "attributeKeys": [
	  	"Summa exkl. moms"
	  ],
	  "type": "UNIT",
	  "numberOfValues": 1
	}

let unitAttribute: Attribute = {
	  "key": "Summa exkl. moms",
	  "values": ['16 783,81 kr']
	}

let derivedUnitTarget: ScrapeTarget = {
	 "attributeKeys": [
	  	"Energipris"
	  ],
	  "type": "DERIVED_UNIT",
	  "numberOfValues": 1
	}

let derivedUnitAttribute: Attribute = {
	  "key": "Energipris",
	  "values": ['36.12 öre/kWh']
	}

it('Unit less attribute can be scraped from isolated content', () => {
    testee = new Scraper([unitLessTarget])

	let scrapedAttributes: Attribute[] = testee.scrapeAttributes(['                                 Anl.nr: 41910608                      '])

    expect(scrapedAttributes.length).toBe(1)
    expect(scrapedAttributes[0]).toEqual(unitLessAttribute)
})

it('Unit less attribute can be scraped from content with simple and irrelevant context', () => {
    testee = new Scraper([unitLessTarget])
	let content: string[] = ['                                 Momsreg.nr/F-skatt SE559087574501',
	'',
	'',
	'',
	'	                                 Anl.nr: 41910608                      Anläggningsadress: Torget 6',
	'	                                 Mätarnr: 113474 ']

	let scrapedAttributes: Attribute[] = testee.scrapeAttributes(content)

    expect(scrapedAttributes.length).toBe(1)
    expect(scrapedAttributes[0]).toEqual(unitLessAttribute)
})

it('Unit less multiple values attribute can be scraped', () => {
    testee = new Scraper([unitLessMultipleValuesTarget])

	let scrapedAttributes: Attribute[] = testee.scrapeAttributes(['                                 Fakturaperiod 2018 11 01 - 2018 12 01'])

    expect(scrapedAttributes.length).toBe(1)
    expect(scrapedAttributes[0]).toEqual(unitLessMultipleValuesAttribute)
})

it('Alternative attribute key local can be scraped', () => {
    testee = new Scraper([unitLessMultipleValuesAlternativeLocaleTarget])

	let scrapedAttributes: Attribute[] = testee.scrapeAttributes(['                                 Fakturaperiod 2018 11 01 - 2018 12 01'])

    expect(scrapedAttributes.length).toBe(1)
    expect(scrapedAttributes[0]).toEqual(unitLessMultipleValuesAttribute)
})

it('Unit attribute can be scraped', () => {
    testee = new Scraper([unitTarget])

	let scrapedAttributes: Attribute[] = testee.scrapeAttributes(['Summa exkl. moms                                              16 783,81 kr'])

    expect(scrapedAttributes.length).toBe(1)
    expect(scrapedAttributes[0]).toEqual(unitAttribute)
})

it('Derived unit attribute can be scraped', () => {
    testee = new Scraper([derivedUnitTarget])

	let scrapedAttributes: Attribute[] = testee.scrapeAttributes(['Energipris fjärrvärme                2018 11 01 - 2018 12 01   23920.0 kWh    36.12 öre/kWh            8 639,90 kr'])

    expect(scrapedAttributes.length).toBe(1)
    expect(scrapedAttributes[0]).toEqual(derivedUnitAttribute)
})
