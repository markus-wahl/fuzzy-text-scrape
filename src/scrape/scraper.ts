import { ScrapeTarget, Type } from "../targets/target"
import { Attribute } from './attribute'
import { LocalDate } from 'js-joda'
import fs = require('fs')

class AttributeImplementation implements Attribute {
    key: string = ''
    values: string[] = []

    constructor(key: string, values: string[]) {
        this.key = key
        this.values = values
    }
}

export class Scraper {
    targets: ScrapeTarget[]

    constructor(targets: ScrapeTarget[]) {
        this.targets = targets
    }

    scrapeAttributesFromFile(inputFilename: string): Attribute[] {
        let fileContent: string[] = fs.readFileSync(inputFilename).toString().split("\n")
        return this.scrapeAttributes(fileContent)
    }

    scrapeAttributes(lines: string[]): Attribute[] {
        let scrapedAttributes: Attribute[] = []
        for (let target of this.targets) {
            let scrapedAttribute = this.scrapeAttributeFromLines(target, lines)
            if(scrapedAttribute) {
                scrapedAttributes.push(scrapedAttribute)
            }
        }
        return scrapedAttributes
    }

    private scrapeAttributeFromLines(target: ScrapeTarget, lines: string[]): Attribute | undefined {
        for (let line of lines) {
            let match = this.scrapeAttribute(target, line)
            if(match) {
                return match
            }
        }
        return undefined
    }

    private scrapeAttribute(target: ScrapeTarget, line: string): Attribute | undefined {
        for (let key of target.attributeKeys) {
            if(line.includes(key)) {
                if(target.type === "WITHOUT_UNIT") {
                    let textAttribute: Attribute | undefined = this.scrapeUnitLessAttribute(key, target, line)
                    if(textAttribute) {
                        return textAttribute
                    }
                } else if(target.type === "UNIT") {
                    let unitAttribute: Attribute | undefined = this.scrapeUnitAttribute(key, target, line)
                    if(unitAttribute) {
                        return unitAttribute
                    }
                } else if(target.type === "DERIVED_UNIT") {
                    let derivedUnitAttribute: Attribute | undefined = this.scrapeDerivedUnitAttribute(key, target, line)
                    if(derivedUnitAttribute) {
                        return derivedUnitAttribute
                    }
                }
            }
        }
        return undefined
    }

    private scrapeUnitAttribute(key: string, target: ScrapeTarget, line: string): Attribute | undefined {
        let tokens: string[] = line.split(/\s{2,}/)

        for (let i: number = 0; i < tokens.length; i++) {
            let token: string = tokens[i];
            if(token.includes(key)) {
                if(i < tokens.length - 1) {
                    let valueWithUnit: string = tokens[i + 1]
                    return new AttributeImplementation(key, [valueWithUnit])
                }
            }
        }
        return undefined
    }

    private scrapeDerivedUnitAttribute(key: string, target: ScrapeTarget, line: string): Attribute | undefined {
        let tokens: string[] = line.split(/\s{2,}/)

        let found: boolean = false
        for (let token of tokens) {
            if(found) {
                if(token.match(/(\/|per)/)) {
                    return new AttributeImplementation(key, [token])
                }
            } else if(token.includes(key)) {
                found = true
            }
        }
        
        return undefined
    }

    private scrapeUnitLessAttribute(key: string, target: ScrapeTarget, line: string): Attribute | undefined {
        if(target.numberOfValues > 1) {
            return this.scrapeUnitLessValues(key, target, line)
        }
        return this.scrapeUnitLessValue(key, target, line)
    }

    private scrapeUnitLessValues(key: string, target: ScrapeTarget, line: string): Attribute | undefined {
        let valuesCandidatePortion: string = line.substring(line.indexOf(key) + key.length + 1)
        let valueCandidates: string[] = valuesCandidatePortion.split('-')
        if(valueCandidates.length >= target.numberOfValues) {
           let values: string[] = []
           for (let valueCandidate of valueCandidates) {
               if(values.length < target.numberOfValues) {
                   values.push(valueCandidate.trim())
               }
               if(values.length == target.numberOfValues) {
                   return new AttributeImplementation(key, values)
               }
           }
        }
        return undefined
    }

    private scrapeUnitLessValue(key: string, target: ScrapeTarget, line: string): Attribute | undefined {
        let tokens: string[] = (line.match(/[^ ]+/g))!

        for (let i: number = 0; i < tokens.length; i++) {
            let token: string = tokens[i];
            if(token.includes(key)) {
                if(i < tokens.length - 1) {
                    let value = tokens[i + 1]
                    return new AttributeImplementation(key, [value])
                }
            }
        }
        return undefined
    }
}