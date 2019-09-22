export type Type = "WITHOUT_UNIT" | "UNIT" | "DERIVED_UNIT"

export interface ScrapeTarget {
    attributeKeys: string[]
    type: Type
    numberOfValues: number
}