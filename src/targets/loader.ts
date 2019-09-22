import { ScrapeTarget, Type } from "./target"
import fs = require('fs')

class Target implements ScrapeTarget {
    attributeKeys: string[] = []
    type: Type = "WITHOUT_UNIT"
    numberOfValues: number = 1

    constructor(template: ScrapeTarget) {
        if (template.attributeKeys) {
            this.attributeKeys = template.attributeKeys
        }
        if (template.type) {
            this.type = template.type
        }
        if (template.numberOfValues) {
            this.numberOfValues = template.numberOfValues
        }
    }
}

export class ScrapeTargetsLoader {
    static load(targetsFilename: string): ScrapeTarget[] {
        let targetsJson: string = (fs.readFileSync(targetsFilename)).toString()
        let loadedTargets: ScrapeTarget[] = JSON.parse(targetsJson)
        let parsedTargets: ScrapeTarget[] = []

        loadedTargets.forEach(function(loadedTarget: ScrapeTarget) {
            let parsedTarget: Target = new Target(loadedTarget)
            parsedTargets.push(parsedTarget)
        })

        return parsedTargets
    }
}