export type SectionGroup = {
  id?: string
  label: string
  html: string
  purpose?: string
  inputs?: string[]
  outputs?: string[]
  steps?: string[]
  metrics?: string[]
  callout?: string
}

export type SectionTab = {
  id: string
  label: string
  panelId: string
  groups: SectionGroup[]
}

export type SectionContent = {
  slug: string
  file: string
  title: string
  tabs: SectionTab[]
}
